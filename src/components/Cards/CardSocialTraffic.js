import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";

// components

export default function CardSocialTraffic({shouldFetch}) {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

  const filteredData1 = data1.filter(rendez => {
    const rendezDate = rendez.date;
    return rendezDate === formattedDate;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const formattedDate = `${(today.getDate()).toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        const apiUrl = `/api/rendezvous/date/${formattedDate}`;
        const response = await apiInstance.get(apiUrl);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [shouldFetch]);

  const [timers, setTimers] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `/api/sansrdv`;
        const response = await apiInstance.get(apiUrl);
        setData1(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchDataSansRdv = async () => {
    try {
      const apiUrl = `/api/sansrdv`;
      const response = await apiInstance.get(apiUrl);
      setData1(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteSansRdv = async (id_sans_rdv) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce Rendez-vous instantané ?");
    if (confirmDelete) {
      try {
        await apiInstance.delete(`/api/sansrdv/${id_sans_rdv}`);
        const updatedData1 = data1.filter(rendez => rendez.id_sans_rdv !== id_sans_rdv);
        setData1(updatedData1);
        fetchDataSansRdv();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };


  

  

  return (
    <>
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
             style={{ height: "9cm",maxHeight: "9cm", overflowY: "auto" }}
             >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-sm text-blueGray-700 uppercase">
                Rendez-vous
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                  Heure
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  Type  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  Patient  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">  
                  Statut
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">  
                </th>
              </tr>
            </thead>
            <tbody>
            {data.map( rendez => (
              <tr key={rendez.id_rdv}>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3">
                  {rendez.heure}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3">
                 {rendez.type}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3">
                 {rendez.patient.nom} {rendez.patient.prenom}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3">
                  {rendez.statut === 0 ? "Pas encore" : rendez.statut === 1 ? "Terminé" : rendez.statut}
                </td>
                <th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-right">
                 <button className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">consulter</button>
                </th>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
             style={{ height: "9cm",maxHeight:"9cm", overflowY: "auto" }}
             >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-sm text-blueGray-700 uppercase">
              Rendez-vous instantané
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  Type  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  Patient  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                  Statut
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-120-px">
                </th>
              </tr>
            </thead>
            <tbody>
            {filteredData1.map( rendez => (
              <tr key={rendez.id_sans_rdv}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                 {rendez.type}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                 {rendez.patient.nom} {rendez.patient.prenom}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {rendez.statut === 0 ? "Pas encore" : rendez.statut === 1 ? "Terminé" : rendez.statut}

                </td>
                <th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                 <button className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">consulter</button>
                 <button
                    className="text-red-500 text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ml-1 mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => handleDeleteSansRdv(rendez.id_sans_rdv)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </th>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}