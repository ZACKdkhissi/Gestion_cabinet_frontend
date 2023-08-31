import React, { useContext } from "react";
import CardRegister from "components/Cards/CardRegister";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function RegisterUser() {
    const { token } = useContext(AuthContext);
  

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/12 px-4">
          <CardRegister />
        </div>
        
      </div>
    </>
  );
}
