import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const SESSION_STORAGE_KEY = "tradeAssistUserSession";

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    try {
      const storedSession =
        window.sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);

        if (
          parsedSession &&
          typeof parsedSession.email === "string" &&
          parsedSession.email.trim() !== ""
        ) {
          setEmail(parsedSession.email);
        }
      }
    } catch (error) {
      setEmail(null);
    }
    finally {
      setAuthLoading(false);
    }
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