// api.js

import axios from "axios";

const createApiInstance = (token) => {
  const apiInstance = axios.create({
    baseURL: "http://localhost:8080/",
  });

  apiInstance.interceptors.request.use(
    (config) => {
      // Add the token to the request headers
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default createApiInstance;
