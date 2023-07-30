import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import axios from "axios";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function CardAfficherUser({ color }) {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const apiInstance = createApiInstance(token);

    useEffect(() => {
       
            apiInstance.get("/api/v1/users")
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
              console.error("Erreur lors de la récupération des utilisateurs :", error);
            });
        
       
      }, []);

      const handleDelete = (userId) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
        if(confirmDelete){
        apiInstance.delete(`/api/v1/users/${userId}`)
          .then((response) => {
            console.log('User deleted successfully:', response.data);
            // Mettez à jour la liste des utilisateurs en supprimant l'utilisateur supprimé
            setUsers(users.filter((user) => user.id !== userId));
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });}
      };

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
            <div className="text-center flex justify-between">
            <div className="lg:w-6/12 px-4">
               <h6 className="text-blueGray-700 text-xl font-bold">Les utilisateurs</h6>
            </div>

            <div className="lg:w-6/12 px-4 ">
              <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-1 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 w-full ease-linear transition-all duration-150"
              ><Link to="/admin/registerUser">Ajouter un Utilisateur</Link></button>
            </div>        
          </div>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
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
                  Username
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Email
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Actions
                </th>
                
                
                
               
              </tr>
            </thead>
            <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                
               
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                  <div className="">
                    {user.username}
                  </div>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                  <div className="">
                    {user.email}
                  </div>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center ">
                <div className=""> {/* Utiliser la classe justify-center pour centrer horizontalement */}
                    <i onClick={() => handleDelete(user.id)} className="fas fa-trash-alt mr-3 text-lg text-red-500 "></i>
                </div>
                </td>
                
              </tr>))}
              
             
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardAfficherUser.defaultProps = {
  color: "light",
};

CardAfficherUser.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};