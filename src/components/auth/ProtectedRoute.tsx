import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "../../redux/api/authStorage";

export default function ProtectedRoute() {
  const location = useLocation();

  if (!getAccessToken()) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
