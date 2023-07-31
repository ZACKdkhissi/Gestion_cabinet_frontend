import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import CardPatients from "components/Cards/CardPatients";
import CardAddPatient from "components/Cards/CardAddPatient";
import CardProfilePatient from "components/Cards/CardProfilePatient";

export default function GestionPatients() {
  const { token } = useContext(AuthContext);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

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
        ) : selectedPatient ? (
          <CardProfilePatient
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        ) : (
          <CardPatients
            onOpenAddPatient={handleOpenAddPatient}
            onViewProfile={handleViewProfile}
          />
        )}
      </div>
    </div>
  );
}
