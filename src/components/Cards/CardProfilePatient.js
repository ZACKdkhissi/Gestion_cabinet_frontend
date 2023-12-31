import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


export default function CardProfilePatient({ patient, onClose, onEdit }) {

  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const [father, setFather] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (patient.id_parent) {
      apiInstance
        .get(`/api/patients/${patient.id_parent}`)
        .then((response) => {
          setFather(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            history.push('/401');
          }
        });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.id_parent]);
  
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
        <div className="py-5">
          <button 
              className="absolute left-0 px-4 focus:outline-none"
              onClick={onClose} 
          >
              <i className="fas fa-arrow-left"></i>
          </button>
          <button
              className="absolute right-0 px-4 focus:outline-none"
              onClick={() => onEdit(patient)}
            >
              <i className="fas fa-pen"></i>
            </button>
        </div>
        {patient.photo_cin && (
        <div>
            <img
              src={`data:image/jpeg;base64,${patient.photo_cin}`}
              alt={`${patient.nom}_${patient.prenom}`}
              className="w-30 h-30 mx-auto shadow-lg w-1/2"
            />
        </div>
        )}
          <div className="flex flex-wrap px-4 py-4 text-center justify-center">
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3">
              <h3 className="text-xl font-semibold leading-normal text-blueGray-700 w-full">
              {patient.nom} {patient.prenom}
              </h3>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 w-full">
                Patient N° <span className="font-semibold uppercase">{patient.code_patient || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Type: <span className="font-semibold uppercase">{patient.type_patient || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                CIN: <span className="font-semibold uppercase">{patient.cin || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
            Vérifié: {patient.verifie === 0 && (
                      <i
                        className="fas fa-circle mr-2 text-lg"
                        style={{ color: "red", marginRight: "8px" }}
                      ></i>
                    )}
                    {patient.verifie === 1 && (
                      <i
                        className="fas fa-circle mr-2 text-lg"
                        style={{ color: "orange", marginRight: "8px" }}
                      ></i>
                    )}
                    {patient.verifie === 2 && (
                      <i
                        className="fas fa-circle mr-2 text-lg"
                        style={{ color: "green", marginRight: "8px" }}
                      ></i>
                    )}
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Date de naissance: <span className="font-semibold uppercase">{patient.date_de_naissance || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Sexe: <span className="font-semibold uppercase">{patient.sexe || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Telephone: <span className="font-semibold uppercase">{patient.telephone || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Email: <span className="font-semibold">{patient.email || "-"}</span>
            </div>
            <div className="relative mb-1 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Ville: <span className="font-semibold uppercase">{patient.ville || "-"}</span>
            </div>
            <div className="relative mb-3 px-3 text-blueGray-600 mt-3 lg:w-4/12">
                Mutuelle: <span className="font-semibold uppercase">{patient.mutuelle || "-"}</span>
            </div>
            {patient.id_parent && (
          <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
            Lien de parenté: <span className="font-semibold uppercase">{father ? `${father.nom} ${father.prenom}`:""}</span>
          </div>
        )}
          </div>
      </div>
    </>
  );
}

CardProfilePatient.propTypes = {
  patient: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};