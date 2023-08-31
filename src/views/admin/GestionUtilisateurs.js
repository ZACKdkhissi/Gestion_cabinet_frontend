import React, { useContext, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import CardAfficherUser from "components/Cards/CardAfficherUser";
import CardRegister from "components/Cards/CardRegister";

export default function GestionUtilisateurs() {
    const { token } = useContext(AuthContext);
    const [onAddSuccess, setOnAddSuccess] = useState(false); // Initialize as a function

    const handleAddUtilisateurSuccess = () => {
      setOnAddSuccess(!onAddSuccess);
    };

    if (!token) {
        return <Redirect to="/auth/login" />;
    }

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full xl:w-6/12 px-2">
                    <CardAfficherUser 
                        onAddSuccess={handleAddUtilisateurSuccess}
                    />
                </div>
                <div className="w-full xl:w-6/12 px-2">
                    <CardRegister 
                        onAddSuccess={handleAddUtilisateurSuccess}
                    /> 
                </div>
            </div>
        </>
    );
}
