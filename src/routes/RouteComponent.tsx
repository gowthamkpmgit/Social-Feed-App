import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import SigninPage from "../auth/sign-in/SigninPage";
import SignupPage from "../auth/sign-up/SignupPage";
import FeedsPage from "../pages/FeedsPage";
import { useSelector } from "react-redux";
import type { RootState } from "../auth/redux/store";

const RouteComponent = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/sign-in" element={<SigninPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/feed" element={<FeedsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;
