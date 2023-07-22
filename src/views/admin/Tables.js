import React, { useContext, useEffect, useState } from "react";

// components

import CardTable from "components/Cards/CardTable.js";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";

export default function Tables() {
  const { token } = useContext(AuthContext);

  // Check if the user is authenticated (has a valid token)
  

  const [patients, setPatients] = useState([]);
  const apiInstance = createApiInstance(token);

  useEffect(() => {
    apiInstance
      .get("api/patients") // Replace this with the endpoint to fetch patients
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!token) {
    // Redirect to the login page if not authenticated
    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
        <CardTable color="light" patients={patients} />
        </div>
        <div className="w-full mb-12 px-4">
          
          {/*<CardTable color="dark" />*/}
        </div>
      </div>
    </>
  );
}
