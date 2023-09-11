import React from "react";
import IndexDropdown from "components/Dropdowns/IndexDropdown.js";

export default function Navbar() {
  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
              <li className="flex items-center">
                <IndexDropdown />
              </li>
        </div>
      </nav>
    </>
  );
}
