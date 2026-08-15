const SESSION_STORAGE_KEY = process.env.REACT_APP_SESSION_STORAGE_KEY || "userSession";

const getSessionStorage = () => {
  if (typeof window !== "undefined" && window.sessionStorage) {
    return window.sessionStorage;
  }

  if (typeof sessionStorage !== "undefined") {
    return sessionStorage;
  }

  return null;
};

export const saveUserSession = (sessionData = {}) => {
  const { email, ...rest } = sessionData;
  const sessionPayload = {
    email,
    loginTimeStamp: new Date().toISOString(),
    ...rest,
  };

  const storage = getSessionStorage();

  if (storage) {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
  }

  return sessionPayload;
};

export const getUserSession = () => {
  const storage = getSessionStorage();

  if (!storage) return null;

  const rawSession = storage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch (error) {
    console.error("Failed to parse user session", error);
    return null;
  }
};

export const isUserAuthenticated = () => {
  const session = getUserSession();
  return Boolean(session?.email);
};

export const clearUserSession = () => {
  const storage = getSessionStorage();

  if (storage) {
    storage.removeItem(SESSION_STORAGE_KEY);
  }
};
