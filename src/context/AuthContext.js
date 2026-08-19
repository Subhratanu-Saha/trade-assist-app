import { createContext, useContext, useEffect, useState } from "react";
import { getUserSession } from "../utils/sessionStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const session = getUserSession();

    if (session?.email) {
      setEmail(session.email);
    }

    setAuthLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ email, setEmail, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};