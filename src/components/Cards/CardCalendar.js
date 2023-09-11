  import React, { useContext, useEffect, useState } from 'react';
  import * as dateFns from "date-fns";
  import "./Card.css";
  import { fr } from 'date-fns/locale';
  import { AuthContext } from 'contexts/AuthContext';
  import createApiInstance from 'api/api';
  import Select from 'react-select';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

  const formatOfDay = 'd';
  const formatOfWeek = 'eee';
  const formatOfWeekOptions = { locale: fr };
  const CardRdv = ({ onClose, selectedDate, onSocialTrafficUpdate, onAddPatientClick, addedPatient}) => {
    const history = useHistory();
    const [timeSlots, setTimeSlots] = useState([]);
    
    useEffect(() => {
      const fetchIntervalData = async () => {
        try {
          const response = await apiInstance.get(`/api/intervals/${dateFns.format(selectedDate, 'dd-MM-yyyy')}`);
          if (response && response.data) {
            const intervalData = response.data;
            const startTime = dateFns.setHours(selectedDate, intervalData.startTime);
            const endTime = dateFns.setHours(selectedDate, intervalData.endTime);
            setTimeSlots(generateTimeSlots(startTime, endTime));
          } else {
            const defaultStartTime = dateFns.setHours(selectedDate, 8);
            const defaultEndTime = dateFns.setHours(selectedDate, 19);
            setTimeSlots(generateTimeSlots(defaultStartTime, defaultEndTime));
          }
        } catch (error) {
        }
      };
    
      fetchIntervalData();
      // eslint-disable-next-line
    }, [selectedDate]);

    const generateTimeSlots = (startTime, endTime) => {
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
      const apiInstance = createApiInstance(token);
      const [rendezvousData, setRendezvousData] = useState([]);
      const [selectedId,setSelectedId]= useState([]);

      const [selectedTypesError, setSelectedTypesError] = useState(generateTimeSlots(selectedDate).map(() => false));

      useEffect(() => {
        apiInstance
          .get('/api/patients')
          .then((response) => {
            const sortedPatients = response.data.sort((a, b) =>
          dateFns.compareDesc(
            new Date(a.created_at),
            new Date(b.created_at)
          )
        );
        setPatients(sortedPatients);
          })
          .catch((error) => {
          });
          //eslint-disable-next-line react-hooks/exhaustive-deps
        }, [addedPatient]);

    useEffect(() => {
      const fetchRendezvousData = async () => {
        try {
          const response = await apiInstance.get(`http://localhost:8080/api/rendezvous/date/${dateFns.format(selectedDate, 'dd-MM-yyyy')}`);
          setRendezvousData(response.data);
        } catch (error) {
        }
      };

      fetchRendezvousData();
      //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate,onSocialTrafficUpdate]);
    
      const [selectedTypes, setSelectedTypes] = useState(generateTimeSlots(selectedDate).map(() => ''));

  const handleInputChange = (event, index) => {
    setSelectedTypes((prevSelectedTypes) => {
      const newSelectedTypes = [...prevSelectedTypes];
      newSelectedTypes[index] = event.target.value;
      return newSelectedTypes;
    });
  };
      
    
  const handleSubmit = async (time, index) => {
    if (!selectedTypes[index]) {
      setSelectedTypesError((prevSelectedTypesError) => {
        const newSelectedTypesError = [...prevSelectedTypesError];
        newSelectedTypesError[index] = true;
        return newSelectedTypesError;
      });
      return;
    }
    const newRendezvous = {
      id_rdv: 0,
      date: dateFns.format(selectedDate, 'dd-MM-yyyy'),
      heure: time,
      type: selectedTypes[index],
      patient: {
        id_patient: selectedId,
      }
    };
  
    try {
      const rdvData = await apiInstance.get(`/api/rendezvous`);
      const rdvDataFiltered = rdvData.data.filter((item) => item.statut === 0 && item.patient.id_patient === selectedId);
      if (rdvDataFiltered.length > 0) {
        const confirmationMessage = rdvDataFiltered.map((item) => {
          return `Patient: ${item.patient.nom} ${item.patient.prenom}, Date: ${item.date}, Heure: ${item.heure}`;
        }).join("\n");

        const confirmed = window.confirm(`Ce patient a déjà des rendez-vous non traités:\n\n${confirmationMessage}\n\nVoulez-vous continuer?`);
        
        if (!confirmed) {
          return;
        }
      }
      await apiInstance.post("/api/rendezvous", newRendezvous);
      const updatedData = await fetchUpdatedData();
      setRendezvousData(updatedData);
      onSocialTrafficUpdate();        
    } catch (error) {
      if (error.response && error.response.status === 401) {
        history.push('/401');
      }
    }
  };
  


  const fetchUpdatedData = async () => {
    try {
      const response = await apiInstance.get(`/api/rendezvous/date/${dateFns.format(selectedDate, 'dd-MM-yyyy')}`);
      return response.data;
    } catch (error) {
    }
  };


    const handleChangeSearch = (searchValue) => {
      patients.filter((patient) => {
      const fullName = `${patient.cin} ${patient.nom} ${patient.prenom}`;
      return fullName.toLowerCase().includes(searchValue.toLowerCase());
      });
  };
    

  function existRendez(a, rendezvousData) {
    return rendezvousData.find(
      (appointment) => appointment.heure === a
    );
  }


  const handleDelete = (RdvId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce Rendez-vous ?");
    if(confirmDelete){
    apiInstance.delete(`/api/rendezvous/${RdvId}`)
      .then((response) => {
        onSocialTrafficUpdate();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      });}
  };

  const eventTypes = ['AID', 'VACANCES', 'REMARQUE'];


  const [eventTitle, setEventTitle] = useState('');
  const [customEventType, setCustomEventType] = useState('');

  const [endDate, setEndDate] = useState(selectedDate);


  const handleSubmite = () => {
    let finalEventTitle = eventTitle;

    if (eventTitle === "REMARQUE" && customEventType.trim() !== "") {
      finalEventTitle = customEventType;
    }

    const newEvent = {
      from_date: dateFns.format(selectedDate, 'dd-MM-yyyy'),
      to_date: dateFns.format(endDate, 'dd-MM-yyyy'),
      titre: finalEventTitle,
    };

    apiInstance
      .post("/api/events", newEvent)
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      });
  };

  const [showEventForm, setShowEventForm] = useState(false);

  const options = [
    { value: 'addPatient', label: 'Ajouter un nouveau patient' },
    ...patients.map((patient) => {
      const fullName = patient.cin? `${patient.cin} | ${patient.nom} ${patient.prenom}`: `${patient.nom} ${patient.prenom}`;
      const createdDate = new Date(patient.created_at);
      const filterDate = new Date();
      filterDate.setDate(filterDate.getDate() - 30);
      const isNewPatient = createdDate >= filterDate;
  
      return {
        value: patient.id_patient,
        label: isNewPatient ? `${fullName} *` : fullName,
      };
    }),
  ];
  

  const handleChange = (selectedOption) => {
    if (selectedOption.value === 'addPatient') {
      onAddPatientClick();
    } else {
      setSelectedId(selectedOption.value);
    }
  };

  const handleEventTypeChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "REMARQUE") {
      setEventTitle(selectedValue);
      setCustomEventType('');
    } else {
      setEventTitle(selectedValue);
      setCustomEventType('');
    }
  };




      return (
        <div className="absolute top-0 left-0 transform bg-blueGray-200 shadow-md rounded-lg w-full h-full p-6" 
        style={{
          maxHeight: 'calc(100%)',
          overflowY: 'auto',
        }}>
          <div className="event-header">
            <div className="flex items-center justify-between mt-5 mb-5">
              <h6 className="text-lg font-semibold uppercase w-full text-center ml-2">
                {dateFns.format(selectedDate, 'dd-MM-yyyy')}
              </h6>
              <button onClick={onClose} className="mr-2 focus:outline-none" >
              <i className="fas fa-times cursor-pointer"></i>
              </button>
            </div>
            
          </div>
          <div className="flex items-center justify-center text-center mt-5 mb-5">
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full"
            >
            Ajouter un événement
            </button>
            </div>
        
          {showEventForm && (
    <div className="event-form">
      <form onSubmit={handleSubmite}>
        <div className="flex justify-end">
          <button onClick={() => setShowEventForm(false)} className="cursor-pointer focus:outline-none">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <label>Type d'événement:</label>
        <select
              name="eventType"
              value={eventTitle}
              onChange={handleEventTypeChange}
              className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full"
              required
            >
              <option value="">Sélectionner un type</option>
              {eventTypes.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
            {eventTitle === "REMARQUE" && (
              <div>
                <label>Saisir un type d'événement personnalisé:</label>
                <input 
                  name="customEventType"
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                  className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full"
                  required
                />
              </div>
            )}
            



        <label>Date de fin:</label>
        <input
          type="date"
          value={dateFns.format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full"
        />

        <div>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none w-full"
            type="submit"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )}
          <div>
          <table className="w-full text-sm border-collapse">
              <thead>
              <tr>
                <th className="px-3 py-2">Heure</th>
                <th className="px-3 py-2 text-left">Patient</th>
                <th className="px-3 py-2 text-left">Motif</th>
                <th className="px-3 py-2"></th>
              </tr>
              </thead>
              <tbody>
    {timeSlots.map((timeSlot, index) => {
      
      const rendezVousTrouve = existRendez(dateFns.format(timeSlot, "HH:mm"), rendezvousData);
      

      return rendezVousTrouve ? (
        <tr key={index}>
          <td className="border-t px-3 py-2 text-center border-l-0 border-r-0 whitespace-nowrap">
            {dateFns.format(timeSlot, "HH:mm")}
          </td>
          <td className="border-t px-3 py-2 text-left border-l-0 border-r-0 whitespace-nowrap">
            {rendezVousTrouve.patient.cin ? `${rendezVousTrouve.patient.cin} | ${rendezVousTrouve.patient.nom} ${rendezVousTrouve.patient.prenom}` : `${rendezVousTrouve.patient.nom} ${rendezVousTrouve.patient.prenom}`}
          </td>
          <td className="border-t px-3 py-2 text-left border-l-0 border-r-0 whitespace-nowrap">
            {rendezVousTrouve.type}
          </td>
          <td className="border-t px-3 py-2 text-center border-l-0 border-r-0 whitespace-nowrap">
            <form
              onClick={(event) => {
                event.preventDefault();
                handleDelete(rendezVousTrouve.id_rdv);
              }}
            >
              <button className="focus:outline-none">
                <i className="fas fa-trash-alt"></i>
              </button>
            </form>
          </td>
        </tr>
      ) : (
        <tr key={index}>
          <td className="border-t px-3 py-2 text-center border-l-0 border-r-0 whitespace-nowrap">
            {dateFns.format(timeSlot, "HH:mm")}
          </td>
          <td className="border-t px-3 py-2 text-center border-l-0 border-r-0 whitespace-nowrap">
    <div className="flex items-center">
    <Select
    className="w-full border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
    placeholder="Sélectionner un patient"
    options={options}
    onChange={handleChange}
    onInputChange={(inputValue) => handleChangeSearch(inputValue)}
    isSearchable
  />
    </div>
      </td>
          <td className="border-t px-3 py-2 text-center border-l-0 border-r-0 whitespace-nowrap">
          <div className="flex items-center space-x-2">
          <label className='ml-1'>CS</label>
            <input
              type="radio"
              name="type"
              value="Consultation"
              checked={selectedTypes[index] === "Consultation"}
              onChange={(event) => handleInputChange(event, index)}
            />
            <label className='ml-1'>C</label>
            <input
              type="radio"
              name="type"
              value="Contrôle"
              checked={selectedTypes[index] === "Contrôle"}
              onChange={(event) => handleInputChange(event, index)}
            />
          </div>
          {selectedTypesError[index] && (
              <p className="text-red-500 text-xs mt-1 text-left">Choisir un type</p>
            )}
          </td>
          <td className="border-t px-3 py-2 text-center border-l-0 border-r-0 whitespace-nowrap">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(dateFns.format(timeSlot, "HH:mm"), index);
              }}
            >
              <button className="focus:outline-none" type="submit">
                <i className="fas fa-plus"></i>
              </button>
            </form>
          </td>
        </tr>
      );
    })}
  </tbody>

            </table>
            </div>
        </div>
      );
    };

  const CardCalendar = ({onSocialTrafficUpdate, onAddPatientClick, addedPatient}) => {
      const history = useHistory();
      const [currentDate, setCurrentDate] = useState(new Date());
      const firstDay = dateFns.startOfMonth(currentDate);
      const lastDay = dateFns.lastDayOfMonth(currentDate);
      const [showCardRdv, setShowCardRdv] = useState(false);
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
            setShowCardRdv(true);
            setSelectedDate(clickedDate);
          }
        };
        const handleCloseCardRdv = () => {
          setShowCardRdv(false);
        };
      const isSameMonth = (date1, date2) =>
      dateFns.isSameMonth(date1, date2);
    const { token } = useContext(AuthContext);
    const apiInstance = createApiInstance(token);
    const [rendezvousCounts, setRendezvousCounts] = useState({});
    const fetchRendezvousCounts = async () => {
          const counts = {};
          await Promise.all(totalDate.map(async (date) => {
          const formattedDate = dateFns.format(date, 'dd-MM-yyyy');
          try {
            const response = await apiInstance.get(`/api/rendezvous/date/count/${formattedDate}`);
            if (response) {
              counts[formattedDate] = response.data;
            }
          } catch (error) {
          }
        }));
        setRendezvousCounts(counts);
    };

    useEffect(() => {
      fetchRendezvousCounts();
      // eslint-disable-next-line
    }, [currentDate, onSocialTrafficUpdate]);

    const [eventsByDate, setEventsByDate] = useState({});
    const [eventsFetched, setEventsFetched] = useState(false);
    useEffect(() => {
      if (!eventsFetched) {
        const fetchEvents = async () => {
          try {
            const response = await apiInstance.get('/api/events');
            const events = response.data;
            const eventsByDate = {};
    
            events.forEach((event) => {
              const fromDate = dateFns.parse(event.from_date, 'dd-MM-yyyy', new Date());
              const toDate = dateFns.parse(event.to_date, 'dd-MM-yyyy', new Date());
              let currentDate = fromDate;
    
              while (!dateFns.isAfter(currentDate, toDate)) {
                const currentDateFormatted = dateFns.format(currentDate, 'dd-MM-yyyy');
                if (!eventsByDate[currentDateFormatted]) {
                  eventsByDate[currentDateFormatted] = [];
                }
                eventsByDate[currentDateFormatted].push(event);
                currentDate = dateFns.addDays(currentDate, 1);
              }
            });
    
            setEventsByDate(eventsByDate);
            setEventsFetched(true);
          } catch (error) {
            if (error.response && error.response.status === 401) {
              history.push('/401');
            }
          }
        };
        fetchEvents();
      }
      // eslint-disable-next-line
    }, [eventsFetched]);
    
    

      return (
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="calendar-header flex items-center justify-between">
                  <button className="bg-blueGray-700 text-white active:bg-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-3/12" onClick={handlePreviousMonth}>Précédent</button>
                  <span className="text-lg font-semibold uppercase">{dateFns.format(currentDate, 'MMMM yyyy', { locale: fr })}</span>
                  <button className="bg-blueGray-700 text-white active:bg-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-3/12" onClick={handleNextMonth}>Suivant</button>
              </div>
              <div className="grid grid-cols-7 gap-4">
                  {weeks[0].map((date, dateIndex) => (
                  
                      <span key={dateIndex}>{dateFns.format(date, formatOfWeek,formatOfWeekOptions)}</span>
                  ))}
                {weeks.map((week) => (
                  week.map((date) => {
                    const formattedDate = dateFns.format(date, 'dd-MM-yyyy');
                    const rendezvousCount = rendezvousCounts[formattedDate];
                    const events = eventsByDate[formattedDate];
                    const isWeekend = dateFns.isSaturday(date) || dateFns.isSunday(date);
                    const isPastDay = dateFns.isBefore(date, new Date(), { inclusive: false });
                    const shouldDisable = isWeekend || (isPastDay && !dateFns.isToday(date));
                  return (
                    <span 
                    key={date}
                    onClick={() => {if (!shouldDisable) {handleDayClick(date);}}}
                    className={`relative flex items-center justify-center border w-6rem h-16 cursor-pointer text-lg font-medium rounded text-white
                    ${!isSameMonth(date, currentDate) ? 'other-month-day' :
                    shouldDisable ? 'other-month-day' :
                    events? (
                      events.length > 1 ? (
                        events.every(event => event.titre === 'AID' || event.titre === 'VACANCES') ?
                        'aid-vacance' :
                        events.every(event => event.titre === 'AID' || event.titre !== 'VACANCES')?
                        'aid-others' :
                        events.every(event => event.titre !== 'AID' || event.titre === 'VACANCES')?
                        'vacance-others' :
                        'all-three'
                      ) : (
                        events[0].titre === 'AID' ?
                        'bg-red-500' :
                        events[0].titre === 'VACANCES' ?
                        'bg-green-700' :
                        'bg-yellow-500'
                      )
                    ) :
                    dateFns.isSaturday(date) ? 'other-month-day' :
                    dateFns.isSunday(date) ? 'other-month-day' :
                    dateFns.isToday(date) ? 'bg-lightBlue-600' :
                    'bg-blueGray-700'}`}
                  >
                      {dateFns.format(date, formatOfDay)}
                        <span className="text-xs absolute bottom-0 mb-1">
                          ({rendezvousCount})
                        </span>
                    </span>
                    );
                  })
              ))}
            </div>
        {showCardRdv && <CardRdv isOpen={showCardRdv} onClose={handleCloseCardRdv} selectedDate={selectedDate} onSocialTrafficUpdate={onSocialTrafficUpdate} onAddPatientClick={onAddPatientClick} addedPatient={addedPatient}/>}
    </div>
</div>                    
);
};

  export default CardCalendar;