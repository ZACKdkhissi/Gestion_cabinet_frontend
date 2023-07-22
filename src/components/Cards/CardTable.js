import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import axios from "axios";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";

export default function CardTable({ color,patients  }) { 
  const { token } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const apiInstance = createApiInstance(token);

  useEffect(() => {
    apiInstance
      .get("/api/v1/auth/userinfo")
      .then((response) => {
        if (response.data.userName && Array.isArray(response.data.roles)) {
          // Format the response into an array of a single object
          const formattedData = [
            {
              username: response.data.userName,
              roles: response.data.roles,
            },
          ];
          setUserInfo(formattedData);
        } else {
          console.error("Invalid response format: ", response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Patients
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Nom et prenom
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  type
                </th>
              </tr>
            </thead>
            <tbody>
            {patients.map((patient) => (
                <tr key={patient.id_patient}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {patient.nom} {patient.prenom}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {patient.type_patient}
                  </td>
                  {/* ... add more table cells for other patient data ... */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
  patients: [],
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(
        PropTypes.shape({
          roleCode: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};
