import {
  saveUserSession,
  getUserSession,
  isUserAuthenticated,
  clearUserSession,
} from "./sessionStorage";

// Helper to temporarily control browser storage availability
const withStorageEnvironment = (windowValue, storageValue, callback) => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "window"
  );

  const storageDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage"
  );

  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: windowValue,
    });

    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      writable: true,
      value: storageValue,
    });

    callback();
  } finally {
    if (windowDescriptor) {
      Object.defineProperty(globalThis, "window", windowDescriptor);
    } else {
      delete globalThis.window;
    }

    if (storageDescriptor) {
      Object.defineProperty(
        globalThis,
        "sessionStorage",
        storageDescriptor
      );
    } else {
      delete globalThis.sessionStorage;
    }
  }
};

describe("Session Storage Tests", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Save user session
  it("stores email and login timestamp", () => {
    const email = "agent@example.com";

    const savedSession = saveUserSession({ email });

    expect(savedSession).toEqual(
      expect.objectContaining({
        email,
        loginTimeStamp: expect.any(String),
      })
    );

    expect(
      JSON.parse(sessionStorage.getItem("userSession"))
    ).toEqual(savedSession);
  });

  // 2. Preserve additional fields
  it("preserves additional session fields", () => {
    const savedSession = saveUserSession({
      email: "agent@example.com",
      accessToken: "abc123",
    });

    expect(savedSession).toEqual(
      expect.objectContaining({
        email: "agent@example.com",
        accessToken: "abc123",
        loginTimeStamp: expect.any(String),
      })
    );
  });

  // 3. Default session data
  it("saves an empty session when no data is provided", () => {
    const result = saveUserSession();

    expect(result.email).toBeUndefined();
    expect(result.loginTimeStamp).toEqual(expect.any(String));
  });

  // 4. Read and authenticate session
  it("reads the saved session and authenticates the user", () => {
    saveUserSession({ email: "agent@example.com" });

    expect(getUserSession()).toEqual(
      expect.objectContaining({
        email: "agent@example.com",
      })
    );

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(true);

    clearUserSession();

    expect(getUserSession()).toBeNull();

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 5. Incorrect email
  it("returns false for an incorrect email", () => {
    saveUserSession({ email: "agent@example.com" });

    expect(
      isUserAuthenticated("wrong@example.com")
    ).toBe(false);
  });

  // 6. Case-insensitive email matching
  it("authenticates when email matches ignoring case", () => {
    saveUserSession({ email: "Agent@Example.com" });

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(true);
  });

  // 7. Missing session
  it("returns false when no session exists", () => {
    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 8. Missing logged-in email
  it("returns false when logged-in email is missing", () => {
    saveUserSession({ email: "agent@example.com" });

    expect(isUserAuthenticated()).toBe(false);
  });

  // 9. Missing session email
  it("returns false when session email is missing", () => {
    sessionStorage.setItem(
      "userSession",
      JSON.stringify({
        loginTimeStamp: new Date().toISOString(),
      })
    );

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 10. Missing login timestamp
  it("returns false when login timestamp is missing", () => {
    sessionStorage.setItem(
      "userSession",
      JSON.stringify({
        email: "agent@example.com",
      })
    );

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 11. Invalid timestamp
  it("returns false for an invalid timestamp", () => {
    sessionStorage.setItem(
      "userSession",
      JSON.stringify({
        email: "agent@example.com",
        loginTimeStamp: "invalid-date",
      })
    );

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 12. Expired session
  it("returns false for an expired session", () => {
    const expiredTime = new Date(
      Date.now() - 7 * 60 * 60 * 1000
    ).toISOString();

    sessionStorage.setItem(
      "userSession",
      JSON.stringify({
        email: "agent@example.com",
        loginTimeStamp: expiredTime,
      })
    );

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 13. Future timestamp
  it("returns false for a future login timestamp", () => {
    const futureTime = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();

    sessionStorage.setItem(
      "userSession",
      JSON.stringify({
        email: "agent@example.com",
        loginTimeStamp: futureTime,
      })
    );

    expect(
      isUserAuthenticated("agent@example.com")
    ).toBe(false);
  });

  // 14. Invalid JSON
  it("returns null for invalid JSON", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    sessionStorage.setItem("userSession", "invalid-json");

    expect(getUserSession()).toBeNull();

    expect(consoleSpy).toHaveBeenCalled();

  });

  // 15. Missing raw session
  it("returns null when storage has no saved session", () => {
    expect(getUserSession()).toBeNull();
  });

  // 16. Fallback storage when window has no sessionStorage
  it("uses fallback sessionStorage when window storage is unavailable", () => {
    const mockStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(() => null),
      removeItem: jest.fn(),
    };

    withStorageEnvironment(
      {},
      mockStorage,
      () => {
        saveUserSession({ email: "agent@example.com" });

        expect(mockStorage.setItem).toHaveBeenCalled();

        expect(getUserSession()).toBeNull();

        clearUserSession();

        expect(mockStorage.removeItem).toHaveBeenCalled();
      }
    );
  });

  // 17. Fallback storage when window is undefined
  it("uses global sessionStorage when window is undefined", () => {
    const mockStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(() => null),
      removeItem: jest.fn(),
    };

    withStorageEnvironment(
      undefined,
      mockStorage,
      () => {
        saveUserSession({ email: "agent@example.com" });

        expect(mockStorage.setItem).toHaveBeenCalled();

        clearUserSession();

        expect(mockStorage.removeItem).toHaveBeenCalled();
      }
    );
  });

  // 18. No storage available
  it("handles unavailable sessionStorage safely", () => {
    withStorageEnvironment(
      undefined,
      undefined,
      () => {
        const result = saveUserSession({
          email: "agent@example.com",
        });

        expect(result.email).toBe("agent@example.com");

        expect(getUserSession()).toBeNull();

        expect(
          isUserAuthenticated("agent@example.com")
        ).toBe(false);

        expect(() => clearUserSession()).not.toThrow();
      }
    );
  });
});
