import { Outlet, Navigate } from "react-router-dom";

const PublicRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
