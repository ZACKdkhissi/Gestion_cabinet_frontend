import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import CardAddPatient from "components/Cards/CardAddPatient";

export default function AddPatient() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <CardAddPatient  />
      </div>
    </div>
  );
}
