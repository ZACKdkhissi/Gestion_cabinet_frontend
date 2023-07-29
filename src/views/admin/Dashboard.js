import React, { useContext, useEffect, useState } from "react";
import "./f1.css"

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { fetchUserData } from "api/api";
import CardCalendar from "components/Cards/CardCalendar";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  
  if (!token) {
    return <Redirect to="/auth/login" />;
  }



  return (
    <div>
      <div className="flex flex-wrap mt-3">
        <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
          <div className="T5">
          <CardCalendar />
          </div>
        </div>
        <div className="w-full xl:w-6/12 px-4">
          <CardSocialTraffic />
        </div>
      </div>
    </div>
  );
}
