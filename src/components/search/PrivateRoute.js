import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { email , authLoading } = useAuth();
  if (authLoading) {
  return null;
}
  const SESSION_STORAGE_KEY = "tradeAssistUserSession";
  const MAX_SESSION_AGE_MS = 6 * 60 * 60 * 1000;

  let isAuthenticated = false;

  try {
    const storedSession =
      window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      if (
        parsedSession &&
        typeof parsedSession === "object" &&
        !Array.isArray(parsedSession) &&
        typeof parsedSession.email === "string" &&
        parsedSession.email.trim() !== "" &&
        typeof parsedSession.loginTimeStamp === "string" &&
        parsedSession.loginTimeStamp.trim() !== ""
      ) {
        const loginTimeStamp = Date.parse(
          parsedSession.loginTimeStamp
        );

        if (!Number.isNaN(loginTimeStamp)) {
          const timeDifference = Date.now() - loginTimeStamp;
          const emailMatches =
            email === parsedSession.email;
          isAuthenticated =
            emailMatches &&
            timeDifference >= 0 &&
            timeDifference <= MAX_SESSION_AGE_MS;
        }
      }
    }
  } catch (error) {
    isAuthenticated = false;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;