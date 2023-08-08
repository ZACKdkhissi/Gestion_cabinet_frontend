import React, { useContext } from "react";
import { createPopper } from "@popperjs/core";
import { AuthContext } from "contexts/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const UserDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const history = useHistory();

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    
    history.push('/auth/login');
  };

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#maximoss"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <i className="fas fa-user align-middle border-none shadow-lg" style={{fontSize: '32px' }}></i>
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          href="#maximoss"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={handleLogout}
        >
          Se déconnecter
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
