import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Dashboard from "views/admin/Dashboard.js";
import { AuthProvider } from "contexts/AuthContext";
import GestionPatients from "views/admin/GestionPatients";
import GestionMedicaments from "views/admin/GestionMedicaments";
import ConsulterRdv from "views/admin/ConsulterRdv";
import GestionUtilisateurs from "views/admin/GestionUtilisateurs";
import GestionParametrage from "views/admin/GestionParametrage";

export default function Admin() {
  const location = useLocation();
  const hideSidebar = location.pathname.includes("/admin/consulter_rdv_");

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <div className={`relative ${hideSidebar ? "" : "md:ml-64"}`}>
        <div className="relative bg-lightBlue-600 md:pt-32 pb-16 pt-12" />
        <AdminNavbar />
        <AuthProvider>
          <div className="px-4 md:px-10 mx-auto w-full -m-24">
            <Switch>
              <Route path="/admin/dashboard" exact component={Dashboard} />
              <Route path="/admin/gestion_medicaments" exact component={GestionMedicaments} />
              <Route path="/admin/gestion_utilisateurs" exact component={GestionUtilisateurs} />
              <Route path="/admin/gestion_patients" exact component={GestionPatients} />
              <Route path="/admin/consulter_rdv_:nom_:prenom" component={ConsulterRdv} />
              <Route path="/admin/gestion_parametrage" exact component={GestionParametrage} />
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </div>
        </AuthProvider>
      </div>
    </>
  );
}
