import { useContext, useState } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

async function getUserInfo(token) {
  const apiInstance = createApiInstance(token);

  try {
    const response = await apiInstance.get("/api/v1/auth/userinfo");
    if (response.data.userName && Array.isArray(response.data.roles)) {
      const formattedData = [
        {
          username: response.data.userName,
          roles: response.data.roles,
        },
      ];
      return formattedData;
    } else {
      console.error("Invalid response format: ", response.data);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function Login() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const checkRoles = async (token) => {
    const userInfo = await getUserInfo(token);

    if (userInfo) {
      const isAdmin = userInfo.some(
        (user) =>
          user.roles &&
          user.roles.filter((value) => value.roleCode === "ADMIN").length > 0
      );

      if (isAdmin) {
        history.push("/admin/AfficherUtilisateur");
      } else {
        history.push("/admin/dashboard");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        checkRoles(token);
      } else {
        setErrorMessage("Username ou Mot de passe incorrect(s) !");
      }
    } catch (error) {
      setErrorMessage("Erreur Technique !");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Se connecter avec
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="username">Username:</label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 mt-1 mb-1"
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Mot de passe:</label>
                    <input
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 mt-1"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-1">
                    {errorMessage && (
                      <p className="text-red-500">{errorMessage}</p>
                    )}
                  </div>
                  <br></br>
                  <div>
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
