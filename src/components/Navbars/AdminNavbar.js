import React, { useState, useEffect } from "react";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import useUserInfo from "api/useUserInfo";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function Navbar() {
  const userInfo = useUserInfo();
  const user =
    userInfo.length > 0 && userInfo[0].username ? userInfo[0].username : "";

  const [isPageCollapsed, setPageCollapsed] = useState(false);
  const location = useLocation();

  const updatePageCollapsed = () => {
    setPageCollapsed(window.innerWidth <= 767);
  };

  useEffect(() => {
    window.addEventListener("resize", updatePageCollapsed);
    updatePageCollapsed();
    return () => {
      window.removeEventListener("resize", updatePageCollapsed);
    };
  }, []);

  const handleLinkClick = (event) => {
    if (
      !window.confirm(
        "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?"
      )
    ) {
      event.preventDefault()
    }
  };

  return (
    <>
      <nav className={`absolute top-0 right-0 w-full z-10 bg-transparent ${isPageCollapsed ? 'flex-col' : 'md:flex-row md:flex-nowrap md:justify-start'} flex items-center p-4`}>
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {!isPageCollapsed && (
            <button
              className="bg-white text-lightBlue-500 active:white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                window.location.reload();
              }}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          )}
          {!isPageCollapsed && location.pathname === "/admin/dashboard" && (
            <span className="text-white font-semibold ml-2">Bonjour, {user}</span>
          )}
          {!isPageCollapsed && location.pathname.includes("/admin/consulter_rdv_") && (
            <Link
            className="bg-white text-lightBlue-600 active:bg-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              to={"/admin/dashboard"}
              onClick={handleLinkClick}
            >
              <i className="fa fa-arrow-left text-xs mr-1">
              </i>
              Revenir au tableau de bord
            </Link>
          )}
          <ul className={`flex-col md:flex-row list-none items-center hidden md:flex`}>
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
}
