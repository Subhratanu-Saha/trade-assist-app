import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  
  const isAuthenticated = false; // Replace with your actual authentication logic  
  return isAuthenticated ? children : <Navigate to="/" replace />;
 
};

export default PrivateRoute;