import React, { useContext, useEffect, useState } from "react";
import { Calendar, momentLocalizer, Toolbar } from 'react-big-calendar';


const MyToolbar = ({ localizer: { messages }, label, onNavigate }) => {
    const handleNavigate = (navigate) => {
      onNavigate(navigate);
    };
  
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button onClick={() => handleNavigate('PREV')}>{messages.previous}</button>
          <button onClick={() => handleNavigate('TODAY')}>{messages.today}</button>
          <button onClick={() => handleNavigate('NEXT')}>{messages.next}</button>
        </span>
        <span className="rbc-toolbar-label">{label}</span>
      </div>
    );
  };

  export default MyToolbar;