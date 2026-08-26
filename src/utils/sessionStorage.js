const SESSION_STORAGE_KEY =
  process.env.REACT_APP_SESSION_STORAGE_KEY || "userSession";

const MAX_SESSION_AGE_MS = 6 * 60 * 60 * 1000;

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
    storage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(sessionPayload)
    );
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

export const isUserAuthenticated = (loggedInEmail) => {
  // 1. Read session storage
  const session = getUserSession();

  // 2. Session must exist
  if (!session) {
    return false;
  }

  // 3. Required values must exist
  if (!session.email || !session.loginTimeStamp) {
    return false;
  }

  const emailToValidate = loggedInEmail || session.email;

  // 4. Logged-in email must match session-storage email
  const isEmailMatched =
    emailToValidate.toLowerCase() === session.email.toLowerCase();

  if (!isEmailMatched) {
    return false;
  }

  // 5. Read and validate login timestamp
  const loginTime = new Date(session.loginTimeStamp).getTime();

  if (Number.isNaN(loginTime)) {
    return false;
  }

  // 6. Check current timestamp against login timestamp
  const timeDifference = Date.now() - loginTime;

  // 7. Session must be valid and <= 6 hours old
  const isSessionValid =
    timeDifference >= 0 &&
    timeDifference <= MAX_SESSION_AGE_MS;

  if (!isSessionValid) {
    return false;
  }

  // 8. All conditions passed
  return Boolean(session.email);
};

export const clearUserSession = () => {
  const storage = getSessionStorage();

  if (storage) {
    storage.removeItem(SESSION_STORAGE_KEY);
  }
};