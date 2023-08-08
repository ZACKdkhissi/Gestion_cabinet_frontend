import React, { useContext } from "react";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import CardAfficherUser from "components/Cards/CardAfficherUser";

export default function Users() {
    const { token } = useContext(AuthContext);
  if (!token) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/12 px-4">
          <CardAfficherUser />
        </div>
        
      </div>
    </>
  );
}
