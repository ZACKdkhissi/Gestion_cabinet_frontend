import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";


export default function CardAddMedicaments() {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);

  const [medicamentData, setMedicamentData] = useState({
    nom: "",
    forme: "",
    substance: "",
    prix: "",
    laboratoire: "",
    type: "",
  });

  const handleMedicamentChange = (event) => {
    const { name, value } = event.target;
    setMedicamentData({
      ...medicamentData,
      [name]: value,
    });
  };
  const [alertType, setAlertType] = useState(null); 
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleMedicamentSubmit = (event) => {
    event.preventDefault();
    apiInstance
      .post("api/medicaments", medicamentData)
      .then((response) => {
        console.log("Medicament inserted successfully:", response.data);
        setAlertType("success");
        setAlertMessage("Medicament inserted successfully.");
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Error inserting medicament:", error);
        if (error.response && error.response.status === 400) {
          setAlertType("error");
          setAlertMessage(error.response.data); 
          setShowAlert(true);
        }
      });
  };

const [medicaments, setMedicaments] = useState([]); 



  useEffect(() => {
    apiInstance
      .get("api/medicaments")
      .then((response) => {
        setMedicaments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

 

  





  
  

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-3">
          <div className="text-center flex">
          
              <h6 className="text-blueGray-700 text-xl font-bold">
                Ajouter un Médicaments
              </h6>
          </div>
        </div>
        <br></br>
       <form>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="prix"
              >
                Nom du medicament
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Nom du medicament"
                value={medicamentData.nom}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="prix"
              >
                Forme
              </label>
              <input
                type="text"
                name="forme"
                placeholder="Forme"
                value={medicamentData.forme}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            
          </div>


          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="prix"
              >
                Substance
              </label>
              <input
                type="text"
                name="substance"
                placeholder="Substance"
                value={medicamentData.substance}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="prix"
              >
                Prix
              </label>
              <input
                type="text"
                name="prix"
                placeholder="Prix"
                value={medicamentData.prix}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            
          </div>


          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="prix"
              >
                Laboratoire
              </label>
              <input
                type="text"
                name="laboratoire"
                placeholder="Laboratoire"
                value={medicamentData.laboratoire}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
            
          </div>
          <div className="w-full lg:w-6/12 px-4">
          <div className="relative w-full mb-3">
            <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="type"
            >
                Type
            </label>
            <select
                name="type"
                value={medicamentData.type}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            >
                <option value="">Selectionner un Type</option>
                <option value="P">P</option>
                <option value="G">G</option>
            </select>
            </div>

            
          </div>
          </div>
          <div className="flex justify-center">
          <button
         
         className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 lg:w-4/12 ease-linear transition-all duration-150"
         type="submit"
            onClick={handleMedicamentSubmit}
          >
            Ajouter Medicament
          </button>
          </div>
        </form>
        <br></br>
        {showAlert && (
        <div>
  
          {alertMessage}
        </div>
      )}
              <br></br>


    </div>
  );
}
