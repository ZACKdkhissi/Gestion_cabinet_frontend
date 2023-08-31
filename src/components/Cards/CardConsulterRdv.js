import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { differenceInYears } from "date-fns";


export default function CardConsulterRdv({patient}) {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const [father, setFather] = useState(null);
  const [updatedPatient,setUpdatedPatient] = useState(patient || "");
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const [selectedCaractere, setSelectedCaractere] = useState(
    updatedPatient.caractere || ""
  );
  const [isModifying, setIsModifying] = useState(false);

  useEffect(() => {
    if (patient.id_parent) {
      apiInstance
        .get(`/api/patients/${patient.id_parent}`)
        .then((response) => {
          setFather(response.data);
        })
        .catch((error) => {
          console.error("Error fetching father's information:", error);
        });
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newSeconds = prevTimer.seconds + 1;
        if (newSeconds === 60) {
          return { minutes: prevTimer.minutes + 1, seconds: 0 };
        } else {
          return { ...prevTimer, seconds: newSeconds };
        }
      });
    }, 1000);

    const fetchUpdatedPatientData = () => {
      apiInstance
        .get(`/api/patients/${patient.id_patient}`)
        .then((response) => {
          const updatedPatientData = response.data;
          setUpdatedPatient(updatedPatientData);
        })
        .catch((error) => {
          console.error("Error fetching updated patient data:", error);
        });
    };
  
    if (selectedCaractere !== "" && !isModifying) {
      fetchUpdatedPatientData();
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [selectedCaractere, isModifying]);

  const handleCaractereButtonClick = () => {
    if (selectedCaractere !== "") {
      const updatedPatient = {
        ...patient,
        caractere: selectedCaractere,
      };
      apiInstance
        .put(`/api/patients/${patient.id_patient}`, updatedPatient)
        .then(() => {
          console.log("Character updated successfully");
          setIsModifying(false);
        })
        .catch((error) => {
          console.error("Error updating character:", error);
        });
    }
  };
  

  const calculateColor = () => {
    const startColor = [0, 128, 0];
    const endColor = [255, 0, 0];

    const totalMinutes = timer.minutes + timer.seconds / 60;
    const maxTime = 30; 

    const progress = totalMinutes / maxTime;
    
    const interpolatedColor = startColor.map((startValue, index) => {
      const endValue = endColor[index];
      const diff = endValue - startValue;
      return Math.round(startValue + diff * progress);
    });

    return `rgb(${interpolatedColor.join(",")})`;
  };

  const timerColor = calculateColor();

  function parseDateFromString(dateString) {
    const parts = dateString.split("-");
    const parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    return parsedDate;
  }

  const createdDate = new Date(patient.created_at);
  const dateOfBirth = parseDateFromString(patient.date_de_naissance);
  const age = differenceInYears(createdDate, dateOfBirth);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg text-sm">
      <div className="relative w-full text-blueGray-600 lg:w-full py-4 text-center">
          <h3 className="text-xl font-semibold leading-normal text-blueGray-700">{patient.nom} {patient.prenom} ({age || "-"} ans)</h3>
        </div>
            <div className="flex flex-wrap text-center text-sm">
            <div className="relative w-full mb-3 text-blueGray-600 lg:w-4/12">
                Patient N° <span className="font-semibold uppercase">{patient.code_patient || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 lg:w-4/12">
                Date de naissance: <span className="font-semibold uppercase">{patient.date_de_naissance || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600 lg:w-4/12">
                Sexe: <span className="font-semibold uppercase">{patient.sexe || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600  lg:w-4/12">
                Téléphone: <span className="font-semibold uppercase">{patient.telephone || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600  lg:w-4/12">
                Ville: <span className="font-semibold uppercase">{patient.ville || "-"}</span>
            </div>
            <div className="relative w-full mb-3 text-blueGray-600  lg:w-4/12">
                Mutuelle: <span className="font-semibold uppercase">{patient.mutuelle || "-"}</span>
            </div>
            {patient.id_parent && (
          <div className="relative w-full mb-3 text-blueGray-600  lg:w-4/12">
            Lien de parenté: <br/><span className="font-semibold uppercase">{father ? `${father.nom} ${father.prenom}`:""}</span>
          </div>
        )}
          </div>
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
      <div className="text-center mt-5 mb-5">
  <p className="text-lg font-semibold mb-2">
    Caractère : <span className="mr-2">{updatedPatient.caractere || "-"}</span>
  </p>
  {isModifying ? (
    <div className="flex flex-wrap justify-center w-full">
      {["Amical", "Professionnel", "Attentionné", "Compétent"].map(
        (character, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              id={`character${index + 1}`}
              name="character"
              value={character}
              className="h-4 w-4 text-indigo-600 form-radio focus:ring-indigo-400 focus:ring-offset-indigo-300"
              checked={selectedCaractere === character}
              onChange={() => setSelectedCaractere(character)}
            />
            <span className="mr-2">{character}</span>
          </label>
        )
      )}
      <div className="mt-2 w-full flex justify-center">
        <button
          onClick={() => setIsModifying(false)}
          className="bg-red-500 text-white active:bg-red-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1"
        >
          Annuler
        </button>
        <button
          onClick={handleCaractereButtonClick}
          className="bg-lightBlue-500 text-white active:bg-lightBlue-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none"
        >
          Confirmer
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setIsModifying(true)}
        className="bg-lightBlue-500 text-white active:bg-lightBlue-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full mt-2"
      >
        Modifier
      </button>
    </div>
  )}
</div>
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
        <div className="flex justify-center items-center mt-5 mb-5">
          <div className="timer text-white">
            <span className="timer-digit" style={{ backgroundColor: timerColor }}>
              {timer.minutes < 10 ? "0" : ""}
              {timer.minutes}
            <span className="ml-1 mr-1">:</span>
              {timer.seconds < 10 ? "0" : ""}
              {timer.seconds}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

CardConsulterRdv.propTypes = {
  patient: PropTypes.object.isRequired,
};