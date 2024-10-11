import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const axiosPrivate = axios.create({
    baseURL: "https://animal-resuce-backend-production.up.railway.app",
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosPrivate.interceptors.request.use(
    (config) => {
      if (auth?.accessToken) {
        config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosPrivate.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;

      if (status === 403) {
        setAuth(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/users/login", { replace: true, state: { from: location } });
      }

      return Promise.reject(error);
    }
  );

  return axiosPrivate;
};

export default useAxiosPrivate;
