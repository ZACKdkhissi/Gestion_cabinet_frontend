import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import { differenceInYears} from "date-fns";
import CardAddSansrdv from "./CardAddSansrdv";

export default function CardPatients({ color, onOpenAddPatient, onViewProfile }) {
  const { token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const apiInstance = createApiInstance(token);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    apiInstance
      .get("api/patients")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = patients.filter((patient) => {
      const { cin, nom, prenom } = patient;
      return (
        cin.toLowerCase().includes(query) ||
        nom.toLowerCase().includes(query) ||
        prenom.toLowerCase().includes(query)
      );
    });
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleDeletePatient = (patientId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce patient ?"
    );
    if (confirmDelete) {
      apiInstance
        .delete(`/api/patients/${patientId}`)
        .then((response) => {
          console.log(response.data);
          setFilteredPatients((prevPatients) =>
            prevPatients.filter((patient) => patient.id_patient !== patientId)
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleViewProfile = (patient) => {
    onViewProfile(patient);
  };

  function parseDateFromString(dateString) {
    const parts = dateString.split("-");
    const parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    return parsedDate;
  }

  const handleToggleAppointmentModal = (patient) => {
    setSelectedPatient(patient);
    setShowAppointmentModal(!showAppointmentModal);
  };

  return (
    <div >
      {showAppointmentModal && (
            <CardAddSansrdv onClose={() => setShowAppointmentModal(false)} patient={selectedPatient} />
      )}
      <div  style={{ height: "14cm",maxHeight: "14cm", overflowY: "auto" }}
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 text-center" >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold lg:w-1/12">Patients</h3>
            <div className="flex items-center ">
              <button onClick={onOpenAddPatient} className="mr-4 focus:outline-none" >
                <i className="fas fa-plus"></i>
              </button>
              <div className="relative flex items-center">
                <span className="z-10 h-full leading-snug font-normal absolute text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Chercher ici"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 px-3 py-3 pl-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Nom et prénom
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Age
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Date de naissance
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                ></th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                ></th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((patient) => {
                const createdDate = new Date(patient.created_at);
                const twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); 
                const isNewPatient = createdDate >= twoDaysAgo;
                const dateOfBirth = parseDateFromString(patient.date_de_naissance);
                const age = differenceInYears(new Date(), dateOfBirth);return (
                <tr key={patient.id_patient}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    {patient.nom && patient.prenom
                      ? `${patient.nom} ${patient.prenom}`
                      : "-"}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    {age || "-"}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    {patient.date_de_naissance || "-"}
                  </td>
                  <td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    <button
                    className="focus:outline-none"
                    onClick={() => handleToggleAppointmentModal(patient)}
                    >
                    <i className="fas fa-calendar-plus text-lg"></i>
                    </button>
                  </td>
                  <td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    <button
                    className="focus:outline-none"
                    onClick={() => handleViewProfile(patient)}
                    >
                    <i className="fas fa-eye text-lg"></i>
                    </button>
                  </td>
                  <td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                    <button
                      className="focus:outline-none"
                      onClick={() => handleDeletePatient(patient.id_patient)}
                    >
                      <i className="fas fa-trash-alt mr-2 text-lg text-red-500"></i>
                    </button>
                    {isNewPatient && (
                        <span
                        className="text-red-500"
                        style={{ fontSize: "20px", marginLeft: "4px" }}
                      >
                        *
                      </span>
                      )}
                  </td>
                </tr>
                );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

CardPatients.defaultProps = {
  color: "light",
};

CardPatients.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  onOpenAddPatient: PropTypes.func.isRequired,
};
