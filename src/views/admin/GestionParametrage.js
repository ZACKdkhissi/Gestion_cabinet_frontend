import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "contexts/AuthContext";
import ParametrageTemps from "components/Cards/CardParametrageTemps";

export default function GestionParametrage() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
      <div className="w-full px-2">
        <ParametrageTemps  />
      </div>
  );
}
