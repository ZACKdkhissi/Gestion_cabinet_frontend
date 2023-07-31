import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import CardAddPatient from "components/Cards/CardAddPatient";
import AddAppointment from "components/Cards/AddAppointment";

export default function Appointment() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <AddAppointment  />
      </div>
    </div>
  );
}
