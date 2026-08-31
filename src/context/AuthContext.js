import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const authenticatedEmail = localStorage.getItem(
      "authenticatedUserEmail"
    );

    if (authenticatedEmail) {
      setEmail(authenticatedEmail);
    }

    setAuthLoading(false);
  }, []);

  const setAuthenticatedEmail = (userEmail) => {
    setEmail(userEmail);
    localStorage.setItem("authenticatedUserEmail", userEmail);
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setAuthenticatedEmail,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
