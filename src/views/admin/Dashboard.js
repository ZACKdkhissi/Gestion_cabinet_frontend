import React, { useContext, useState} from "react";
import "./f1.css"

// components

import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import CardCalendar from "components/Cards/CardCalendar";
import CardEvents from "components/Cards/CardEvents";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [shouldFetchSocialTraffic, setShouldFetchSocialTraffic] = useState(false);

  const handleSocialTrafficUpdate = () => {
    setShouldFetchSocialTraffic(!shouldFetchSocialTraffic);
  };
  
  if (!token) {
    return <Redirect to="/auth/login" />;
  }


  return (
    <div>
      <div className="flex flex-wrap mt-3">
        <div className="w-full xl:w-6/12 mb-12 px-2">
          <div>
          <CardCalendar onSocialTrafficUpdate={handleSocialTrafficUpdate} />
          </div>
          <div>
          <CardEvents />
          </div>
        </div>
        
        <div className="w-full xl:w-6/12">
          <CardSocialTraffic shouldFetch={shouldFetchSocialTraffic} />
        </div>
      </div>
    </div>
  );
}
