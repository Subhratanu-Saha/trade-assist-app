const SESSION_STORAGE_KEY = process.env.REACT_APP_SESSION_STORAGE_KEY || "userSession";

export const saveUserSession = (sessionData = {}) => {
  const { email } = sessionData;
  const sessionPayload = {
    email,
    loginTimeStamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined" && window.sessionStorage) {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
  }

  return sessionPayload;
};
