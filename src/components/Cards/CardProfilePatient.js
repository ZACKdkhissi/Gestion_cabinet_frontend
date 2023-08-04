import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";

export default function CardProfilePatient({ patient, onClose }) {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const [parent, setParent] = useState(null);

  useEffect(() => {
    const fetchParentData = async (parentId) => {
      try {
        const response = await apiInstance.get(`api/patients/${parentId}`);
        setParent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (patient.id_parent) {
      fetchParentData(patient.id_parent);
    }
  }, [patient.id_parent, apiInstance]);

 
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
      <div className="flex flex-wrap text-center">
        <div className="relative mt-2 mb-2">
        {patient.photo_cin && (
            <img
              src={`data:image/jpeg;base64,${patient.photo_cin}`}
              className="mx-auto shadow-lg lg:w-4/12"
            />
          )}
            </div>
            <div className="flex flex-wrap text-center">
            <div className="relative w-1/2 text-blueGray-600 lg:w-4/12">
            <span className="font-semibold uppercase">{patient.nom} {patient.prenom}</span>
            </div>
            <div className="relative w-1/2 text-blueGray-600 lg:w-4/12">
                Patient N° <span className="font-semibold uppercase">{patient.code_patient || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600 lg:w-4/12">
                Type: <span className="font-semibold uppercase">{patient.type_patient || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600 lg:w-4/12">
                CIN: <span className="font-semibold uppercase">{patient.cin || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600 lg:w-4/12">
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
            <div className="relative w-1/2  text-blueGray-600  lg:w-4/12 mb-1">
                Date de naissance: <span className="font-semibold uppercase">{patient.date_de_naissance || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600  lg:w-4/12 mb-1">
                Sexe: <span className="font-semibold uppercase">{patient.sexe || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600  lg:w-4/12 mb-1">
                Telephone: <span className="font-semibold uppercase">{patient.telephone || "-"}</span>
            </div>
            <div className="relative w-full  text-blueGray-600  lg:w-4/12 mb-1">
                Email: <span className="font-semibold">{patient.email || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600  lg:w-4/12 mb-1">
                Ville: <span className="font-semibold uppercase">{patient.ville || "-"}</span>
            </div>
            <div className="relative w-1/2  text-blueGray-600  lg:w-4/12 mb-1">
                Mutuelle: <span className="font-semibold uppercase">{patient.mutuelle || "-"}</span>
            </div>
            {parent && (
            <div className="relative w-1/2 mb-1 text-blueGray-600 lg:w-4/12 mb-1">
                Lien de parenté: <span className="font-semibold uppercase">{parent.nom || "-"} {parent.prenom || "-"}</span>
            </div>
            )}
          </div>
          </div>
          <div className="lg:w-1/12 text-center mt-3 mb-1">
            <button onClick={onClose} className="focus:outline-none">
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
      </div>
    </>
  );
}

CardProfilePatient.propTypes = {
  patient: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};