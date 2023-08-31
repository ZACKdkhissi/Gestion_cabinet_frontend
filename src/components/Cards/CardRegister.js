import createApiInstance from "api/api";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

export default function CardRegister({onAddSuccess}) {

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
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
        apiInstance.post('/api/v1/register', userData)
          .then((response) => {
            onAddSuccess();
            setShowAlert(true);
            setAlertType('success');
            setAlertMessage("Utilisateur crée avec succès!");
          })
          .catch((error) => {
            setShowAlert(true);
            setAlertType("error");
            setAlertMessage("Problème technique !");
          });
      };
      const history = useHistory();
      const fieldsNotEmpty = useRef(false);
      useEffect(() => {
        const inputFields = ['username','password', 'email'];
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
      
  return (
    <>
       <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
       style={{ height: "14cm",maxHeight: "14cm", overflowY: "auto" }}>
    <div className="rounded-t bg-white mb-0 px-4 py-3">
      <div className="text-center flex">
      <h6 className="text-blueGray-700 text-xl font-bold uppercase">
                Ajouter un utilisateur
              </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
       <form>
       <div className="flex flex-wrap py-4">
              <div className="w-full px-4">
                <div className="relative mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    autoComplete="off"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                </div>
              </div>
              <div className="w-full px-4">
                <div className="relative mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor=" password"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    autoComplete="off"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                </div>
              </div>
              <div className="w-full px-4">
                <div className="relative mb-3">
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
                    autoComplete="off"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                </div>
               </div>
              <div className="w-full px-4">
              <div className="relative mb-3">
           <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="roles"
          >
          Roles
        </label>
          <label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-lightBlue-600 justify-center border rounded-full ml-1 mr-1"
              name="roles"
              value="ADMIN"
              checked={userData.roles.includes('ADMIN')}
              onChange={handleRoleChange}
            />
            Admin
          </label>
          <label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-lightBlue-600 justify-center border rounded-full ml-1 mr-1"
              name="roles"
              value="DOCTEUR"
              checked={userData.roles.includes('DOCTEUR')}
              onChange={handleRoleChange}
            />
            Docteur
          </label>
          <label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-lightBlue-600 justify-center border rounded-full ml-1 mr-1"
              name="roles"
              value="SECRETAIRE"
              checked={userData.roles.includes('SECRETAIRE')}
              onChange={handleRoleChange}
            />
            Secretaire
          </label>
          <label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-lightBlue-600 justify-center rounded-full ml-1 mr-1"
              name="roles"
              value="INFERMIERE"
              checked={userData.roles.includes('INFERMIERE')}
              onChange={handleRoleChange}
            />
            Infermière
          </label>
        </div>
      </div>
            </div>
            <div className="flex justify-center">
            <button
             className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-4/12 ease-linear transition-all duration-150"
             type="submit"
              onClick={handleSubmit}
            >Ajouter
                </button>
                </div>
                {showAlert && (
        <div className="mt-10">
        {alertType === "error" ? <i className="fa fa-times-circle mr-2"></i> : <i className="fa fa-check-circle mr-2"></i>}
        {alertMessage}
      </div>
      )}
          </form>
        </div>
      </div>
    </>
  );
}