import React, { useState } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const AddAppointment = ({ formData }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const patientData = {
      nom: searchParams.get('nom') || '',
      prenom: searchParams.get('prenom') || '',
      sexe: searchParams.get('sexe') || '',
      cin: searchParams.get('cin') || '',
      telephone: searchParams.get('telephone') || '',
    };

  const [appointmentData, setAppointmentData] = useState({
    date: '',
    heure: '',
    // Ajoutez d'autres champs nécessaires pour le rendez-vous ici...
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Le code pour ajouter le rendez-vous ici...
    console.log('Rendez-vous ajouté :', appointmentData);
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="w-full lg:w-1/2 px-4 py-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Ajouter un rendez-vous</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom du patient
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Prénom du patient
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {/* ... (other input fields for the appointment) */}
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-blue font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Ajouter le rendez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAppointment;
