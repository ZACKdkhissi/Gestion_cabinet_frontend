import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";




export default function CardEvents() {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);

  const [events, setEvents] = useState([]); 

  useEffect(() => {
       
    apiInstance.get("/api/events")
    .then((response) => {
      setEvents(response.data);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des évenements :", error);
    });
    // eslint-disable-next-line
}, []);

 

 
  const handleDeleteEvent = (EvnId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce événement ?");
    if(confirmDelete){
    apiInstance.delete(`/api/events/${EvnId}`)
      .then((response) => {
        console.log(response.data);
        setEvents(events.filter((evnt) => evnt.id !== EvnId));
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });}
  };
  

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"  
    style={{ height: "5.9cm",maxHeight: "5.9cm", overflowY: "auto" }}>
      <div>
        <div style={{marginLeft:'0.5cm'}}>
          <div className="rounded-t mb-0 px-4 py-3 border-0" style={{ display: 'flex', alignItems: 'center' }}>
           <h3 className="font-semibold text-sm text-blueGray-700 uppercase">Les événements</h3>
            <span className="cercle mr-1"  style={{marginLeft:'3cm'}} ></span>VACANCES
            <span className="cercle1 mr-1" style={{marginLeft:'0.5cm'}}></span>AID
            <span className="cercle2 mr-1" style={{marginLeft:'0.5cm'}}></span>REMARQUE
          </div>
        </div>

       

        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500  border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap text-left font-semibold">
                  from date:
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500  border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  to date:  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500  border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  titre  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500  border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  Action  
                </th>
                
              </tr>
            </thead>
            <tbody>
            {events.map( event => (
              <tr key={event.id}>
                <td className="border-t-0 px-6  border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left">
                  {event.from_date}
                </td>
                <td className="border-t-0 px-6  border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left">
                 {event.to_date}
                </td>
                <th className="border-t-0 px-6  border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left">
                 {event.titre} 
                </th>
                <td className="border-t-0 px-6  border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-left">
                <button
                    className="text-red-500 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ml-1 mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => handleDeleteEvent(event.id)}
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

  );
}
