import React, { useContext, useEffect, useState } from "react";

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { fetchUserData } from "api/api";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  

  // Check if the user is authenticated (has a valid token)
  if (!token) {
    // Redirect to the login page if not authenticated
    return <Redirect to="/auth/login" />;
  }



  return (
    <div>

    </div>
  );
}
