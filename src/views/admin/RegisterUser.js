import React, { useContext } from "react";
import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";
import CardRegister from "components/Cards/CardRegister";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function RegisterUser() {
    const { token } = useContext(AuthContext);
  

  // Check if the user is authenticated (has a valid token)
  if (!token) {
    // Redirect to the login page if not authenticated
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
