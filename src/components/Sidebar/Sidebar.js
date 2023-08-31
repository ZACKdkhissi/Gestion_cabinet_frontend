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

  const isSecretaire = userInfo.some(user => user.roles.some(role => role.roleCode === "SECRETAIRE"));
  const isDocteur = userInfo.some(user => user.roles.some(role => role.roleCode === "DOCTEUR"));
  const isAdmin = userInfo.some(user => user.roles.some(role => role.roleCode === "ADMIN"));


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
            to={isAdmin && !isSecretaire && !isDocteur ? "/admin/gestion_utilisateurs" : "/admin/dashboard"}
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
            <div className="md:min-w-full md:hidden block border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to={isAdmin && !isSecretaire && !isDocteur? "/admin/gestion_utilisateurs" : "/admin/dashboard"}
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
                {(isSecretaire || isDocteur) && (
                  <>
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
                              : "text-black")
                          }
                        ></i>{" "}
                        Tableau de bord
                      </Link>
                    </li>

                    <li className="items-center">
                      <Link
                        className={
                          "text-xs uppercase py-3 font-bold block " +
                          (window.location.href.indexOf("/admin/gestion_patients") !== -1
                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                            : "text-blueGray-700 hover:text-blueGray-500")
                        }
                        to="/admin/gestion_patients"
                      >
                        <i
                          className={
                            "fas fa-user-circle mr-2 text-sm " +
                            (window.location.href.indexOf("/admin/gestion_patients") !== -1
                              ? "opacity-75"
                              : "text-black")
                          }
                        ></i>{" "}
                        Patients
                      </Link>
                    </li>
                  </>
                )}

                {isAdmin && (
                  <>
                    <hr className="my-4 md:min-w-full" />
                    <li className="items-center">
                      <Link
                        className={
                          "text-xs uppercase py-3 font-bold block " +
                          (window.location.href.indexOf("/admin/gestion_utilisateurs") !== -1
                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                            : "text-blueGray-700 hover:text-blueGray-500")
                        }
                        to="/admin/gestion_utilisateurs"
                      >
                        <i
                          className={
                            "fas fa-user mr-2 text-sm " +
                            (window.location.href.indexOf("/admin/gestion_utilisateurs") !== -1
                              ? "opacity-75"
                              : "text-black")
                          }
                        ></i>{" "}
                        Utilisateurs
                      </Link>
                    </li>
                    <li className="items-center">
                      <Link
                        className={
                          "text-xs uppercase py-3 font-bold block " +
                          (window.location.href.indexOf("/admin/gestion_medicaments") !== -1
                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                            : "text-blueGray-700 hover:text-blueGray-500")
                        }
                        to="/admin/gestion_medicaments"
                      >
                        <i
                          className={
                            "fas fa-pills mr-2 text-sm " +
                            (window.location.href.indexOf("/admin/gestion_medicaments") !== -1
                              ? "opacity-75"
                              : "text-black")
                          }
                        ></i>{" "}
                        Medicaments
                      </Link>
                    </li>
                    <li className="items-center">
                      <Link
                        className={
                          "text-xs uppercase py-3 font-bold block " +
                          (window.location.href.indexOf("/admin/parametrageTemps") !== -1
                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                            : "text-blueGray-700 hover:text-blueGray-500")
                        }
                        to="/admin/parametrageTemps"
                      >
                        <i
                          className={
                            "fas fa-pills mr-2 text-sm " +
                            (window.location.href.indexOf("/admin/parametrageTemps") !== -1
                              ? "opacity-75"
                              : "text-black")
                          }
                        ></i>{" "}
                        Parametrage
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div style={{ marginTop: "auto" }}>
              <hr className="my-4 md:min-w-full" />
              <button onClick={handleLogout} className="text-xs uppercase py-3 font-bold block text-red-600 hover:text-red-700">
                <i className="fas fa-sign-out-alt mr-2 text-sm"></i>Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
