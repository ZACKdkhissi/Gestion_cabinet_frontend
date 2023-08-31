import React, { useContext, useState } from 'react';
import createApiInstance from 'api/api';
import { AuthContext } from 'contexts/AuthContext';
import { format } from 'date-fns';


const ParametrageTemps = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [alertType, setAlertType] = useState(null); 
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = format(new Date(date), 'dd-MM-yyyy'); // Format the date correctly
      await apiInstance.post('/api/intervals', {
        date: formattedDate,
        startTime,
        endTime
      });

      setDate('');
      setStartTime('');
      setEndTime('');
      setAlertType("success");
      setAlertMessage("Calendrier Parametrer successfully.");
      setShowAlert(true);

    } catch (error) {
      console.error('Error creating interval:', error);
      setAlertType("error");
      setAlertMessage(error.response.data); 
      setShowAlert(true);
      // Handle error scenarios
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
    <div className="rounded-t bg-white mb-0 px-4 py-3">
      <h2 className="text-xl font-semibold">Pramétrage du calendrier</h2>
      <br></br>
      <form onSubmit={handleFormSubmit} className="space-y-4">
       
        <div className="flex flex-wrap">
        <div className="w-full lg:w-4/12 px-8">
            <div className="relative w-full mb-3">
            <label  className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Date:  </label>
            <input
              className="border py-2 px-6 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring transition-all duration-150"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div></div>
          <div className="w-full lg:w-4/12 px-8">
            <div className="relative w-full mb-3">
            <label  className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Start Time:  </label>
            <input
              className="border py-2 px-6 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring transition-all duration-150"
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div></div>
          <div className="w-full lg:w-4/12 px-8">
            <div className="relative w-full mb-3">
            <label  className="block uppercase text-blueGray-600 text-xs font-bold mb-2">End Time:  </label>
            <input
              className="border py-2 px-6 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring transition-all duration-150"
              type="number"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div></div>
        </div>
  
        <div className="flex justify-center mt-4">
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs py-2 px-4 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150"
            type="submit"
          >
            Configurer
          </button>
        </div>
      </form>
        {showAlert && (
        <div>
  
          {alertMessage}
        </div>
      )}
              <br></br>
    </div>
  </div>
  

  );
};

export default ParametrageTemps;
