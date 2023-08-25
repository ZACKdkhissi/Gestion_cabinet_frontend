import createApiInstance from "api/api";
import useUserInfo from "api/useUserInfo";
import { AuthContext } from "contexts/AuthContext";
import { format } from "date-fns";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


export default function CardSocialTraffic({shouldFetch}) {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token)
  const history = useHistory();
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
        const dataWithLocalTime = response.data.map(item => {
          const [hours, minutes] = item.heure.split(':');
          const localTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
          return { ...item, localTime };
        });
        dataWithLocalTime.sort((a, b) => a.localTime - b.localTime);
  
        setData(dataWithLocalTime);
        console.log(dataWithLocalTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
      }, 5 * 60 * 1000); 

      return () => {
          clearInterval(intervalId);
      };
      
    // eslint-disable-next-line
  }, [shouldFetch]);
  

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

    const intervalId = setInterval(() => {
      fetchData();
      }, 5 * 60 * 1000); 

      return () => {
          clearInterval(intervalId);
      };

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


  const navigateToConsulter = (rendez) => {
    history.push({
      pathname: `/admin/consulterRdv-${rendez.patient.nom}-${rendez.patient.prenom}`,
      state: { rendez: rendez },
    });
  };

  const generatePDF = async (rendez) => {
    try {
      const response = await apiInstance.get(`/api/ordonnances/${rendez.ordonnance.id_ordonnance}`);
      const ordonnance = response.data;
        const currentDate = format(new Date(), "dd-MM-yyyy");
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        doc.setFontSize(16);
        doc.text("Ordonnance Médicale", 105, 15, null, null, "center");
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 20, 30);
        doc.text(`Nom du patient: ${rendez.patient.nom}`, 20, 40);
        doc.text(`Prénom du patient: ${rendez.patient.prenom}`, 20, 50);
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);
        doc.setFontSize(14);
        doc.text("Médicaments:", 20, 65);
        let yOffset = 75;
  
        ordonnance.ordonnanceMedicaments.forEach((medication) => {
          doc.setFontSize(12);
          doc.text(`Médicament: ${medication.medicament.nom}`, 20, yOffset);
          doc.text(`Posologie: ${medication.posologie}`, 20, yOffset + 10);
          doc.text(`Quand: ${medication.quand}`, 20, yOffset + 20);
          doc.text(`Pendant: ${medication.pendant}`, 20, yOffset + 30);
          yOffset += 50;
        });
  
        const pdfName = `ordonnance_${rendez.patient.nom}_${rendez.patient.prenom}_${currentDate}.pdf`;
        doc.save(pdfName);
        
    } catch (error) {
      window.alert("Pas d'ordonnance pour ce patient !");
    }
  };

  const userInfo = useUserInfo();

  const isDocteur = userInfo.some(
    (user) =>
      user.roles && user.roles.filter((value) => value.roleCode === "DOCTEUR").length > 0
  );

  return (
    <>
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
             style={{ height: "9cm",maxHeight:"9cm", overflowY: "auto" }}
             >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-sm text-blueGray-700 uppercase">
              Sans Rendez-vous
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
                <th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-3 text-right">
            {isDocteur && rendez.statut === 0 && (
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => {
                  navigateToConsulter(rendez);
                }}
              >
                Consulter
              </button>
            )}
            {isDocteur && rendez.statut === 1 && (
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => {
                  generatePDF(rendez);
                }}
              >
                Ordonnance
              </button>
            )}
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
            {isDocteur && rendez.statut === 0 && (
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => {
                  navigateToConsulter(rendez);
                }}
              >
                Consulter
              </button>
            )}
            {isDocteur && rendez.statut === 1 && (
              <button
                className="bg-lightBlue-500 text-white active:bg-red-500 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => {
                  generatePDF(rendez);
                }}
              >
                Ordonnance
              </button>
            )}
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