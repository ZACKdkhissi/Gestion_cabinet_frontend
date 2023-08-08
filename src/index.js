import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import Landing from "views/Landing.js";
import Index from "views/Index.js";
import { AuthProvider } from "contexts/AuthContext";

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/auth" component={Auth} />
        <Route path="/landing" exact component={Landing} />
        <Route path="/" exact component={Index} />
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  </AuthProvider>
  ,
  document.getElementById("root")
);
