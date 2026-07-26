const SESSION_STORAGE_KEY = process.env.REACT_APP_SESSION_STORAGE_KEY || "userSession";

export const saveUserSession = (sessionData = {}) => {
  const sessionPayload = {
    loginTimeStamp: new Date().toISOString(),
    ...sessionData,
  };

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));

  return sessionPayload;
};
