
import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import {
  clearUserSession,
  getUserSession,
  saveUserSession,
} from "../utils/sessionStorage";

const AuthStatus = () => {
  const {
    email,
    logout,
    setAuthenticatedEmail,
    authLoading,
  } = useAuth();

  return (
    <>
      <span>{email || "signed out"}</span>
      <span>{authLoading ? "Loading" : "Loaded"}</span>

      <button
        type="button"
        onClick={() => setAuthenticatedEmail("new@example.com")}
      >
        Set Email
      </button>

      <button type="button" onClick={logout}>
        Logout
      </button>
    </>
  );
};

describe("AuthContext", () => {
  const email = "agent@example.com";
  const unrelatedLocalStorageKey = "unrelatedLocalStorageEntry";
  const unrelatedSessionStorageKey = "unrelatedSessionStorageEntry";

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearUserSession();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
  });

  test("loads authenticated email from localStorage", () => {
    localStorage.setItem("authenticatedUserEmail", email);

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    expect(screen.getByText(email)).toBeInTheDocument();
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });

  test("handles missing authenticated email", () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    expect(screen.getByText("signed out")).toBeInTheDocument();
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });

  test("sets authenticated email and updates localStorage", () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Set Email" }));

    expect(screen.getByText("new@example.com")).toBeInTheDocument();
    expect(localStorage.getItem("authenticatedUserEmail")).toBe(
      "new@example.com"
    );
  });

  test("clears only auth storage and resets authenticated email on logout", () => {
    localStorage.setItem("authenticatedUserEmail", email);
    saveUserSession({ email });

    localStorage.setItem(unrelatedLocalStorageKey, "preserve");
    sessionStorage.setItem(unrelatedSessionStorageKey, "preserve");

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
