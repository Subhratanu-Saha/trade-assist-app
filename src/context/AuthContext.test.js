import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import {
  clearUserSession,
  getUserSession,
  saveUserSession,
} from "../utils/sessionStorage";

const AuthStatus = () => {
  const { email, logout } = useAuth();

  return (
    <>
      <span>{email || "signed out"}</span>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </>
  );
};

describe("AuthContext logout", () => {
  const email = "agent@example.com";
  const unrelatedLocalStorageKey = "unrelatedLocalStorageEntry";
  const unrelatedSessionStorageKey = "unrelatedSessionStorageEntry";

  beforeEach(() => {
    clearUserSession();
    localStorage.removeItem("authenticatedUserEmail");
    saveUserSession({ email });
    localStorage.setItem("authenticatedUserEmail", email);
    localStorage.setItem(unrelatedLocalStorageKey, "preserve");
    sessionStorage.setItem(unrelatedSessionStorageKey, "preserve");
  });

  afterEach(() => {
    clearUserSession();
    localStorage.removeItem("authenticatedUserEmail");
    localStorage.removeItem(unrelatedLocalStorageKey);
    sessionStorage.removeItem(unrelatedSessionStorageKey);
  });

  it("clears only auth storage and resets the authenticated email", () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    expect(screen.getByText(email)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(screen.getByText("signed out")).toBeInTheDocument();
    expect(localStorage.getItem("authenticatedUserEmail")).toBeNull();
    expect(getUserSession()).toBeNull();
    expect(localStorage.getItem(unrelatedLocalStorageKey)).toBe("preserve");
    expect(sessionStorage.getItem(unrelatedSessionStorageKey)).toBe("preserve");
  });
});
