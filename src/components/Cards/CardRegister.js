import createApiInstance from "api/api";
import axios from "axios";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

// components

export default function CardRegister() {

    const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success'); // 'success' ou 'error'
  const [alertMessage, setAlertMessage] = useState('');

    const { token } = useContext(AuthContext);

    const apiInstance = createApiInstance(token);

    const [userData, setUserData] = useState({
        roles: [],
        username: '',
        password: '',
        email: ''
      });
    
      const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        setUserData((prevData) => {
          if (checked) {
            return {
              ...prevData,
              roles: [...prevData.roles, value]
            };
          } else {
            return {
              ...prevData,
              roles: prevData.roles.filter((role) => role !== value)
            };
          }
        });
      };
    
      const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({
          ...userData,
          [name]: value
        });
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        apiInstance.post('http://localhost:8080/api/v1/register', userData)
          .then((response) => {
            console.log('User registered successfully:', response.data);
            // Ajoutez ici le code pour gérer la réponse de l'API si nécessaire.
            setShowAlert(true);
        setAlertType('success');
        setAlertMessage('User registered successfully.');
          })
          .catch((error) => {
            console.error('Error registering user:', error);
            // Ajoutez ici le code pour gérer les erreurs si nécessaire.
            setShowAlert(true);
            setAlertType('error');
            setAlertMessage('Error registering user. Please try again.');
          });
      };
      
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <div className="lg:w-1/12 px-4">
               <h6 className="text-blueGray-700 text-xl font-bold">Ajouter Compte</h6>
            </div>

           
            
            
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Ajouter Utilisateur
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Email address
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

             

              
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                        <label
                                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="roles"
                        >
          Roles
        </label>
        


        
        <div className="space-x-2">
        
          <label>
            <input
              type="checkbox"
              className="form-checkbox text-sky-500 h-5 w-5 text-lightBlue-600 justify-center border rounded-full"
              name="roles"
              value="ADMIN"
              checked={userData.roles.includes('ADMIN')}
              onChange={handleRoleChange}
            />
            Admin
          </label>
          &nbsp;
          <label>
            <input
              type="checkbox"
              className="form-checkbox text-sky-500 h-5 w-5 text-lightBlue-600 justify-center border rounded-full"
              name="roles"
              value="DOCTOR"
              checked={userData.roles.includes('DOCTOR')}
              onChange={handleRoleChange}
            />
            Doctor
          </label>
          &nbsp;
          <label>
            <input
              type="checkbox"
              className="form-checkbox text-sky-500 h-5 w-5 text-lightBlue-600 justify-center border rounded-full"
              name="roles"
              value="SECRETARY"
              checked={userData.roles.includes('SECRETARY')}
              onChange={handleRoleChange}
            />
            Secretary
          </label>
          &nbsp;
          <label>
            <input
              type="checkbox"
              className="form-checkbox text-sky-500 h-5 w-5 text-lightBlue-600 justify-center border rounded-full"
              name="roles"
              value="NURSE"
              checked={userData.roles.includes('NURSE')}
              onChange={handleRoleChange}
            />
            Nurse
          </label>
        </div>
      </div>
            </div>


            <br></br>

            <button
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 w-full ease-linear transition-all duration-150"
             type="submit"
              onClick={handleSubmit}
            >Register
                </button>

                {showAlert && (
        <div
          className={`${
            alertType === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
          } border-l-4 border-green-700 p-4 mt-4`}
        >
          {alertMessage}
        </div>
      )}
            
          </form>
        </div>
      </div>
    </>
  );
}
