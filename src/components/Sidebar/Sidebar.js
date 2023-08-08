import React, { useContext } from "react";
import { Link } from "react-router-dom";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { AuthContext } from "contexts/AuthContext";
import { useHistory } from "react-router-dom";
import useUserInfo from "api/useUserInfo";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const history = useHistory();
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const handleLogout = () => {
    logout();
    history.push('/auth/login');
  };

  const userInfo = useUserInfo();

  const isSecretaire = userInfo.some(
    (user) =>
      user.roles && user.roles.filter((value) => value.roleCode === "SECRETAIRE").length > 0
  );

  const isDocteur = userInfo.some(
    (user) =>
      user.roles && user.roles.filter((value) => value.roleCode === "DOCTEUR").length > 0
  );
  
  const isAdmin = userInfo.some(
    (user) =>
      user.roles && user.roles.filter((value) => value.roleCode === "ADMIN").length > 0
  );

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          <Link
              className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
              to={isAdmin ? "/admin/AfficherUtilisateur" : "/admin/dashboard"}
            >
              Gestion Cabinet
            </Link>
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    Gestion Cabinet
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            
              <div>
                <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                {(isSecretaire ||isDocteur) && (
                <div>
                <hr className="my-4 md:min-w-full" />
                <li className="items-center">
                  <Link
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf("/admin/dashboard") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to="/admin/dashboard"
                  >
                    <i
                      className={
                        "fas fa-tv mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/dashboard") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Tableau de bord
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (window.location.href.indexOf("/admin/gestionpatients") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                    to="/admin/gestionpatients"
                  >
                    <i
                      className={
                        "fas fa-user-circle mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/gestionpatients") !== -1
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    Gestion Patient
                  </Link>
                </li>
                </div>
                )}
            {isAdmin &&(
              <div><hr className="my-4 md:min-w-full" />
        <li className="items-center">
          <Link
            className={
              "text-xs uppercase py-3 font-bold block " +
              (window.location.href.indexOf("/admin/AfficherUtilisateur") !== -1
                ? "text-lightBlue-500 hover:text-lightBlue-600"
                : "text-blueGray-700 hover:text-blueGray-500")
            }
            to="/admin/AfficherUtilisateur"
          >
            <i
              className={
                "fas fa-tv mr-2 text-sm " +
                (window.location.href.indexOf("/admin/AfficherUtilisateur") !== -1
                  ? "opacity-75"
                  : "text-blueGray-300")
              }
            ></i>{" "}
            Utilisateurs
          </Link>
        </li>
        </div>
        )}
              </ul>
              </div>
          </div>
          <hr className="my-4 md:min-w-full" />
            <button onClick={handleLogout}>
            <i className="fas fa-sign-out-alt mr-2 text-sm"></i>Se déconnecter</button>
        </div>
      </nav>
    </>
  );
}