import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";

const CardPatientRendez = ({ patient, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success"); 
  const [alertMessage, setAlertMessage] = useState("");

  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);

  const [newRendezvous, setNewRendezvous] = useState({
    date: "",
    heure: "",
    type: "",
    statut: 0,
    patient: {
      id_patient: patient.id_patient
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRendezvous({
      ...newRendezvous,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiInstance
      .post("/api/rendezvous", newRendezvous)
      .then((response) => {
        console.log("successfully:", response.data);
        setShowAlert(true);
        setAlertType("success");
        setAlertMessage("Rendez-vous pris avec succès.");
        onClose();
      })
      .catch((error) => {
        console.error("Error :", error);
        setShowAlert(true);
        setAlertType("error");
        setAlertMessage(error.response.data); 
      });
  };
  

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg "  >

      <div className="p-4">
        {showAlert && (
          <div
            className={`alert ${
              alertType === "success" ? "bg-green-300" : "bg-red-300"
            } p-2 mb-4 rounded`}
          >
            {alertMessage}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4">Ajouter un rendez-vous</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newRendezvous.date}
              onChange={handleInputChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="heure" className="block text-sm font-medium text-gray-700">Heure:</label>
            <input
              type="text"
              id="heure"
              name="heure"
              value={newRendezvous.heure}
              onChange={handleInputChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type:</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newRendezvous.type}
              onChange={handleInputChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          {/*statut khas t7ayd*/}
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700">Statut:</label>
            <input
              type="number"
              id="statut"
              name="statut"
              value={newRendezvous.statut}
              onChange={handleInputChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <input
              type="hidden"
              id="patientId"
              name="id_patient"
              value={newRendezvous.patient.id_patient}
              onChange={handleInputChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-WhiteBlue font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Ajouter le rendez-vous
          </button>
        </form>
        <div className="lg:w-1/12 text-center mt-3 mb-3">
            <button onClick={onClose} className="focus:outline-none">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
      </div>
    </div>
  );
};

CardPatientRendez.propTypes = {
  patient: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CardPatientRendez;
