import { Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../../utils/sessionStorage";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = isUserAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;