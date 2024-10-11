/* eslint-disable react/prop-types */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { CircularProgress } from "@mui/material";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) return <CircularProgress />;

  return auth && auth.accessToken && allowedRoles?.includes(auth.user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/users/login" state={{ from: location }} replace />
  );
};
export default RequireAuth;
