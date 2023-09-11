import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { useHistory } from "react-router-dom";


export default function CardAddMedicaments({onClose, onAddSuccess}) {
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);

  const [medicamentData, setMedicamentData] = useState({
    nom: "",
    forme: "",
    substance: "",
    prix: "",
    laboratoire: "",
    type: "",
  });

  const handleMedicamentChange = (event) => {
    const { name, value } = event.target;
    setMedicamentData({
      ...medicamentData,
      [name]: value,
    });
  };

  const [alertType, setAlertType] = useState(null); 
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [medicaments, setMedicaments] = useState([]);


  const handleMedicamentSubmit = (event) => {
    event.preventDefault();
    if (!medicamentData.nom || !medicamentData.forme) {
      setAlertType("error");
      setAlertMessage("Remplissez le nom et la forme !");
      setShowAlert(true);
      return;
    }

    const isMedicamentExists = medicaments.some(
      (medicament) =>
        medicament.nom === medicamentData.nom &&
        medicament.forme === medicamentData.forme
    );
  
    if (isMedicamentExists) {
      setAlertType("error");
      setAlertMessage("Ce médicament existe déjà dans la base de données.");
      setShowAlert(true);
      return;
    }
    apiInstance
      .post("api/medicaments", medicamentData)
      .then((response) => {
        onAddSuccess(response.data);
        setShowAlert(true);
      })
      .catch((error) => {
          setAlertType("error");
          setAlertMessage(error); 
          setShowAlert(true);
          if (error.response && error.response.status === 401) {
            history.push('/401');
          }
      });
  };

  const handleKeyUp = (event) => {
    const { name, value } = event.target;
    if (name === "nom") {
      setMedicamentData({
        ...medicamentData,
        [name]: value.toUpperCase()
      });
    }
  };

  useEffect(() => {
    apiInstance
      .get("api/medicaments")
      .then((response) => {
        setMedicaments(response.data);
      })
      .catch((error) => {
        setAlertType("error");
        setAlertMessage(error); 
        setShowAlert(true);
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      });
      // eslint-disable-next-line
  }, []);

  const history = useHistory();
  const fieldsNotEmpty = useRef(false);
  useEffect(() => {
    const inputFields = ['nom', 'forme', 'substance', 'prix', 'laboratoire', 'type'];
    const hasFieldsNotEmpty = inputFields.some((fieldName) => {
      const value = medicamentData[fieldName];
      return typeof value === 'string' && value.trim() !== '';
    });
    fieldsNotEmpty.current = hasFieldsNotEmpty;
    const handleBeforeUnload = (event) => {
      if (fieldsNotEmpty.current) {
        event.preventDefault();
        event.returnValue = "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?";
      }
    };

    const unblock = history.block((location, action) => {
      if (fieldsNotEmpty.current) {
        const confirmed = window.confirm("Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?");
        if (!confirmed) {
          return false;
        }
      }
      return true;
    });

    const cleanup = () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unblock();
    };

    if (fieldsNotEmpty.current) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return cleanup;
  }, [history,medicamentData]);


      const handleReturnButtonClick = () => {
        if (fieldsNotEmpty.current) {
          const confirmed = window.confirm(
            "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?"
          );
          if (!confirmed) {
            return;
          }
        }
        onClose();
      };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
    <div className="rounded-t bg-white mb-0 px-4 py-3">
      <div className="text-center flex">
        <div className=" mr-4">
            <button onClick={handleReturnButtonClick} className="focus:outline-none">
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
              <h6 className="text-blueGray-700 text-xl font-bold uppercase">
                Ajouter un Médicament
              </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
       <form>
       <div className="flex flex-wrap py-4">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="nom"
              >
                Nom 
              </label>
              <input
                type="text"
                name="nom"
                value={medicamentData.nom}
                onChange={handleMedicamentChange}
                onKeyUp={handleKeyUp}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 uppercase"
              />
            </div>
            
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="forme"
              >
                Forme
              </label>
              <input
                type="text"
                name="forme"
                value={medicamentData.forme}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="substance"
              >
                Substance
              </label>
              <input
                type="text"
                name="substance"
                value={medicamentData.substance}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="prix"
              >
                Prix
              </label>
              <input
                type="text"
                name="prix"
                value={medicamentData.prix}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="laboratoire"
              >
                Laboratoire
              </label>
              <input
                type="text"
                name="laboratoire"
                value={medicamentData.laboratoire}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              />
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
          <div className="relative w-full mb-3">
            <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="type"
            >
                Type
            </label>
            <select
                name="type"
                value={medicamentData.type}
                onChange={handleMedicamentChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            >
                <option value="">Selectionner un Type</option>
                <option value="P">P</option>
                <option value="G">G</option>
            </select>
            </div>
          </div>
          </div>
          <div className="flex justify-center">
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 lg:w-4/12 ease-linear transition-all duration-150"
            type="submit"
            onClick={handleMedicamentSubmit}
          >
            Ajouter
          </button>
          </div>
          {showAlert && (
              <div>
              {alertType === "error" && <i className="fa fa-times-circle mr-2"></i>}
              {alertMessage}
            </div>
            )}
        </form>
        </div>
    </div>
  );
}
