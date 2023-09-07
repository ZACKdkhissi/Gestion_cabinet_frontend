import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";

export default function CardUtilisateurs({onAddSuccess}) {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const apiInstance = createApiInstance(token);

    useEffect(() => {
       
            apiInstance.get("/api/v1/users")
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
            });
        
            //eslint-disable-next-line
      }, [onAddSuccess]);

      const handleDelete = (userId) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
        if(confirmDelete){
        apiInstance.delete(`/api/v1/users/${userId}`)
          .then((response) => {
            setUsers(users.filter((user) => user.id !== userId));
          })
          .catch((error) => {
          });}
      };

      const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUtilisateurs = users.filter((user) =>
  user.username.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <>
       <div  style={{ height: "14cm",maxHeight: "14cm", overflowY: "auto" }}
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 text-center" >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold lg:w-1/12 uppercase">Liste des Utilisateurs</h3>
            <div className="flex items-center ">
                <div className="relative flex items-center">
  <span className="z-2 h-full leading-snug font-normal absolute text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-3">
    <i className="fas fa-search"></i>
              </span>
                <input
                  type="text"
                  placeholder="Chercher ici"
                  value={searchTerm}
                  onChange={handleSearchChange}

                  className="border-0 px-2 py-3 pl-10 pr-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full"
                />
              </div>   
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Username
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Email
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                </th>
              </tr>
            </thead>
            <tbody>
            {filteredUtilisateurs.map((user) => (
              <tr key={user.id}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {user.username}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left min-w-140-px">
                    {user.email}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center min-w-140-px">
                    <i onClick={() => handleDelete(user.id)} className="fas fa-trash-alt mr-3 text-lg text-red-500 "></i>
                </td>
              </tr>))}
            </tbody>
          </table>
          </div>
    </div>
    </>
  );
}
