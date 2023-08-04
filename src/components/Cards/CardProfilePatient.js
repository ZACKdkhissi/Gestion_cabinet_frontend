import React from "react";
import PropTypes from "prop-types";

export default function CardProfilePatient({ patient, onClose }) {

    
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
        <div className="text-center mt-5">
        {patient.photo_cin && (
            <img
              src={`data:image/jpeg;base64,${patient.photo_cin}`}
              alt="Patient's photo"
              className="w-30 h-30 mx-auto shadow-lg lg:w-4/12"
            />
          )}
            <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mt-5">
            {patient.nom} {patient.prenom}
            </h3>
            </div>
            <div className="flex flex-wrap py-4 text-center">
            <div className="relative w-full mb-3 text-blueGray-600">
                Patient N° <span className="font-semibold uppercase">{patient.code_patient || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Type: <span className="font-semibold uppercase">{patient.type_patient || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                CIN: <span className="font-semibold uppercase">{patient.cin || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
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
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Date de naissance: <span className="font-semibold uppercase">{patient.date_de_naissance || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Sexe: <span className="font-semibold uppercase">{patient.sexe || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Telephone: <span className="font-semibold uppercase">{patient.telephone || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Email: <span className="font-semibold">{patient.email || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Ville: <span className="font-semibold uppercase">{patient.ville || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Mutuelle: <span className="font-semibold uppercase">{patient.mutuelle || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 mt-3 lg:w-4/12">
                Lien de parenté: <span className="font-semibold uppercase">{patient.id_parent || "-"}</span>
            </div>
          </div>
          <div className="lg:w-1/12 text-center mt-3 mb-3">
            <button onClick={onClose} className="focus:outline-none">
                <i className="fas fa-arrow-right"></i>
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