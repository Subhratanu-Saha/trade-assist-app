
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import { AuthProvider, useAuth } from "./AuthContext";

const TestComponent = () => {
  const { email, setAuthenticatedEmail, authLoading } = useAuth();

  return (
    <div>
      <p data-testid="email">{email || "No email"}</p>
      <p data-testid="loading">{String(authLoading)}</p>

      <button
        onClick={() => setAuthenticatedEmail("test@example.com")}
      >
        Set Email
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should set loading to false after checking localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  test("should load authenticated email from localStorage", async () => {
    localStorage.setItem(
      "authenticatedUserEmail",
      "saved@example.com"
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("email")).toHaveTextContent(
        "saved@example.com"
      );
    });
  });

  test("should keep email null when localStorage has no email", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("email")).toHaveTextContent("No email");
    });
  });

  test("should save email in state and localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Set Email" }));

    await waitFor(() => {
      expect(screen.getByTestId("email")).toHaveTextContent(
        "test@example.com"
      );
    });

    expect(localStorage.getItem("authenticatedUserEmail")).toBe(
      "test@example.com"
    );
  });

  test("should update email when a different email is provided", async () => {
    const UpdateComponent = () => {
      const { setAuthenticatedEmail } = useAuth();

      return (
        <button onClick={() => setAuthenticatedEmail("new@example.com")}>
          Update Email
        </button>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
        <UpdateComponent />
      </AuthProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Update Email" })
    );

    await waitFor(() => {
      expect(localStorage.getItem("authenticatedUserEmail")).toBe(
        "new@example.com"
      );
    });

    expect(screen.getByTestId("email")).toHaveTextContent(
      "new@example.com"
    );
  });
});
