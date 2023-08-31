import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";

export default function CardMedicaments({onOpenAddMedicament}) {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
const [medicaments, setMedicaments] = useState([]); 
  useEffect(() => {
    apiInstance
      .get("api/medicaments")
      .then((response) => {
        setMedicaments(response.data);
      })
      .catch((error) => {
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (MdcId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce medicament ?");
    if(confirmDelete){
    apiInstance.delete(`/api/medicaments/${MdcId}`)
      .then((response) => {
        setMedicaments(medicaments.filter((mdc) => mdc.id_medicament !== MdcId));
      })
      .catch((error) => {
      });}
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMedicaments = medicaments.filter((medicament) =>
  medicament.nom.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div>
    <div  style={{ height: "14cm",maxHeight: "14cm", overflowY: "auto" }}
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 text-center" >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold lg:w-1/12 uppercase">Liste des Médicaments</h3>
            <div className="flex items-center ">
            <button onClick={onOpenAddMedicament} className="bg-lightBlue-500 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-2 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150  ml-2 mr-2">
                <i className="fas fa-plus"></i>
              </button>
             
              <div className="relative flex items-center">
  <span className="z-2 h-full leading-snug font-normal absolute text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-3">
    <i className="fas fa-search"></i>
              </span>
                <input
                  type="text"
                  placeholder="Chercher ici"
                  value={searchTerm}
                  onChange={handleSearchChange}

                  className="border-0 px-2 py-3 pl-10 pr-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nom
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Forme  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Substance  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Prix  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Laboratoire  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Type  
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
            {filteredMedicaments.map( medicament => (
              <tr key={medicament.id_medicament}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                {medicament.nom}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left min-w-140-px">
                {medicament.forme}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left min-w-140-px">
                {medicament.substance || "-"}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left min-w-140-px">
                {medicament.prix || "-"}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left min-w-140-px">
                {medicament.laboratoire || "-"}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left min-w-140-px">
                {medicament.type || "-"}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    <div className="ecr-2"> 
                        <i onClick={() => handleDelete(medicament.id_medicament)} className="fas fa-trash-alt mr-3 text-lg text-red-500 "></i>
                    </div>
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
