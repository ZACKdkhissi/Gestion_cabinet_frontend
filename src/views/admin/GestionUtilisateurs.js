import React, { useContext, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import CardUtilisateurs from "components/Cards/CardUtilisateurs";
import CardAddUtilisateur from "components/Cards/CardAddUtilisateur";

export default function GestionUtilisateurs() {
    const { token } = useContext(AuthContext);
    const [onAddSuccess, setOnAddSuccess] = useState(false);

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
                    <CardUtilisateurs 
                        onAddSuccess={handleAddUtilisateurSuccess}
                    />
                </div>
                <div className="w-full xl:w-6/12 px-2">
                    <CardAddUtilisateur 
                        onAddSuccess={handleAddUtilisateurSuccess}
                    /> 
                </div>
            </div>
        </>
    );
}
