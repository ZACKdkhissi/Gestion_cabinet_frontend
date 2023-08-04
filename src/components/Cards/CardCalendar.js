import React, { useContext, useEffect, useState } from 'react';
import * as dateFns from "date-fns";
import "./Card.css";
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from 'contexts/AuthContext';
import createApiInstance from 'api/api';
import Select from 'react-select';


const formatOfDay = 'd';
const formatOfYear = 'yyyy';
const formatOfMonth = 'MMM';
const formatOfWeek = 'eee';
const formatOfWeekOptions = { locale: fr };



const Modal = ({ isOpen, onClose, selectedDate }) => {

  

  
  
    const generateTimeSlots = () => {
      const startTime = dateFns.setHours(dateFns.startOfDay(selectedDate), 8);
      const endTime = dateFns.setHours(dateFns.endOfDay(selectedDate), 18);
      const timeSlots = [];
      let currentTime = startTime;
  
      while (dateFns.isBefore(currentTime, endTime)) {
        timeSlots.push(currentTime);
        currentTime = dateFns.addMinutes(currentTime, 30);
      }
  
      return timeSlots;
    };

    const { token } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [selectedPatientIds, setSelectedPatientIds] = useState(
      generateTimeSlots(selectedDate).map(() => '')
    );
    const [selectedPatientId, setSelectedPatientId] = useState('');

    const apiInstance = createApiInstance(token);
    

    useEffect(() => {
      fetchPatients();
      fetchReservedAppointments();
    }, []);
  
    const fetchPatients = () => {
      apiInstance
        .get('/api/patients')
        .then((response) => {
          // Mettez à jour l'état des patients avec les données récupérées depuis le backend
          setPatients(response.data);
        })
        .catch((error) => {
          // Gérez les erreurs ici
          console.error('Error fetching patients:', error);
        });
    };

    const [reservedAppointments, setReservedAppointments] = useState([]);
    const fetchReservedAppointments = () => {
      apiInstance
        .get(`/api/rendezvous/date/${dateFns.format(selectedDate, 'dd-MM-yyyy')}`)
        .then((response) => {
          console.log('API Response:', response.data); // Vérifiez les données renvoyées par l'API
    
          // Formater les dates/heure renvoyées par l'API
          const formattedReservedAppointments = response.data.map((appointment) => ({
            ...appointment,
            heure: dateFns.format(dateFns.parse(appointment.heure, 'HH:mm', new Date()), "HH:mm"),
          }));
          console.log('Formatted Reserved Appointments:', formattedReservedAppointments); // Vérifiez les données après formatage
          setReservedAppointments(formattedReservedAppointments);
        })
        .catch((error) => {
          console.error('Error fetching reserved appointments:', error);
        });
    };
    
  const [rendezvousData, setRendezvousData] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les données de l'API
    const fetchRendezvousData = async () => {
      try {
        const response = await apiInstance.get(`http://localhost:8080/api/rendezvous/date/${dateFns.format(selectedDate, 'dd-MM-yyyy')}`);
        setRendezvousData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRendezvousData();
  }, [selectedDate]);

    const occupiedAppointments = rendezvousData.filter(
      (appointment) =>
        dateFns.isEqual(dateFns.parseISO(appointment.date), selectedDate)
    );

    


    
    
  


    

    
  


    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("success"); // 'success' ou 'error'
    const [alertMessage, setAlertMessage] = useState("");
  
    const [selectedFormattedDate, setSelectedFormattedDate] = useState(
      dateFns.format(selectedDate, 'dd-MM-yyyy')
    );
  
    const [newRendezvous, setNewRendezvous] = useState({
      date: selectedFormattedDate,
      heure: "",
      type: "",
      statut: 0,
      patient: {
        id_patient: selectedPatientId
      }
    });
  
    const [selectedTypes, setSelectedTypes] = useState(generateTimeSlots(selectedDate).map(() => ''));

const handleInputChange = (event, index) => {
  const { name, value } = event.target;
  setSelectedTypes((prevSelectedTypes) => {
    const newSelectedTypes = [...prevSelectedTypes];
    newSelectedTypes[index] = value;
    return newSelectedTypes;
  });
};
    
  
const handleSubmit = (event, time, index) => {
  setNewRendezvous((prevRendezVous) => ({
    ...prevRendezVous,
    heure: time,
    type: selectedTypes[index], // Mise à jour du type avec selectedTypes[index]
    patient: {
      id_patient: selectedPatientIds[index],
    }
  }));

      event.preventDefault();
      apiInstance
        .post("/api/rendezvous", newRendezvous)
        .then((response) => {
          console.log("Rendezvous added successfully:", response.data);
          setShowAlert(true);
          setAlertType("success");
          setAlertMessage("Rendezvous added successfully.");
          onClose();
        })
        .catch((error) => {
          console.error("Error adding rendezvous:", error);
          setShowAlert(true);
          setAlertType("error");
          setAlertMessage("Error adding rendezvous. Please try again.");
        });
    };
    

    
   const [searchQueries, setSearchQueries] = useState(
    generateTimeSlots(selectedDate).map(() => '')
  );

  const handlePatientSelect = (index, patientId) => {
    setSelectedPatientIds((prevSelectedIds) => {
      const newSelectedIds = [...prevSelectedIds];
      newSelectedIds[index] = patientId;
      return newSelectedIds;
    });
  };
  

  const [searchQuery, setSearchQuery] = useState('');

  const [filteredOptions, setFilteredOptions] = useState([]);





const handleChangeSearch = (searchValue) => {
  const filtered = patients.filter((patient) => {
    const fullName = `${patient.cin} ${patient.nom} ${patient.prenom}`;
    return fullName.toLowerCase().includes(searchValue.toLowerCase());
  });
  setFilteredOptions(filtered);
  setSearchQuery(searchValue);
};
  

function existRendez(a, rendezvousData) {
  return rendezvousData.find(
    (appointment) => appointment.heure === a
  );
}




 
    
    return (
      <div className={`modal ${isOpen ? 'open' : ''} modal-small`}>


       <div style={{ marginLeft: "14cm" }}>
       <i
        className="fas fa-times absolute top-2 right-2 cursor-pointer text-green-500"
        onClick={onClose}
      ></i>
        </div> <br></br>
        <h6>{dateFns.format(selectedDate, 'dd-MM-yyyy')}</h6>
        <div >
<table className="items-center w-full bg-transparent border-collapse text-sm">
{/*showAlert && (
      <div className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-error'}`}>
        {alertMessage}
      </div>
)                                  */}
  <thead>
  <tr>
      <th
        className={
          "px-3 align-middle border border-solid py-2 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        }
      >
        Heure
      </th>
      <th
        className={
          "px-3 align-middle border border-solid py-2 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        }
      >
         patient
      </th>
      <th
        className={
          "px-3 align-middle border border-solid py-2 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        }
      >
        Type
      </th>
      
      <th
        className={
          "px-3 align-middle border border-solid py-2 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        }
      >
      </th>
      {/* Ajoutez d'autres en-têtes de colonnes si nécessaire */}
    </tr>
  </thead>
  <tbody>
  {generateTimeSlots().map((timeSlot, index) => {
   
   const rendezVousTrouve = existRendez(dateFns.format(timeSlot, "HH:mm"), rendezvousData);
    
   return rendezVousTrouve ? (
     <tr key={index}>
       <td className="border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
         {dateFns.format(timeSlot, "HH:mm")}
       </td>
       <td className="border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
        {rendezVousTrouve.patient.cin}, {rendezVousTrouve.patient.nom}, {rendezVousTrouve.patient.prenom} 

       </td>
       <td className="border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
       {rendezVousTrouve.type}
       </td>
     </tr>
   ) :  (

    <tr key={index}>
      
      <td className="border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
        {dateFns.format(timeSlot, "HH:mm")}
      </td>
      <td className="border-t px-20 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
        <Select
          placeholder="Sélectionner un patient"
          className="w1"
          options={filteredOptions.map((patient) => ({
            value: patient.id_patient,
            label: `${patient.cin} || ${patient.nom} || ${patient.prenom}`,
          }))}
          onChange={(selectedOption) => handlePatientSelect(index, selectedOption.value)}
          onInputChange={(inputValue) => handleChangeSearch(inputValue)}
          value={filteredOptions.find((option) => option.value === selectedPatientIds[index])}
          isSearchable
        />
      </td>
      <td className="border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
        <select
          name="type"
          value={selectedTypes[index]}
          onChange={(event) => handleInputChange(event, index)}
          className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring"
        >
          <option value="">Sélectionner un type</option>
          <option value="consultation">Consultation</option>
          <option value="controle">Contrôle</option>
        </select>
      </td>
      <td className="border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2">
        <form onSubmit={(event) => handleSubmit(event, dateFns.format(timeSlot, "HH:mm"), index)}>
          <button className='w2' type="submit"> <i className="fas fa-plus"></i></button>
        </form>
      </td>
    </tr> );
  })}
</tbody>

</table>
</div>

        
      </div>
    );
  };

const CardCalendar = () => {

  
    const [currentDate, setCurrentDate] = useState(new Date());
    const firstDay = dateFns.startOfMonth(currentDate);
    const lastDay = dateFns.lastDayOfMonth(currentDate);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);



    const startDate = dateFns.startOfWeek(firstDay, { weekStartsOn: 1 });
    const endDate = dateFns.endOfWeek(lastDay, { weekStartsOn: 1 });

    const totalDate = dateFns.eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    for (let i = 0; i < totalDate.length; i += 7) {
        weeks.push(totalDate.slice(i, i + 7));
    }

    const handlePreviousMonth = () => {
        setCurrentDate(dateFns.subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(dateFns.addMonths(currentDate, 1));
    };

    const handleDayClick = (clickedDate) => {
        if (isSameMonth(clickedDate, currentDate)) {
          setShowModal(true);
          setSelectedDate(clickedDate);
        }
      };

      const handleCloseModal = () => {
        setShowModal(false);
      };
      

    const isSameMonth = (date1, date2) =>
  dateFns.isSameMonth(date1, date2);



  

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="calendar-header">
                <button className="prev-button" onClick={handlePreviousMonth}>Précédent</button>
                <span className="current-month">{dateFns.format(currentDate, 'MMMM yyyy')}</span>
                <button className="next-button" onClick={handleNextMonth}>Suivant</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                {weeks[0].map((date, dateIndex) => (
                    <span  key={dateIndex}  >{dateFns.format(date, formatOfWeek,formatOfWeekOptions)}</span>
                ))}
                {weeks.map((week, weekIndex) => (
                    week.map((date, dateIndex) => (
                        <span
                        onClick={() => handleDayClick(date)}

                        key={dateIndex}
                        className={`calendar-day ${
                            !isSameMonth(date, currentDate) ? 'other-month-day' : ''
                        }`}
                        >
                        {dateFns.format(date, formatOfDay)}
                        </span>
                    ))
                ))}
            </div>
            {showModal && <Modal isOpen={showModal} onClose={handleCloseModal} selectedDate={selectedDate} />}
            </div>
        </div>
    );
};

export default CardCalendar;
