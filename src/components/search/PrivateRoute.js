import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isUserAuthenticated } from "../../utils/sessionStorage";
const PrivateRoute = ({ children }) => {
  const { email, authLoading } = useAuth();
  if (authLoading) {
    return null;
  }

  const isAuthenticated = isUserAuthenticated(email);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;