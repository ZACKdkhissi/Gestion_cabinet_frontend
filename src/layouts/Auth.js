import React from "react";
import {Route, Redirect } from "react-router-dom";
import Navbar from "components/Navbars/AuthNavbar.js";
import Login from "views/auth/Login.js";

export default function Auth() {
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
          ></div>
            <Route path="/auth/login" exact component={Login} />
            <Redirect from="/auth" to="/auth/login" />
        </section>
      </main>
    </>
  );
}
