import React, { useState } from 'react';


const EventForm = ({ onAddEvent }) => {
    const [event, setEvent] = useState({
      title: '',
      start: null,
      end: null,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEvent({ ...event, [name]: value });
    };
  
    const handleAdd = () => {
      if (event.title && event.start && event.end) {
        onAddEvent(event);
        setEvent({ title: '', start: null, end: null });
      }
    };
  
    return (
      <div>
        <h2>Ajouter un nouvel événement</h2>
        <input
          type="text"
          name="title"
          value={event.title}
          onChange={handleChange}
          placeholder="Titre de l'événement"
        />
        <input
          type="datetime-local"
          name="start"
          value={event.start}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="end"
          value={event.end}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>Ajouter</button>
      </div>
    );
  };
  
  export default EventForm;