import { useEffect, useState, useContext } from "react";
import { AuthContext } from "contexts/AuthContext";
import createApiInstance from "api/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const useUserInfo = () => {
  const { token } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const apiInstance = createApiInstance(token);
  const history = useHistory();
  useEffect(() => {
    apiInstance
      .get("/api/v1/auth/userinfo")
      .then((response) => {
        if (response.data.userName && Array.isArray(response.data.roles)) {
          const formattedData = [
            {
              username: response.data.userName,
              roles: response.data.roles,
            },
          ];
          setUserInfo(formattedData);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          history.push('/401');
        }
      });
      //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return userInfo;
};

export default useUserInfo;
