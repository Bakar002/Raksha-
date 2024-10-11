import { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setAuth({ accessToken: token, user });
    }

    setLoading(false);
  }, [setAuth]);

  return { auth, setAuth, loading };
};

export default useAuth;
