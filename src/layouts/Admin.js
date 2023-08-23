import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";


import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Dashboard from "views/admin/Dashboard.js";
import { AuthProvider } from "contexts/AuthContext";
import RegisterUser from "views/admin/RegisterUser";
import Users from "views/admin/Users";
import GestionPatients from "views/admin/GestionPatients";
import GestionMedicaments from "views/admin/GestionMedicaments";
import ConsulterRdv from "views/admin/ConsulterRdv";


export default function Admin() {
  return (
    <>

      <Sidebar />
      <div className="relative md:ml-64">
      <div className="relative bg-lightBlue-600 md:pt-32 pb-16 pt-12"/>
        <AdminNavbar />
        <AuthProvider>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/gestionmedicaments" exact component={GestionMedicaments}/>
            <Route path="/admin/registerUser" exact component={RegisterUser} />
            <Route path="/admin/afficherutilisateur" exact component={Users} />
            <Route path="/admin/gestionpatients" exact component={GestionPatients} />
            <Route path="/admin/consulterRdv-:nom-:prenom" component={ConsulterRdv} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
        </AuthProvider>
      </div>
    </>
  );
}
