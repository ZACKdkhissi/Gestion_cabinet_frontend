import React, { useState } from 'react';
import * as dateFns from "date-fns";
import "./Card.css";
import { fr } from 'date-fns/locale';

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
  
    return (
      <div className={`modal ${isOpen ? 'open' : ''} modal-small`}>
       <div style={{ marginLeft: "14cm" }}>
       <i
        className="fas fa-times absolute top-2 right-2 cursor-pointer text-green-500"
        onClick={onClose}
      ></i>
        </div> <br></br>
        <h6>{dateFns.format(selectedDate, 'dd/MM/yyyy')}</h6>
        <div >
<table className="items-center w-full bg-transparent border-collapse text-sm">
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
        Nom du patient
      </th>
      <th
        className={
          "px-3 align-middle border border-solid py-2 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        }
      >
        Nouveau patient
      </th>
      <th
        className={
          "px-3 align-middle border border-solid py-2 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
        }
      >
        Patient existant
      </th>
      {/* Ajoutez d'autres en-têtes de colonnes si nécessaire */}
    </tr>
  </thead>
  <tbody>
    {generateTimeSlots().map((timeSlot, index) => (
      <tr key={index}>
      <td
        className={
          "border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2"
        }
      >
        {dateFns.format(timeSlot, "HH:mm")}
      </td>
      <td
        className={
          "border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2"
        }
      >
        test
      </td>
      <td
        className={
          "border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2"
        }
      >
        <i
      className="fas fa-user-plus cursor-pointer text-green-500 mr-2"
    ></i>
      </td>
      <td
        className={
          "border-t px-3 align-middle border-l-0 border-r-0 whitespace-nowrap p-2"
        }
      >
        <i
      className="fas fa-list cursor-pointer text-purple-500 ml-2"
      ></i>
      </td>
      {/* Ajoutez ici d'autres colonnes pour les autres champs de saisie */}
    </tr>
    ))}
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
