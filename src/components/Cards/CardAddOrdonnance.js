import React, { useState, useEffect, useContext } from "react";
import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import { format } from "date-fns";
import Select from 'react-select';
import "./Card.css"
import jsPDF from 'jspdf';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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
  const [posologieDropdown, setPosologieDropdown] = useState("1 fois");
  const [pendantNumber, setPendantNumber] = useState(1);
  const [pendantUnit, setPendantUnit] = useState("mois");
  const [selectedIdError, setSelectedIdError] = useState("");
  const [posologieError, setPosologieError] = useState("");
  const [quandError, setQuandError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showAlert, setShowAlert] = useState(false);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const history = useHistory();
  const [isOrdonnanceSubmitted, setIsOrdonnanceSubmitted] = useState(false);

  useEffect(() => {
    apiInstance.get("api/medicaments").then((response) => {
      setMedicaments(response.data);
    });
    apiInstance.get("/api/ordonnances").then((response) => {
        const isRendezvous = rendez && rendez.heure;
        const allOrdonnances = response.data;
        const rendezIdToCompare = isRendezvous ? rendez.id_rdv : rendez.id_sans_rdv;
        const matchingOrdonnance = allOrdonnances.find((ordonnance) => {
        const rendezvousId = isRendezvous ? ordonnance.rendezvous?.id_rdv : ordonnance.sansrdv?.id_sans_rdv;
        return rendezvousId === rendezIdToCompare;
      });
      if(matchingOrdonnance){
        setIsOrdonnanceSubmitted(true);
      }
    });
    setCurrentDate(format(new Date(), "dd-MM-yyyy"));
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
      setPosologieDropdown("1 fois");
      setQuand("");
      setPendantNumber(1);
      setPendantUnit("mois");
      setIsKeypadVisible(false);
      setShowAlert(false);
      setAlertMessage("");
    } catch (error) {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Une erreur s'est produite lors de la récupération des détails du médicament.");
      if (error.response && error.response.status === 401) {
        history.push('/401');
      }
    }
  };

  const editMedication = (index) => {
    const medication = ordonnanceMedicaments[index];
    removeMedication(index);
  
    const posologieParts = medication.posologie.split('-');
    if (posologieParts.length === 3) {
      setSelectedId(medication.medicament.id_medicament);
      setRadioOption(1);
      setPosologieFields([
        posologieParts[0],
        posologieParts[1],
        posologieParts[2].split('/')[0],
      ]);
      setPosologieFrequency(posologieParts[2].split('/')[1]);
      setQuand(medication.quand);
      setPendantNumber(parseInt(medication.pendant.split(' ')[0]));
      setPendantUnit(medication.pendant.split(' ')[1]);
    } else {
      setSelectedId(medication.medicament.id_medicament);
      setRadioOption(2);
      setPosologieDropdown(medication.posologie.split('/')[0]);
      setPosologieFrequency(medication.posologie.split('/')[1]);
      setQuand(medication.quand);
      setPendantNumber(parseInt(medication.pendant.split(' ')[0]));
      setPendantUnit(medication.pendant.split(' ')[1]);
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

  const submitOrdonnance = async () => {
    try{
      const response = await apiInstance.get("/api/ordonnances");
      const isRendezvous = rendez && rendez.heure;
      const allOrdonnances = response.data;
      const rendezIdToCompare = isRendezvous ? rendez.id_rdv : rendez.id_sans_rdv;
      const matchingOrdonnance = allOrdonnances.find((ordonnance) => {
        const rendezvousId = isRendezvous ? ordonnance.rendezvous?.id_rdv : ordonnance.sansrdv?.id_sans_rdv;
        return rendezvousId === rendezIdToCompare;
      });
      if (!matchingOrdonnance) {
        if (ordonnanceMedicaments.length > 0) {
          const isRendezvous = rendez && rendez.heure;
          const ordonnance = {
            date: currentDate,
            rendezvous: isRendezvous ? { id_rdv: rendez.id_rdv } : null,
            sansrdv: !isRendezvous ? { id_sans_rdv: rendez.id_sans_rdv } : null,
            ordonnanceMedicaments,
          };
          apiInstance.post("/api/ordonnances", ordonnance).then(() => {
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
      }      
    } catch {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage("Une erreur s'est produite lors de la création de l'ordonnance."); 
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
      const isRendezvous = rendez && rendez.heure;
      const allOrdonnances = response.data;
      const rendezIdToCompare = isRendezvous ? rendez.id_rdv : rendez.id_sans_rdv;
      const matchingOrdonnance = allOrdonnances.find((ordonnance) => {
        const rendezvousId = isRendezvous ? ordonnance.rendezvous?.id_rdv : ordonnance.sansrdv?.id_sans_rdv;
        return rendezvousId === rendezIdToCompare;
      });
  
      if (matchingOrdonnance) {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.text("Dr Moulay Hassan Alaoui", 20, 15);
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text("Docteur en Endocrinologie, Diabétologie et Nutrition", 20, 20);
        doc.setFont(undefined, 'normal');
        doc.text("N 7, 2 Av. Prince Héritier, Tanger 90000", 130, 15);
        doc.text("Tél: 0616210211", 166, 20);
        doc.setFontSize(12);
        doc.text(`Date:`, 20, 40);
        doc.text(`Patient: ${rendez.patient.nom} ${rendez.patient.prenom}`, 20, 50);
        doc.line(20, 55, 190, 55);
        doc.setFontSize(14);
        let yOffset = 75;
        matchingOrdonnance.ordonnanceMedicaments.forEach((medication) => {
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`${medication.medicament.nom}`, 20, yOffset);
          doc.setFont(undefined, 'normal');
          if (medication.posologie.split('-').length === 3) {
            const [part1, part2, part3] = medication.posologie.split('-');
            if (part3.split('/').length === 3){
            doc.text(`3 fois par ${part3.split('/')[2]} - matinée: ${part1}, après-midi: ${part2}, soir: ${part3.split('/')[0]}/${part3.split('/')[1]}, ${medication.quand.toLowerCase()}, pendant ${medication.pendant.toLowerCase()}`, 20, yOffset + 7);
            }
            else{
            doc.text(`3 fois par ${part3.split('/')[1]} - matinée: ${part1}, après-midi: ${part2}, soir: ${part3.split('/')[0]}, ${medication.quand.toLowerCase()}, pendant ${medication.pendant.toLowerCase()}`, 20, yOffset + 7);
            }
        } else {
          doc.text(`${medication.posologie.split('/')[0]} par ${medication.posologie.split('/')[1]}, ${medication.quand.toLowerCase()}, pendant ${medication.pendant.toLowerCase()}`, 20, yOffset + 7);
        }
          yOffset += 25;
        });
        doc.text("Signature & Cachet:", 150, 250);
          const pdfName = `ordonnance_${rendez.patient.nom}_${rendez.patient.prenom}_${currentDate}.pdf`;
          doc.save(pdfName);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        history.push('/401');
      }
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
                <option value="1 fois">1 fois</option>
                <option value="2 fois">2 fois</option>
                <option value="3 fois">3 fois</option>
                <option value="4 fois">4 fois</option>
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
            className={`bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full ${
              isOrdonnanceSubmitted ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isOrdonnanceSubmitted}
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
                <button onClick={() => editMedication(index)} className="cursor-pointer ml-2">
                <i className="fas fa-pen"></i>
                </button>
                <span onClick={() => removeMedication(index)} className="cursor-pointer ml-2">
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
