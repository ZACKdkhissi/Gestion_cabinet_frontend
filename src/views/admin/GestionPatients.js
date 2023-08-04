import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import CardPatients from "components/Cards/CardPatients";
import CardAddPatient from "components/Cards/CardAddPatient";
import CardProfilePatient from "components/Cards/CardProfilePatient";
import CardPatientRendez from "components/Cards/CardPatientRendez";

export default function GestionPatients() {
  const { token } = useContext(AuthContext);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRendezvousModal, setShowRendezvousModal] = useState(false); // Ajout de l'état pour gérer la modal de rendez-vous
  const [selectedPatientForRendezvous, setSelectedPatientForRendezvous] = useState(null); // Ajout de l'état pour stocker le patient sélectionné pour le rendez-vous

  const handleOpenAddPatient = () => {
    setIsAddPatientOpen(true);
  };

  const handleCloseAddPatient = () => {
    setIsAddPatientOpen(false);
  };

  const handleAddPatientSuccess = () => {
    setIsAddPatientOpen(false);
  };

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
  };
  
  const handleRendezVous = (patient) => {
    setSelectedPatientForRendezvous(patient);
  };
  
 

 
  


  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        {isAddPatientOpen ? (
          <CardAddPatient
            onClose={handleCloseAddPatient}
            onAddSuccess={handleAddPatientSuccess}
          />
        ) : selectedPatientForRendezvous ? (
          <CardPatientRendez
          patient={selectedPatientForRendezvous}
          onClose={() => setSelectedPatientForRendezvous(null)}
        />

        ):
        selectedPatient ? (
          <CardProfilePatient
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        ) : (
          <CardPatients
            onOpenAddPatient={handleOpenAddPatient}
            onViewProfile={handleViewProfile}
            onViewRendezVous={handleRendezVous} // Passer la fonction pour ouvrir la modal de rendez-vous

          />
        )}
      </div>
      
    </div>
  );
}