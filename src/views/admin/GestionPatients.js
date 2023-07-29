import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import CardPatients from "components/Cards/CardPatients";

export default function GestionPatient() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <CardPatients color="light" />
      </div>
    </div>
  );
}
