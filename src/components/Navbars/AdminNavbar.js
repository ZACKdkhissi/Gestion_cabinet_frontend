import React, { useState, useEffect } from "react";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import useUserInfo from "api/useUserInfo";

export default function Navbar() {
  const userInfo = useUserInfo();
  const user =
    userInfo.length > 0 && userInfo[0].username ? userInfo[0].username : "";

  const [isPageCollapsed, setPageCollapsed] = useState(false);

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
          {!isPageCollapsed && (
            <span className="text-white font-semibold ml-2">Bonjour, {user}</span>
          )}
          <ul className={`flex-col md:flex-row list-none items-center hidden md:flex`}>
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
}
