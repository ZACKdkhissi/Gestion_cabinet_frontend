import React, { useState } from 'react';
import { Calendar, momentLocalizer, Toolbar } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal'; // Importez react-modal

Modal.setAppElement('#root'); // Remplacez '#root' par l'élément racine de votre application

const EventFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [eventData, setEventData] = useState({
      title: '',
      start: null,
      end: null,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEventData({ ...eventData, [name]: value });
    };
  
    const handleSubmit = () => {
      onSubmit(eventData);
      onClose();
    };
  
    return (
      <Modal isOpen={isOpen} onRequestClose={onClose}>
        <h2>Ajouter un nouvel événement</h2>
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          placeholder="Titre de l'événement"
        />
        <input
          type="datetime-local"
          name="start"
          value={eventData.start}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="end"
          value={eventData.end}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Ajouter</button>
        <button onClick={onClose}>Annuler</button>
      </Modal>
    );
  };

  export default EventFormModal;