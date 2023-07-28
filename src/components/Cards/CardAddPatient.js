import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function CardAddPatient({ onClose, onAddSuccess }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [searchFieldValue, setSearchFieldValue] = useState("");
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    nom: "",
    prenom: "",
    sexe: "Male",
    type_patient: "provisoire",
    cin: "",
    photo_cin: "",
    telephone: "",
    ville: "",
    mutuelle: "Aucun",
    day: "",
    month: "",
    year: "",
    id_patient: "",
    date_de_naissance: "",
  });

  const combineDateInputs = (day, month, year) => {
    if (day && month && day !== 0 && month !== 0) {
      return `${day}-${month}-${year}`;
    } else {
      return `${year}`;
    }
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
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleTypePatientChange = (event) => {
    setUserData({
      ...userData,
      type_patient: event.target.value,
    });
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
          photo_cin: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL();
        setUserData({
          ...userData,
          photo_cin: photoUrl,
        });
        mediaStream.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  if (!userData.nom.trim() || !userData.prenom.trim()) {
    setShowAlert(true);
    setAlertType("error");
    setAlertMessage("Nom et prénom sont obligatoires !");
    return;
  }

  if (
    (userData.day !== "" ||
    userData.month !== "" )&&
    (userData.year === "" || userData.year === "0")
  ) {
    setShowAlert(true);
    setAlertType("error");
    setAlertMessage("Completez la date de naissance !");
    return;
  }
  apiInstance
  .post("/api/patients/", userData)
  .then((response) => {
    console.log("Patient added successfully:", response.data);
    setShowAlert(true);
    setAlertType("success");
    onAddSuccess(); 
  })
  .catch((error) => {
    console.error("Error adding patient:", error);
    setShowAlert(true);
    setAlertType("error");
    setAlertMessage("Error adding patient. Please try again.");
  });
  };

  const [searchResults, setSearchResults] = useState([]);
  const [selectedFatherId, setSelectedFatherId] = useState("");
  const [isFatherSelected, setIsFatherSelected] = useState(false);

  const handleSearchFather = (event) => {
    const { value } = event.target;
    setSearchFieldValue(value);
    if (value.trim() !== "") {
      // Perform the search only if the search field is not empty
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
          console.error("Error searching for father:", error);
        });
    } else {
      // If the search field is empty, clear the search results
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectFather = (father) => {
    setSelectedFatherId(father.id_patient); // Store the ID of the selected father
    setUserData({
      ...userData,
      id_parent: father.id_patient,
    });
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchFieldValue(`${father.nom} ${father.prenom}`);
    setIsFatherSelected(true); // Set the isFatherSelected state to true when a father is selected
  };

  const handleRemoveFather = () => {
    setSelectedFatherId(null); // Reset the selected father ID
    setUserData({
      ...userData,
      id_parent: "",
    });
    setIsFatherSelected(false); // Reset the isFatherSelected state
    setSearchFieldValue(""); // Clear the input field
  };

  const fieldsNotEmpty = useRef(false);
  useEffect(() => {
    const hasFieldsNotEmpty = Object.values(userData).some(
      (value) => value && typeof value === "string"
    );
    fieldsNotEmpty.current = hasFieldsNotEmpty;
  }, [userData]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (fieldsNotEmpty.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-3">
          <div className="text-center flex justify-between">
            <div className="lg:w-1/12">
              <h6 className="text-blueGray-700 text-xl font-bold">
                Ajouter un Patient
              </h6>
            </div>
            <div className="lg:w-1/12">
              <button onClick={onClose} className="focus:outline-none">
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <div className="flex flex-wrap py-4">
              <div className="w-full lg:w-4/12 px-4">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-4"
                  htmlFor="type_patient"
                >
                  Type de Patient
                </label>
                <div>
                  <label className="mr-2">
                    <input
                      type="radio"
                      name="type_patient"
                      value="officiel"
                      checked={userData.type_patient === "officiel"}
                      onChange={handleTypePatientChange}
                    />
                    Officiel
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type_patient"
                      value="provisoire"
                      checked={userData.type_patient === "provisoire"}
                      onChange={handleTypePatientChange}
                    />
                    Provisoire
                  </label>
                </div>
              </div>
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
                    onChange={handleChange}
                    name="nom"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
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
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
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
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring lg:w-8/12 ease-linear transition-all duration-150"
                    />
                    <div className="flex ml-2">
                      <div
                        className="clickable-icon"
                        onClick={handlePhotoCINUpload}
                      >
                        <i className="fas fa-upload px-4"></i>
                      </div>
                      <div
                        className="clickable-icon ml-2"
                        onClick={handleTakePhoto}
                      >
                        <i className="fas fa-camera"></i>
                      </div>
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
                  {userData.photo_cin && (
                    <img
                      src={userData.photo_cin}
                      alt="CIN"
                      className="mt-2 rounded-md h-20"
                    />
                  )}
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="date_de_naissance"
                >
                  Date de naissance
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="day"
                    placeholder="Jour"
                    value={userData.day}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-center placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-16 md:w-10 lg:w-14 xl:w-16 ease-linear transition-all duration-150 mr-1"
                  />
                  <input
                    type="number"
                    name="month"
                    placeholder="Moi"
                    value={userData.month}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-center placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-16 md:w-10 lg:w-14 xl:w-16 ease-linear transition-all duration-150 ml-1 mr-1"
                  />
                  <input
                    type="number"
                    name="year"
                    placeholder="Année"
                    value={userData.year}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-center placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-24 md:w-20 lg:w-24 xl:w-28 ease-linear transition-all duration-150 ml-1"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-4"
                  htmlFor="sexe"
                >
                  Genre
                </label>
                <div>
                  <label className="mr-2">
                    <input
                      type="radio"
                      name="sexe"
                      value="Male"
                      checked={userData.sexe === "Male"}
                      onChange={handleSexeChange}
                    />
                    Homme
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sexe"
                      value="Female"
                      checked={userData.sexe === "Female"}
                      onChange={handleSexeChange}
                    />
                    Femme
                  </label>
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
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
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
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
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
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
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="mutuelle"
                >
                  Mutuelle
                </label>
                <select
                  name="mutuelle"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option value="other">Aucun</option>
                  <option value="CNSS">CNSS</option>
                  <option value="CNOPS">CNOPS</option>
                </select>
              </div>
              <div className="w-full lg:w-4/12 px-4">
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="father_search"
          >
            Rechercher le Père
          </label>
          <div className="relative">
            <input
              type="text"
              name="father_search"
              onChange={handleSearchFather}
              value={searchFieldValue}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            />
            {isFatherSelected && (
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleRemoveFather}
              >
                <i className="fas fa-times text-red-500"></i>
              </div>
            )}
          </div>
          {searchFieldValue.trim() !== "" && showSearchResults && searchResults.length > 0 && !isFatherSelected && (
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
              Ajouter
            </button>
            </div>  
            {showAlert && (
              <div >
                {alertType === "success" ? (
                  <i className="fa fa-check-circle mr-2"></i>
                ) : (
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
