
import {
  saveUserSession,
  getUserSession,
  isUserAuthenticated,
  clearUserSession,
} from "./sessionStorage";

const SESSION_STORAGE_KEY =
  process.env.REACT_APP_SESSION_STORAGE_KEY || "userSession";

const MAX_SESSION_AGE_MS = 6 * 60 * 60 * 1000;

const setStoredSession = (session) => {
  sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session)
  );
};

const createSession = (overrides = {}) => ({
  email: "agent@example.com",
  loginTimeStamp: new Date().toISOString(),
  ...overrides,
});

const withStorageEnvironment = (windowValue, storageValue, callback) => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(
    global,
    "window"
  );
  const storageDescriptor = Object.getOwnPropertyDescriptor(
    global,
    "sessionStorage"
  );

  try {
    Object.defineProperty(global, "window", {
      configurable: true,
      value: windowValue,
    });

    if (storageValue === undefined) {
      delete global.sessionStorage;
    } else {
      Object.defineProperty(global, "sessionStorage", {
        configurable: true,
        value: storageValue,
      });
    }

    callback();
  } finally {
    if (windowDescriptor) {
      Object.defineProperty(global, "window", windowDescriptor);
    } else {
      delete global.window;
    }

    if (storageDescriptor) {
      Object.defineProperty(
        global,
        "sessionStorage",
        storageDescriptor
      );
    } else {
      delete global.sessionStorage;
    }
  }
};

describe("sessionStorage utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  describe("saveUserSession", () => {
    test("stores email and timestamp", () => {
      const saved = saveUserSession({
        email: "agent@example.com",
      });

      expect(saved).toEqual(
        expect.objectContaining({
          email: "agent@example.com",
          loginTimeStamp: expect.any(String),
        })
      );

      expect(
        JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY))
      ).toEqual(saved);
    });

    test("preserves additional fields", () => {
      const saved = saveUserSession({
        email: "agent@example.com",
        accessToken: "abc123",
      });

      expect(saved.accessToken).toBe("abc123");
    });

    test("handles default empty session data", () => {
      const saved = saveUserSession();

      expect(saved.email).toBeUndefined();
      expect(saved.loginTimeStamp).toEqual(expect.any(String));
    });
  });

  describe("getUserSession", () => {
    test("returns saved session", () => {
      const saved = saveUserSession({
        email: "agent@example.com",
      });

      expect(getUserSession()).toEqual(saved);
    });

    test("returns null when session does not exist", () => {
      expect(getUserSession()).toBeNull();
    });

    test("returns null for invalid JSON", () => {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        "{invalid-json"
      );

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(getUserSession()).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("isUserAuthenticated", () => {
    test("returns true for a valid session", () => {
      setStoredSession(createSession());

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(true);
    });

    test("matches email without case sensitivity", () => {
      setStoredSession(createSession());

      expect(
        isUserAuthenticated("AGENT@EXAMPLE.COM")
      ).toBe(true);
    });

    test("returns false when no session exists", () => {
      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });

    test("returns false when logged-in email is missing", () => {
      setStoredSession(createSession());

      expect(isUserAuthenticated()).toBe(false);
    });

    test("returns false when session email is missing", () => {
      setStoredSession(
        createSession({ email: undefined })
      );

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });

    test("returns false when timestamp is missing", () => {
      setStoredSession(
        createSession({ loginTimeStamp: undefined })
      );

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });

    test("returns false for different emails", () => {
      setStoredSession(createSession());

      expect(
        isUserAuthenticated("other@example.com")
      ).toBe(false);
    });

    test("returns false for invalid timestamp", () => {
      setStoredSession(
        createSession({ loginTimeStamp: "invalid-date" })
      );

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });

    test("returns false for expired session", () => {
      setStoredSession(
        createSession({
          loginTimeStamp: new Date(
            Date.now() - MAX_SESSION_AGE_MS - 60000
          ).toISOString(),
        })
      );

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });

    test("returns false for future timestamp", () => {
      setStoredSession(
        createSession({
          loginTimeStamp: new Date(
            Date.now() + 60000
          ).toISOString(),
        })
      );

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });

    test("returns true at the six-hour boundary", () => {
      const now = Date.now();

      jest.spyOn(Date, "now").mockReturnValue(now);

      setStoredSession(
        createSession({
          loginTimeStamp: new Date(
            now - MAX_SESSION_AGE_MS
          ).toISOString(),
        })
      );

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(true);
    });
  });

   describe("clearUserSession", () => {
    test("removes saved session", () => {
      saveUserSession({
        email: "agent@example.com",
      });

      clearUserSession();

      expect(getUserSession()).toBeNull();

      expect(
        isUserAuthenticated("agent@example.com")
      ).toBe(false);
    });
  });

  describe("storage availability", () => {
    test("uses fallback sessionStorage", () => {
      const fallbackStorage = {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };

      withStorageEnvironment(
        {},
        fallbackStorage,
        () => {
          saveUserSession({
            email: "agent@example.com",
          });

          expect(fallbackStorage.setItem).toHaveBeenCalled();
          expect(getUserSession()).toBeNull();

          clearUserSession();

          expect(
            fallbackStorage.removeItem
          ).toHaveBeenCalledWith(SESSION_STORAGE_KEY);
        }
      );
    });

    test("uses fallback when window is undefined", () => {
      const fallbackStorage = {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };

      withStorageEnvironment(
        undefined,
        fallbackStorage,
        () => {
          saveUserSession({
            email: "agent@example.com",
          });

          expect(fallbackStorage.setItem).toHaveBeenCalled();
        }
      );
    });

    test("handles completely unavailable storage", () => {
      withStorageEnvironment(
        undefined,
        undefined,
        () => {
          const saved = saveUserSession({
            email: "agent@example.com",
          });

          expect(saved.email).toBe("agent@example.com");
          expect(getUserSession()).toBeNull();

          expect(
            isUserAuthenticated("agent@example.com")
          ).toBe(false);

          expect(() => {
            clearUserSession();
          }).not.toThrow();
        }
      );
    });
   });
});
