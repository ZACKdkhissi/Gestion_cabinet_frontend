import React, { useState, useEffect, useContext } from "react";
import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import { format } from "date-fns";
import Select from 'react-select';
import "./Card.css"
import jsPDF from 'jspdf';

export default function CardAddOrdonnance({ rendez }) {
  const [medicaments, setMedicaments] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [posologieFields, setPosologieFields] = useState(["", "", ""]);
  const [posologieFrequency, setPosologieFrequency] = useState("jour");
  const [radioOption, setRadioOption] = useState(1);
  const [quand, setQuand] = useState("");
  const [ordonnanceMedicaments, setOrdonnanceMedicaments] = useState([]);
  const { token } = useContext(AuthContext);
  const apiInstance = createApiInstance(token);
  const [currentDate, setCurrentDate] = useState("");
  const [posologieDropdown, setPosologieDropdown] = useState("1fois");
  const [pendantNumber, setPendantNumber] = useState(1);
  const [pendantUnit, setPendantUnit] = useState("mois");
  const [selectedIdError, setSelectedIdError] = useState("");
  const [posologieError, setPosologieError] = useState("");
  const [quandError, setQuandError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showAlert, setShowAlert] = useState(false);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const [isOrdonnanceSubmitted, setIsOrdonnanceSubmitted] = useState(false);


  useEffect(() => {
    apiInstance.get("api/medicaments").then((response) => {
      setMedicaments(response.data);
    });

    setCurrentDate(format(new Date(), "dd-MM-yyyy"));
    // eslint-disable-next-line
  }, []);

  const addMedication = async () => {
    setSelectedIdError("");
    setPosologieError("");
    setQuandError("");
  
    let hasError = false;
  
    if (!selectedId) {
      setSelectedIdError("Selectionner un médicament!");
      hasError = true;
    }
  
    if (radioOption === 1 && posologieFields.some((field) => field === "")) {
      setPosologieError("Régler ce champs!");
      hasError = true;
    }
    if (radioOption === 2 && !posologieDropdown) {
      setPosologieError("Régler ce champs!");
      hasError = true;
    }
    if (!quand) {
      setQuandError("Régler ce champs!");
      hasError = true;
    }
  
    if (hasError) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Veuillez corriger les champs en rouge.");
      return;
    }
  
    try {
      const response = await apiInstance.get(`api/medicaments/${selectedId}`);
      const medicationDetails = response.data;
  
      let newMedication = {};
      if (radioOption === 1) {
        newMedication = {
          posologie: `${posologieFields.join("-")}/${posologieFrequency}`,
          pendant: `${pendantNumber} ${pendantUnit}`,
          quand,
          medicament: medicationDetails,
        };
      } else if (radioOption === 2) {
        newMedication = {
          posologie: `${posologieDropdown}/${posologieFrequency}`,
          pendant: `${pendantNumber} ${pendantUnit}`,
          quand,
          medicament: medicationDetails,
        };
      }
  
      setOrdonnanceMedicaments([...ordonnanceMedicaments, newMedication]);
      setPosologieFields(["", "", ""]);
      setPosologieFrequency("jour");
      setPosologieDropdown("1fois");
      setQuand("");
      setPendantNumber(1);
      setPendantUnit("mois");
      setIsKeypadVisible(false);
    } catch (error) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Une erreur s'est produite lors de la récupération des détails du médicament.");
    }
  };

  const Keypad = ({ onValueSelected }) => {
    const keypadButtonLayout = [
      ["1/2", "1/4", "3/4"],
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["0"]
    ];
  
    return (
      <div className="bg-gray-200 rounded-lg shadow" style={{ width: "40%", margin: "0 auto" }}>
        <div>
          {keypadButtonLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              {row.map((button, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`p-2 text-sm font-semibold text-white rounded-lg bg-lightBlue-500 ${
                    button === "0" ? "col-span-3 font-bold" : ""
                  }`}
                  style={{ margin: "4px" }}
                  onClick={() => onValueSelected(button)}
                >
                  {button}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const [activeField, setActiveField] = useState(null);

  const handleKeypadClick = (value) => {
    if (activeField !== null) {
      const updatedFields = [...posologieFields];
      if (updatedFields[activeField] !== "") {
        updatedFields[activeField] = "";
      }
      updatedFields[activeField] += value;
      setPosologieFields(updatedFields);
    }
  };
  

  const handleChangeSearch = (searchValue) => {
    medicaments.filter((medicament) => {
      const fullName = ` ${medicament.nom} `;
      return fullName.toLowerCase().includes(searchValue.toLowerCase());
    });
  };

  const submitOrdonnance = () => {
    if (ordonnanceMedicaments.length > 0) {
      const isRendezvous = rendez && rendez.heure;
      const ordonnance = {
        date: currentDate,
        rendezvous: isRendezvous ? { id_rdv: rendez.id_rdv } : null,
        sansrdv: !isRendezvous ? { id_sans_rdv: rendez.id_sans_rdv } : null,
        ordonnanceMedicaments,
      };

      apiInstance
        .post("/api/ordonnances", ordonnance)
        .then(() => {
          setShowAlert(true);
          setIsOrdonnanceSubmitted(true);
          setAlertType("success");
          setMedicaments([]);
          setAlertMessage("Ordonnance créée avec succès!");
        })
        .catch(() => {
          setShowAlert(true);
          setAlertType("error");
          setAlertMessage("Une erreur s'est produite lors de la création de l'ordonnance.");
        });
    } else {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Veuillez ajouter au moins un médicament à l'ordonnance."); 
    }
  };

  const clearMedications = () => {
    setOrdonnanceMedicaments([]);
  };

  const removeMedication = (indexToRemove) => {
    const updatedMedications = ordonnanceMedicaments.filter((_, index) => index !== indexToRemove);
    setOrdonnanceMedicaments(updatedMedications);
  };

  const generatePDF = async () => {
  try {
    const response = await apiInstance.get("/api/ordonnances");
    const data = response.data;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setFontSize(16);
    doc.text("Ordonnance Médicale", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 20, 30);
    doc.text(`Nom du patient: ${rendez.patient.nom}`, 20, 40);
    doc.text(`Prénom du patient: ${rendez.patient.prenom}`, 20, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
    doc.setFontSize(14);
    doc.text("Médicaments:", 20, 65);
    let yOffset = 75;
    data.forEach((ordonnance) => {
      ordonnance.ordonnanceMedicaments.forEach((medication) => {
        doc.setFontSize(12);
        doc.text(`Médicament: ${medication.medicament.nom}`, 20, yOffset);
        doc.text(`Posologie: ${medication.posologie}`, 20, yOffset + 10);
        doc.text(`Quand: ${medication.quand}`, 20, yOffset + 20);
        doc.text(`Pendant: ${medication.pendant}`, 20, yOffset + 30);
        yOffset += 50;
      });
    });
    const pdfName = `ordonnance_${rendez.patient.nom}_${rendez.patient.prenom}_${currentDate}.pdf`;
    doc.save(pdfName);
  } catch (error) {
    console.error("Error fetching data from the API:", error);
  }
};

  
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
      <div className="relative w-full text-blueGray-600 lg:w-full py-4 text-center">
        <div className="rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Créer une ordonnance</h2>
          <div className="flex relative mb-2 justify-center items-center">
            <Select
              className="w-1/2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              placeholder="Sélectionner un médicament"
              options={medicaments.map((medicament) => ({
                value: medicament.id_medicament,
                label: ` ${medicament.nom}`,
              }))}
              onChange={(selectedOption) => {
                setSelectedId(selectedOption.value);
                setSelectedIdError("");
              }}
              onInputChange={(inputValue) => handleChangeSearch(inputValue)}
              isSearchable
            />
          </div>
          {selectedIdError && (
              <p className="text-red-500 mb-4">{selectedIdError}</p>
            )}
          <div className="mb-2">
            <label htmlFor="posologie" className="block text-sm font-medium text-gray-700 mb-1">
              Posologie :
            </label>
            <div className="flex relative mb-1 justify-center items-center">
              <input
                type="radio"
                className="form-radio"
                name="posologieOption"
                value="option1"
                checked={radioOption === 1}
                onChange={() => setRadioOption(1)}
              />
              <input
                type="text"
                id="posologieField1"
                className={`p-2 border border-gray-300 rounded-lg w-1/4 ml-1 ${radioOption === 1 ? "" : "opacity-50 cursor-not-allowed"}`}
                placeholder="Matin"
                value={posologieFields[0]}
                onChange={(e) => {
                  if (radioOption === 1) {
                    const updatedFields = [...posologieFields];
                    updatedFields[0] = e.target.value;
                    setPosologieFields(updatedFields);
                    setPosologieError("");
                  }
                }}
                disabled={radioOption !== 1}
                style={{ width: "17%" }}
                onClick={() => setActiveField(0)}
              />
              <input
                type="text"
                id="posologieField2"
                className={`p-2 border border-gray-300 rounded-lg w-1/4 ml-1 ${radioOption === 1 ? "" : "opacity-50 cursor-not-allowed"}`}
                placeholder="Après-midi"
                value={posologieFields[1]}
                onChange={(e) => {
                  if (radioOption === 1) {
                    const updatedFields = [...posologieFields];
                    updatedFields[1] = e.target.value;
                    setPosologieFields(updatedFields);
                    setPosologieError("");
                  }
                }}
                disabled={radioOption !== 1}
                style={{ width: "17%" }}
                onClick={() => setActiveField(1)}
              />
              <input
                type="text"
                id="posologieField3"
                className={`p-2 border border-gray-300 rounded-lg w-1/4 ml-1 ${radioOption === 1 ? "" : "opacity-50 cursor-not-allowed"}`}
                placeholder="Soir"
                value={posologieFields[2]}
                onChange={(e) => {
                  if (radioOption === 1) {
                    const updatedFields = [...posologieFields];
                    updatedFields[2] = e.target.value;
                    setPosologieFields(updatedFields);
                    setPosologieError("");
                  }
                }}
                disabled={radioOption !== 1}
                style={{ width: "17%" }}
                onClick={() => setActiveField(2)}
              />
              <button onClick={() => setIsKeypadVisible(!isKeypadVisible)} className="focus:outline-none">
                <i className="fas fa-calculator ml-1 mr-3"></i>
              </button>
              <input
                type="radio"
                className="form-radio"
                name="posologieOption"
                value="option2"
                checked={radioOption === 2}
                onChange={() => setRadioOption(2)}
              />
              <select
                className={`p-2 border border-gray-300 rounded-lg w-1/2 ml-1 ${radioOption === 2 ? "" : "opacity-50 cursor-not-allowed"}`}
                value={posologieDropdown}
                onChange={(e) => {
                  if (radioOption === 2) {
                    setPosologieDropdown(e.target.value);
                    setPosologieError("");
                  }
                }}
                disabled={radioOption !== 2}
                style={{ width: "15%" }}
              >
                <option value="1fois">1 fois</option>
                <option value="2fois">2 fois</option>
                <option value="3fois">3 fois</option>
                <option value="4fois">4 fois</option>
              </select>
            </div>
            <div className="flex relative mb-4 justify-center items-center">
              <select
                className={`p-2 border border-gray-300 rounded-lg w-1/2 ml-1`}
                value={posologieFrequency}
                onChange={(e) => {
                  setPosologieFrequency(e.target.value)
                }}
                style={{ width: "20%" }}
              >
                <option value="jour">/Jour</option>
                <option value="mois">/Mois</option>
                <option value="semaine">/Semaine</option>
              </select>
            </div>
          </div>
          {isKeypadVisible && <div className="mb-4"><Keypad onValueSelected={handleKeypadClick}/></div>}
          {posologieError && (
                <p className="text-red-500 mb-4">{posologieError}</p>
              )}
          <div className="mb-4" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="quand" className="block text-sm font-medium text-gray-700">
                Quand :
              </label>
              <select
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full "
                value={quand}
                onChange={(e) => {
                  setQuand(e.target.value)
                  setQuandError("");
                }}
                style={{ width: "90%" }}
              >
                <option value="">Sélectionnez le moment</option>
                <option value="Avant le repas">Avant le repas</option>
                <option value="Après le repas">Après le repas</option>
                <option value="Au coucher">Au coucher</option>
              </select>
              {quandError && (
                <p className="text-red-500 mt-4">{quandError}</p>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="pendant" className="block text-sm font-medium text-gray-700">
                Pendant :
              </label>
              <div className="flex relative mb-4 justify-center items-center">
                <select
                  className="mt-1 mr-1 p-2 border border-gray-300 rounded-lg w-full "
                  value={pendantNumber}
                  onChange={(e) => setPendantNumber(e.target.value)}
                  style={{ width: "20%" }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full "
                  value={pendantUnit}
                  onChange={(e) => setPendantUnit(e.target.value)}
                  style={{ width: "30%" }}
                >
                  <option value="jour">Jour</option>
                  <option value="mois">Mois</option>
                  <option value="année">Année</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={addMedication}
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full"
          >
            Ajouter Médicament
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Médicaments ajoutés :</h2>
          <ul>
            {ordonnanceMedicaments.map((medication, index) => (
              <li key={index}>
                {medication.medicament.nom} - Posologie: {medication.posologie}, Quand: {medication.quand}, Pendant: {medication.pendant}
                <span
                  onClick={() => removeMedication(index)}
                  className="cursor-pointer ml-2"
                >
                  <i className="fas fa-times"></i>
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={clearMedications}
            className="mt-2 bg-red-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full"
          >
            Effacer tout
          </button>
        </div>
        <div className="mt-4">
        <button
          onClick={submitOrdonnance}
          className={`bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full ${
            isOrdonnanceSubmitted ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={isOrdonnanceSubmitted}
        >
          Soumettre Ordonnance
        </button>
        <button
          onClick={generatePDF}
          className={`bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full ml-1 ${
            isOrdonnanceSubmitted ? '' : 'cursor-not-allowed opacity-50'
          }`}
          disabled={!isOrdonnanceSubmitted}
        >
          Générer PDF
        </button>
          {showAlert && alertType === "error" && (
            <div className="text-red-500 mt-4">
              <i className="fa fa-times-circle mr-2"></i>
              {alertMessage}
            </div>
          )}
          {showAlert && alertType === "success" && (
            <div className="text-green-500 mt-4">
              <i className="fa fa-check-circle mr-2"></i>
              {alertMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
