import { useEffect, useState, useContext } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";

const useUserInfo = () => {
  const { token } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const apiInstance = createApiInstance(token);



  useEffect(() => {
    apiInstance
      .get("/api/v1/auth/userinfo")
      .then((response) => {
        if (response.data.userName && Array.isArray(response.data.roles)) {
          // Format the response into an array of a single object
          const formattedData = [
            {
              username: response.data.userName,
              roles: response.data.roles,
            },
          ];
          setUserInfo(formattedData);
        } else {
          console.error("Invalid response format: ", response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return userInfo;


  
};

export default useUserInfo;
