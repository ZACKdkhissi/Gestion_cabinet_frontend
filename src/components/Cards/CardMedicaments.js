import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { FaListUl, FaTimes } from "react-icons/fa"; 
import { ResizableBox } from "react-resizable";
import { Link } from "react-router-dom/cjs/react-router-dom.min";



export default function CardMedicaments() {
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



  useEffect(() => {
    apiInstance
      .get("api/medicaments")
      .then((response) => {
        setMedicaments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

/************************* */

  

  const filteredMedicaments = medicaments.filter((medicament) =>
  medicament.nom.toLowerCase().includes(searchTerm.toLowerCase())
);




/************************* */

  
  

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="rounded-t mb-0 px-4 py-1 border-0 text-center" >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold lg:w-1/12">Liste des Médicaments</h3>
            <div className="flex items-center ">
              
               <Link  className="mr-4 focus:outline-none" to="/admin/AddMedicaments"> <i className="fas fa-plus"></i></Link>
             
              <div className="relative flex items-center">
                <span className="z-10 h-full leading-snug font-normal absolute text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Chercher ici"
                  value={searchTerm}
                  onChange={handleSearchChange}

                  className="border-0 px-3 py-3 pl-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nom de medicament
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Forme  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Prix  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
               
                
              
                
              </tr>
            </thead>
            <tbody className="bg-white">
            {filteredMedicaments.map( medicament => (
              <tr key={medicament.id_medicament}>
                
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                {medicament.nom}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {medicament.forme}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                {medicament.prix}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="ecr-2"> 
                        <i onClick={() => handleDelete(medicament.id_medicament)} className="fas fa-trash-alt mr-3 text-lg text-red-500 "></i>
                    </div>
                </td>
                
                
                
                
              </tr>
            ))}
              
            </tbody>
            </table>

       
        


    </div>
  );
}
