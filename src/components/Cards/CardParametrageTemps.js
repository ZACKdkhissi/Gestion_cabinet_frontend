import React, { useContext, useEffect, useState } from 'react';
import createApiInstance from 'api/api';
import { AuthContext } from 'contexts/AuthContext';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ParametrageTemps = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [outsideIntervalAppointments, setOutsideIntervalAppointments] = useState([]);
  const history = useHistory();

  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);

  const fetchAppointmentsForDate = async (formattedDate) => {
    try {
      const response = await apiInstance.get(`/api/rendezvous/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        history.push('/401');
      }
      throw error;
    }
  };

  const [intervals, setIntervals] = useState([]);

    const fetchIntervals = async () => {
      try {
        const response = await apiInstance.get('/api/intervals');
        setIntervals(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      }
    };

    useEffect(() => {
      fetchIntervals();
      //eslint-disable-next-line
    }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      setAlertType('error');
      setAlertMessage('Selectionnez une date valide!');
      setShowAlert(true);
      return;
    }

    const formattedDate = format(new Date(date), 'dd-MM-yyyy');
    const todayDate = format(new Date(), 'dd-MM-yyyy');
    
    if (formattedDate < todayDate) {
      setAlertType('error');
      setAlertMessage('La date doit être supérieure ou égale à aujourd\'hui!');
      setShowAlert(true);
      return;
    }

    if (intervals.some(interval => interval.date === formattedDate)) {
      setAlertType('error');
      setAlertMessage('La date a déjà été paramétrée!');
      setShowAlert(true);
      return;
    }
    
    

    const parsedStartTime = parseInt(startTime, 10);
    const parsedEndTime = parseInt(endTime, 10);

    if (isNaN(parsedStartTime) || isNaN(parsedEndTime) || parsedStartTime < 8 || parsedEndTime > 19) {
      setAlertType('error');
      setAlertMessage('Entrez des valeurs entre 08h et 19h!');
      setShowAlert(true);
      return;
    }

    if (parsedStartTime >= parsedEndTime) {
      setAlertType('error');
      setAlertMessage(`L'heure de départ doit être avant l'heure de fin!`);
      setShowAlert(true);
      return;
    }

    try {
      const formattedDate = format(new Date(date), 'dd-MM-yyyy');
      const appointments = await fetchAppointmentsForDate(formattedDate);
      const filteredAppointments = appointments.filter((appointment) => {
        const appointmentHour = parseInt(appointment.heure.split(':')[0], 10);
        const isOutsideInterval =
          appointmentHour < parsedStartTime || appointmentHour >= parsedEndTime;
        return isOutsideInterval;
      });

      setOutsideIntervalAppointments(filteredAppointments);

      if (filteredAppointments.length > 0) {
        setAlertType('error');
        setAlertMessage('Vous avez des rendez-vous à paramétrer cette journée!');
        setShowAlert(true);
      } else {
        await apiInstance.post('/api/intervals', {
          date: formattedDate,
          startTime,
          endTime,
        });

        setDate('');
        setStartTime('');
        setEndTime('');
        setAlertType('success');
        setAlertMessage(`Paramétrage de la journée ${formattedDate} a été fait avec succès!`);
        setShowAlert(true);
        fetchIntervals();
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response.data);
      setShowAlert(true);
      if (error.response && error.response.status === 401) {
        history.push('/401');
      }
    }
  };

  const handleDeleteParametrage = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce paramétrage ?");
    if (confirmDelete) {
      try {
        await apiInstance.delete(`/api/intervals/${id}`);
        fetchIntervals();
      } catch (error) {
        setAlertType('error');
        setAlertMessage(error.data);
        setShowAlert(true);
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      }
    }
  };

  const ModifyAppointment = ({ appointment }) => {
    const [rendezvousData, setRendezvousData] = useState(appointment);
    const [isEditing, setIsEditing] = useState(true);
    const [formattedDate, setFormattedDate] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
      if (rendezvousData.date) {
        const parts = rendezvousData.date.split('-');
        if (parts.length === 3) {
          setFormattedDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
    }, [rendezvousData.date]);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      if (event.target.type === 'date') {
        const parts = value.split('-');
        if (parts.length === 3) {
          const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          setRendezvousData({
            ...rendezvousData,
            [name]: formattedDate,
          });
        }
      } else {
        setRendezvousData({
          ...rendezvousData,
          [name]: value,
        });
      }
    };
  
    const handleCallPatient = () => {
      const patientTelephone = rendezvousData.patient.telephone;
      if (patientTelephone !== null) {
        window.location.href = `tel:${patientTelephone}`;
      }
    };
  
    const handleUpdateClick = async () => {
      try {
        const appointments = await fetchAppointmentsForDate(rendezvousData.date);
        const isHourAlreadyExist = appointments.some((appointment) => {
          return appointment.heure === rendezvousData.heure;
        });
    
        if (isHourAlreadyExist) {
          setAlertMessage("L'heure est déjà prise!");
        } else if (!isValidHourFormat(rendezvousData.heure)) {
          setAlertMessage("Heure invalide! 08<= Heure-+30 min <19");
        } else {
          setAlertMessage('');
          await apiInstance.put(`/api/rendezvous/${appointment.id_rdv}`, {
            ...rendezvousData,
          });
          setIsEditing(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      }
    };
    
    const isValidHourFormat = (heure) => {
      const regex = /^(0[8-9]|1[0-8]):(00|30)$/;
      return regex.test(heure);
    };

    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    return (
      <>
        <tbody>
          <tr>
            <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left">
              {rendezvousData.patient.nom || "-"} {rendezvousData.patient.prenom || "-"}
            </td>
            <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left min-w-140-px">
              {rendezvousData.type || "-"}
            </td>
            <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left min-w-140-px">
              {isEditing ? (
                <input
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                  type="date"
                  name="date"
                  value={formattedDate}
                  onChange={handleChange}
                />
              ) : (
                <span>{rendezvousData.date}</span>
              )}
            </td>
            <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left min-w-140-px">
              {isEditing ? (
                <>
                <input
                  className="border-0 px-1 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                  type="text"
                  name="heure"
                  value={rendezvousData.heure}
                  onChange={handleChange}
                />
                {alertMessage && (
                  <div className="text-red-500 text-xs mt-1">{alertMessage}</div>
                )}
                </>
              ) : (
                <span>{rendezvousData.heure}</span>
              )}
            </td>
            <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left min-w-140-px">
              {rendezvousData.patient.telephone || "-"}
            </td>
            <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-center min-w-140-px">
              {rendezvousData.patient.telephone ? (
                <button
                  className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 ease-linear transition-all duration-150"
                  onClick={handleCallPatient}
                >
                  <i className="fas fa-phone" />
                </button>
              ) : (
                ""
              )}
              {isEditing ? (
                <button
                  className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={handleUpdateClick}
                >
                  Modifier
                </button>
              ) : (
                <button 
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={handleEditClick}>
                  <i className="fas fa-pen"></i>
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </>
    );
  };

  const today = format(new Date(), 'dd-MM-yyyy');

  return (
    <>
    <div className="flex flex-wrap mt-4">
    <div className="w-full md:w-6/12 mb-4 md:mb-0">
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white" style={{ width: "99%", minHeight: "8cm",maxHeight: "8cm", overflowY: "auto" }}>
        <div className="rounded-t  bg-white mb-0 px-4 py-3">
          <div className="flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold uppercase">
                Liste des journées paramétrées
            </h6>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
          <thead>
              <tr>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 "
                  }
                >
                  Date
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 min-w-140-px"
                  }
                >
                  Heure de départ
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 min-w-140-px"
                  }
                >
                  Heure de fin
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
            {intervals
  .filter(interval => {
    const intervalDate = interval.date;
    return intervalDate >= today;
  })
  .map((interval) => (
              <tr key={interval.id}>
                <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left">
                {interval.date}
                </td>
                <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left min-w-140-px">
                {interval.startTime < 10 ?`0${interval.startTime}:00`: `${interval.startTime}:00`}
                </td>
                <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left min-w-140-px">
                {interval.endTime < 10 ?`0${interval.endTime}:00`: `${interval.endTime}:00`}
                </td>
                <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-right min-w-140-px">
                <button
                    className="text-red-500 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                    onClick={() => handleDeleteParametrage(interval.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
            </table>
          </div>
      </div>
    </div>
      <div className="w-full md:w-6/12 mb-4">
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0" style={{ width: "99%",minHeight: "8cm", overflowY: "auto"  }}>
        <div className="rounded-t bg-white mb-0 px-4 py-3">
          <div className="flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold uppercase">
                Paramétrer une journée
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleFormSubmit}>
        <div className="flex flex-wrap items-center justify-center py-4">
        <div className="lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
            <label  className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Date</label>
            <input
             className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
             type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            </div>
          </div>
          <div className="lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
            <label  className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Heure de départ</label>
            <input
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            </div>
          </div>
          <div className="lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
            <label  className="block uppercase text-blueGray-600 text-xs font-bold mb-2">heure de fin</label>
            <input
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              type="number"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
        <button
          className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs py-2 px-4 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150"
          type="submit"
        >
          Paramétrer
        </button>
      </div>
      </form>
        {showAlert && (
          <div className="mt-5">
            {alertType === 'error' ? (
              <i className="fa fa-times-circle mr-2"></i>
            ) : (
              <i className="fa fa-check-circle mr-2"></i>
            )}
            {alertMessage}
          </div>
        )}
        </div>
    </div>
    </div>
    </div>
    {outsideIntervalAppointments.length > 0 && (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <div className="rounded-t mb-0 px-4 py-3 border-0 text-center" >
            <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold lg:w-1/12 uppercase">Modifier les rendez-vous</h3>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
          <thead>
              <tr>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 "
                  }
                >
                  Patient
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 min-w-140-px"
                  }
                >
                  Type
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 min-w-140-px"
                  }
                >
                  Date
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 min-w-140-px"
                  }
                >
                  Heure
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 "
                  }
                >
                  Téléphone
                </th>
                <th
                  className={
                    "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                  }
                >
                </th>
              </tr>
            </thead>
            {outsideIntervalAppointments.map((appointment) => (
                <ModifyAppointment key={appointment.id_rdv} appointment={appointment} />
            ))}
            </table>
              </div>
        </div>
      )}
    </>
  );
};

export default ParametrageTemps;
