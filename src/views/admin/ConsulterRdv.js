import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import CardConsulterRdv from "components/Cards/CardConsulterRdv";
import CardAddOrdonnance from "components/Cards/CardAddOrdonnance";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";

export default function ConsulterRdv(props) {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const { rendez } = props.location.state || {};
  const [isRedirected, setIsRedirected] = useState(false);

  const handleTerminerClick = () => {
    const isConfirmed = window.confirm("Voulez-vous terminer la consultation?");
    
    if (isConfirmed) {
      let updatedData;
      updatedData = { ...rendez, statut: 1 };
      updatedData.patient = { ...updatedData.patient, type_patient: "officiel" };

  apiInstance
    .put(`/api/patients/${rendez.patient.id_patient}`, updatedData.patient)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) =>{console.log(error)});
      if (rendez.heure) {
        apiInstance
        .put(`/api/rendezvous/${rendez.id_rdv}`, updatedData)
        .then((response) => {
          console.log(response.data)
          setIsRedirected(true);
        })
        .catch((error) => {
          console.error("Error updating rendezvous status:", error);
        });
      } else {
        apiInstance
        .put(`/api/sansrdv/${rendez.id_sans_rdv}`, updatedData)
        .then((response) => {
          console.log(response.data)
          setIsRedirected(true);
        })
        .catch((error) => {
          console.error("Error updating rendezvous status:", error);
        });
      }

    }
  };
  

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isRedirected) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isRedirected]);

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  if (isRedirected) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-6/12 px-4">
          <CardConsulterRdv patient={rendez.patient} />
        </div>
        <div className="w-full xl:w-6/12 px-4">
          <CardAddOrdonnance rendez={rendez} />
        </div>
      </div>
      <div className="flex relative justify-center items-center">
        <button
          onClick={handleTerminerClick}
          className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full mb-12"
        >
          Terminer
        </button>
      </div>
    </div>
  );
}
