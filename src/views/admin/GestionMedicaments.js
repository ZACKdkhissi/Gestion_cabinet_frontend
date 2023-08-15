import CardAddMedicaments from "components/Cards/CardAddMedicaments";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";



export default function GestionMedicaments() {
    const { token } = useContext(AuthContext);
  if (!token) {
    return <Redirect to="/auth/login" />;
  }
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/12 px-4">
          <CardAddMedicaments />
          </div>
        </div>
    </>
  );
}