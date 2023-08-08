import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import CardPatients from "components/Cards/CardPatients";
import CardAddPatient from "components/Cards/CardAddPatient";
import CardProfilePatient from "components/Cards/CardProfilePatient";
import CardModifyPatient from "components/Cards/CardModifyPatient";

export default function GestionPatients() {
  const { token } = useContext(AuthContext);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

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

  const handleEditProfile = (patient) => {
    setEditingPatient(patient);
  };

  const handleEditPatientSuccess = (updatedPatient) => {
    setSelectedPatient(updatedPatient);
    setEditingPatient(null);
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
        ) : editingPatient ? (
          <CardModifyPatient
            patient={editingPatient}
            onEditSuccess={handleEditPatientSuccess}
          />
        ) : selectedPatient ? (
          <CardProfilePatient
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
            onEdit={handleEditProfile}
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
