import React, { useContext, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { FaListUl, FaTimes } from "react-icons/fa"; 
import { ResizableBox } from "react-resizable";



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

  const [showMedicamentList, setShowMedicamentList] = useState(false);
const [medicaments, setMedicaments] = useState([]); 

const handleMedicamentListClick = () => {
    apiInstance.get("api/medicaments").then((response) => {
      setMedicaments(response.data);
      setShowMedicamentList(true);
    });
  };

  const handleDelete = (MdcId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce medicament ?");
    if(confirmDelete){
    apiInstance.delete(`/api/medicaments/${MdcId}`)
      .then((response) => {
        console.log(response.data);
        setMedicaments(medicaments.filter((mdc) => mdc.id_medicament !== MdcId));
      })
      .catch((error) => {
        console.error(error);
      });}
  };
  

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <div className="lg:w-1/12 px-4">
            <h6 className="text-blueGray-700 text-xl font-bold">Ajouter Medicament</h6>
          </div>
          <FaListUl
    className="text-gray-600 cursor-pointer"
    onClick={handleMedicamentListClick} 
/>

        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-10">

      {showMedicamentList && (
  <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
    <ResizableBox
      className="bg-white rounded-lg p-4 max-h-80 overflow-y-auto shadow-2xl" 
      width={400} 
      height={300} 
      maxConstraints={[800, 600]} 
      resizeHandles={["s", "e", "se"]} 
    >
      <div className="bg-white rounded-lg p-2 max-h-70 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Liste des médicaments</h2>
         
        <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nom de medicament
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Forme  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Prix  
                </th>
               
                
              
                
              </tr>
            </thead>
            <tbody>
            {medicaments.map( medicament => (
              <tr key={medicament.id_medicament}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="ecr-2"> 
                        <i onClick={() => handleDelete(medicament.id_medicament)} className="fas fa-trash-alt mr-3 text-lg text-red-500 "></i>
                    </div>
                </td>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                {medicament.nom}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {medicament.forme}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {medicament.prix}
                </td>
                
                
                
                
              </tr>
            ))}
              
            </tbody>
            </table>
      </div>
    </ResizableBox>

    <button
      className="ecr"
      onClick={() => setShowMedicamentList(false)}
    >
      <FaTimes className="text-lg" />
    </button>
  </div>
)}

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

          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 w-full ease-linear transition-all duration-150"
            type="submit"
            onClick={handleMedicamentSubmit}
          >
            Ajouter Medicament
          </button>
        </form>
        {showAlert && (
        <div
          className={`${
            alertType === "success" ? "bg-green-200" : "bg-red-200"
          } text-green-700 border-l-4 border-green-700 p-4 mt-4`}
        >
          {alertMessage}
        </div>
      )}
      </div>
    </div>
  );
}
