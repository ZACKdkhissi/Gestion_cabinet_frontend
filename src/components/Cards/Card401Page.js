import React from 'react';

function UnauthorizedPage() {
    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-1/2">
            <h1 className="text-4xl font-semibold text-red-500">Erreur 401</h1>
            <p className="text-xl text-gray-600 mt-4">Vous n'avez pas l'accès à cette page!</p>
            <p className="text-center mt-10">
            <a href="/" className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:w-full">
                Revenir à la page d'accueil 
            </a>
            </p>
          </div>
        </div>
        </>
      );
    }

export default UnauthorizedPage;
