import React, { useContext, useState } from "react";
import CardAddPatient from "components/Cards/CardAddPatient";
import CardRdvTraffic from "components/Cards/CardRdvTraffic";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom";
import CardCalendar from "components/Cards/CardCalendar";
import CardEvents from "components/Cards/CardEvents";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [addedPatient, setAddedPatient] = useState(null);

  const handleUpdate = () => {
    setShouldFetch(!shouldFetch);
  };

  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  const handleAddPatientClick = () => {
    setShowAddPatient(true);
  };

  const handleAddPatientSuccess = (patient) => {
    setAddedPatient(patient);
    setShowAddPatient(false);
  };

  return (
    <div>
      {showAddPatient ? (
        <CardAddPatient
          onClose={() => setShowAddPatient(false)}
          onAddSuccess={handleAddPatientSuccess}
        />
      ) : (
        <div className="flex flex-wrap">
          <div className="w-full xl:w-6/12 px-2">
            <div>
              <CardCalendar
                onUpdate={handleUpdate}
                onAddPatientClick={handleAddPatientClick}
                addedPatient={addedPatient}
              />
            </div>
            <div>
              <CardEvents/>
            </div>
          </div>
          <div className="w-full xl:w-6/12">
            <CardRdvTraffic shouldFetch={shouldFetch} />
          </div>
        </div>
      )}
    </div>
  );
}
