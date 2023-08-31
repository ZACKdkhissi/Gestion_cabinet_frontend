import CardAddMedicaments from "components/Cards/CardAddMedicaments";
import CardMedicaments from "components/Cards/CardMedicaments";
import { AuthContext } from "contexts/AuthContext";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";



export default function GestionMedicaments() {
    const { token } = useContext(AuthContext);
    const [isAddMedicamentOpen, setIsAddMedicamentOpen] = useState(false);
  
  const handleOpenAddMedicament = () => {
    setIsAddMedicamentOpen(true);
  };

  const handleCloseAddMedicament = () => {
    setIsAddMedicamentOpen(false);
  };

  const handleAddMedicamentSuccess = () => {
    setIsAddMedicamentOpen(false);
  };

  if (!token) {
    return <Redirect to="/auth/login" />;
  }
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full lg:w-2/12 px-4">
        {!isAddMedicamentOpen ? (
          <CardMedicaments  
            onOpenAddMedicament={handleOpenAddMedicament}
          />
          ) : (
           <CardAddMedicaments 
            onClose={handleCloseAddMedicament}
            onAddSuccess={handleAddMedicamentSuccess}
           /> 
        )}
          </div>
        </div>
  </>
  );
}