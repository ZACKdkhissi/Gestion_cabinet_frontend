import React, { useContext, useState } from "react";
import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CardAddSansrdv = ({ onClose, patient }) => {
  const { token } = useContext(AuthContext);
  const [selectedType, setSelectedType] = useState("Consultation");
  const apiInstance = createApiInstance(token);
  const history = useHistory();

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleSubmit = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const parts = currentDate.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    const sansRdvData = {
      type: selectedType,
      statut: 0,
      patient: { id_patient: patient.id_patient },
      date: formattedDate,
    };

    apiInstance
      .post("/api/sansrdv", sansRdvData)
      .then((response) => {
        onClose();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4 flex flex-row shadow-lg">
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">
            Sans Rendez-vous pour le patient {patient.nom} {patient.prenom}
          </h2>
          <div className="mb-4">
            <select
              id="type"
              value={selectedType}
              onChange={handleTypeChange}
              className="block mt-1 w-full border border-gray-300 rounded p-1"
            >
              <option value="Consultation">Consultation</option>
              <option value="Controle">Contrôle</option>
              <option value="Delegue">Délégué</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button onClick={onClose} className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all w-1/2 duration-150">
              Annuler
            </button>
            <button onClick={handleSubmit} className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 w-1/2 ease-linear transition-all duration-150">Créer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAddSansrdv;
