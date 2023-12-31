import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import React, {useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

export default function CardModifyPatient({ patient, onEditSuccess }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [searchFieldValue, setSearchFieldValue] = useState("");
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isFatherSelected, setIsFatherSelected] = useState(false);
  const [userData, setUserData] = useState({
    email: patient.email || "",
    nom: patient.nom || "",
    prenom: patient.prenom || "",
    sexe: patient.sexe || "Homme",
    code_patient : patient.code_patient || "",
    cin: patient.cin || "",
    photo_cin: patient.photo_cin || "",
    telephone: patient.telephone || "",
    ville: patient.ville || "",
    mutuelle: patient.mutuelle || "Aucun",
    day: "",
    month: "",
    year: "",
    date_de_naissance: patient.date_de_naissance || "",
  });

  const combineDateInputs = (day, month, year) => {
    return `${day || 0}-${month || 0}-${year}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "day" || name === "month" || name === "year") {
      const { day, month, year } = userData;
      const formattedDate = combineDateInputs(
        name === "day" ? value : day,
        name === "month" ? value : month,
        name === "year" ? value : year
      );
      setUserData({
        ...userData,
        date_de_naissance: formattedDate,
        [name]: value,
      });
    } else if (name === "code_patient") {
      setUserData({
        ...userData,
        [name]: parseInt(value, 10),
      });
    } else if (name === "prenom") {
      setUserData({
        ...userData,
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      });
    } else if (name === "nom") {
      setUserData({
        ...userData,
        [name]: value.toUpperCase(),
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };


  const handleSexeChange = (event) => {
    setUserData({
      ...userData,
      sexe: event.target.value,
    });
  };

  const fileInputRef = useRef(null);

  const handlePhotoCINUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          newphoto_cin: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const [day, month, year] = userData.date_de_naissance.split("-");
    setUserData((prevUserData) => ({
      ...prevUserData,
      day: day || "",
      month: month || "",
      year: year || "",
    }));
  }, [userData.date_de_naissance]);

  useEffect(() => {
    const fetchFatherInformation = async () => {
      try {
        if (patient.id_parent) {
          const response = await apiInstance.get(`/api/patients/${patient.id_parent}`);
          const fatherData = response.data;
          setSearchFieldValue(`${fatherData.nom} ${fatherData.prenom}`);
          setIsFatherSelected(true);
          setUserData((prevUserData) => ({
            ...prevUserData,
            father_nom: fatherData.nom,
            father_prenom: fatherData.prenom,
            id_parent: fatherData.id_patient,
          }));
        } else {
          setSearchFieldValue("");
          setIsFatherSelected(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      }
    };

    fetchFatherInformation();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[patient.id_parent]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userData.nom.trim() || !userData.prenom.trim()) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Nom et prénom sont obligatoires !");
      return;
    }
    if (!userData.cin.trim() && (userData.newphoto_cin|| userData.photo_cin)) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Veuillez saisir le numéro de CIN !");
      return;
    }

    const photoCinBase64 = userData.newphoto_cin ? userData.newphoto_cin.split(",")[1] : userData.photo_cin;

    apiInstance
      .put(`/api/patients/${patient.id_patient}`, {
        ...userData,
        photo_cin: photoCinBase64,
      })
      .then((response) => {
        onEditSuccess(response.data);
      })
      .catch((error) => {
        setShowAlert(true);
        setAlertType("error");
        setAlertMessage("Problème technique !");
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      });
  };

  const history = useHistory();
      const fieldsNotEmpty = useRef(false);
      useEffect(() => {
        const inputFields = ['code_patient', 'nom', 'prenom', 'cin', 'email', 'telephone', 'ville'];
        const hasFieldsNotEmpty = inputFields.some((fieldName) => {
          const value = userData[fieldName];
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
      }, [history,userData]);


  const handleReturnButtonClick = () => {
    if (fieldsNotEmpty.current) {
      const confirmed = window.confirm(
        "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?"
      );
      if (!confirmed) {
        return;
      }
    }
    onEditSuccess(patient);
  };

  const handleRemovePhoto = () => {
    if (userData.newphoto_cin) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        newphoto_cin: "",
      }));
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        photo_cin: "",
      }));
    }
  };

  const handleSearchFather = (event) => {
    const { value } = event.target;
    setSearchFieldValue(value);
    if (value.trim() !== "") {
      apiInstance
        .get(`/api/patients`)
        .then((response) => {
          const filteredResults = response.data.filter(
            (father) =>
              `${father.nom} ${father.prenom}`.toLowerCase().includes(value.toLowerCase())
          );
          setSearchResults(filteredResults);
          setShowSearchResults(true);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            history.push('/401');
          }
        });
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };
  
  const handleSelectFather = (father) => {
    setUserData({
      ...userData,
      id_parent: father.id_patient,
    });
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchFieldValue(`${father.nom} ${father.prenom}`);
    setIsFatherSelected(true);
  };
  
  const handleRemoveFather = () => {
    setUserData({
      ...userData,
      id_parent: "",
    });
    setIsFatherSelected(false);
    setSearchFieldValue("");
  };
  

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-3">
          <div className="text-center flex">
            <div className="mr-4">
              <button onClick={handleReturnButtonClick} className="focus:outline-none">
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
            <h6 className="text-blueGray-700 text-xl font-bold">Modifier un Patient</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
  <div className="flex flex-wrap py-4">
    <div className="w-full lg:w-3/12 px-4 flex flex-wrap">
      <div className="relative w-1/2 mb-3">
      <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="code_patient"
                >
                  Code Patient
                </label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="code_patient"
                  value={userData.code_patient}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 uppercase"
                />
              </div>
              <div className="relative w-1/2 mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-4 ml-3"
                  htmlFor="sexe"
                >
                  Genre
                </label>
                <div>
                  <label className="w-full ml-3 mr-3 lg:w-1/2">
                    <input
                      type="radio"
                      name="sexe"
                      value="Homme"
                      checked={userData.sexe === "Homme"}
                      onChange={handleSexeChange}
                    />
                    H
                  </label>
                  <label className="w-full ml-3 lg:w-1/2">
                    <input
                      type="radio"
                      name="sexe"
                      value="Femme"
                      checked={userData.sexe === "Femme"}
                      onChange={handleSexeChange}
                    />
                    F
                  </label>
                </div>
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="nom"
        >
          Nom
        </label>
        <input
          type="text"
          onChange={handleChange}
          name="nom"
          value={userData.nom}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="prenom"
        >
          Prénom
        </label>
        <input
          type="text"
          name="prenom"
          value={userData.prenom}
          onChange={handleChange}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="date_de_naissance"
        >
          Date de naissance
        </label>
        <div className="relative w-full mb-3">
          <input
            type="number"
            name="day"
            placeholder="Jour"
            value={userData.day}
            onChange={handleChange}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 mr-1"
            style={{ width: "24.5%" }}
          />
          <input
            type="number"
            name="month"
            placeholder="Moi"
            value={userData.month}
            onChange={handleChange}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 mr-1 m-1"
            style={{ width: "24.5%" }}
          />
          <input
            type="number"
            name="year"
            placeholder="Année"
            value={userData.year}
            onChange={handleChange}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            style={{ width: "47%" }}
          />
        </div>
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="cin"
        >
          CIN
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="cin"
            value={userData.cin}
            onChange={handleChange}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          />
          <div className="flex items-center">
            <div className="clickable-icon" onClick={handlePhotoCINUpload}>
              <i className="fas fa-upload px-4"></i>
            </div>
          </div>
          <input
            type="file"
            name="photo_cin"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            capture="user"
            required
          />
        </div>
        {(userData.newphoto_cin || userData.photo_cin) && (
          <div>
            <img
              src={userData.newphoto_cin || `data:image/jpeg;base64,${userData.photo_cin}`}
              alt={`${userData.nom}_${userData.prenom}`}
              className="mt-2 rounded-md h-20"
            />
            <i
              className="fas fa-times text-red-500 cursor-pointer"
              onClick={handleRemovePhoto}
            ></i>
          </div>
        )}
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="ville"
        >
          Ville
        </label>
        <input
          type="text"
          name="ville"
          value={userData.ville}
          onChange={handleChange}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="telephone"
        >
          Téléphone
        </label>
        <input
          type="tel"
          name="telephone"
          value={userData.telephone}
          onChange={handleChange}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        />
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="mutuelle"
        >
          Mutuelle
        </label>
        <select
          name="mutuelle"
          onChange={handleChange}
          value={userData.mutuelle}
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        >
          <option value="Aucun">Aucun</option>
          <option value="CNSS">CNSS</option>
          <option value="CNOPS">CNOPS</option>
        </select>
      </div>
    </div>
    <div className="w-full lg:w-3/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="father_search"
        >
          Lien de parenté
        </label>
        <div className="relative">
          <input
            type="text"
            name="father_search"
            onChange={handleSearchFather}
            value={searchFieldValue}
            placeholder="Chercher le père ou la mère"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          />
          {isFatherSelected && (
            <div
              className="absolute right-0 top-0 flex items-center h-full cursor-pointer px-4"
              onClick={handleRemoveFather}
            >
              <i className="fas fa-times text-red-500"></i>
            </div>
          )}
        </div>
        {searchFieldValue.trim() !== "" &&
          showSearchResults &&
          searchResults.length > 0 &&
          !isFatherSelected && (
            <div className="mt-2 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
              {searchResults.map((father) => (
                <div
                  key={father.id_patient}
                  onClick={() => handleSelectFather(father)}
                >
                  {`${father.nom} ${father.prenom}`}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  </div>
  <div className="flex justify-center">
    <button
      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 lg:w-4/12 ease-linear transition-all duration-150"
      type="submit"
      onClick={handleSubmit}
    >
      Modifier
    </button>
  </div>
  {showAlert && (
    <div>
      {alertType === "error" && (
        <i className="fa fa-times-circle mr-2"></i>
      )}
      {alertMessage}
    </div>
  )}
</form>

        </div>
      </div>
    </>
  );
}
