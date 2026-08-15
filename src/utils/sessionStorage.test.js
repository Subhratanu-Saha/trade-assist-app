import {
  saveUserSession,
  getUserSession,
  isUserAuthenticated,
  clearUserSession,
} from "./sessionStorage";

describe("saveUserSession", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores the email and login timestamp in sessionStorage as a single object", () => {
    const email = "agent@example.com";

    const savedSession = saveUserSession({ email });

    expect(savedSession).toEqual(
      expect.objectContaining({
        email,
        loginTimeStamp: expect.any(String),
      })
    );

    expect(JSON.parse(sessionStorage.getItem("userSession"))).toEqual(savedSession);
  });

  it("preserves additional session fields without changing the overall structure", () => {
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

  it("reads the saved session and reports the authenticated state", () => {
    saveUserSession({ email: "agent@example.com" });

    expect(getUserSession()).toEqual(
      expect.objectContaining({
        email: "agent@example.com",
      })
    );
    expect(isUserAuthenticated()).toBe(true);

    clearUserSession();
    expect(getUserSession()).toBeNull();
    expect(isUserAuthenticated()).toBe(false);
  });
});
