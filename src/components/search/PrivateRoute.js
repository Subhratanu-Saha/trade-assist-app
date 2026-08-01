import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Temporary authentication check
  const isAuthenticated = false;
//  console.log("PrivateRoute Executed");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;