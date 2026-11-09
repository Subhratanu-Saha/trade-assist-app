import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import useAgentLogin from "../hooks/useAgentLogin";
import { useAuth } from "../context/AuthContext";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useAgentLogin", () => jest.fn());

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("./auth/EmailInput", () => {
  return function MockEmailInput({ onEmailChange }) {
    return (
      <input
        aria-label="Email"
        type="email"
        onChange={(e) => onEmailChange(e.target.value)}
      />
    );
  };
});

jest.mock("./auth/passwordInput", () => {
  return function MockPasswordInput({ onPasswordChange }) {
    return (
      <input
        aria-label="Password"
        type="password"
        onChange={(e) => onPasswordChange(e.target.value)}
      />
    );
  };
});

jest.mock("./Button", () => {
  return function MockButton({ label, type, disabled }) {
    return (
      <button type={type} disabled={disabled}>
        {label}
      </button>
    );
  };
});

describe("LoginForm Component", () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();
  const mockClearError = jest.fn();
  const mockSetAuthenticatedEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue({
      setAuthenticatedEmail: mockSetAuthenticatedEmail,
    });

    useAgentLogin.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: "",
      clearError: mockClearError,
    });
  });

  test("renders login form", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("shows validation error when both fields are empty", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      screen.getByText("Please enter valid email ID and password")
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("shows validation error when email is empty", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      screen.getByText("Please enter valid email ID and password")
    ).toBeInTheDocument();
  });

  test("shows validation error when password is empty", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      screen.getByText("Please enter valid email ID and password")
    ).toBeInTheDocument();
  });

  test("clears validation error when email changes", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    expect(
      screen.queryByText("Please enter valid email ID and password")
    ).not.toBeInTheDocument();

    expect(mockClearError).toHaveBeenCalled();
  });

  test("clears validation error when password changes", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    expect(
      screen.queryByText("Please enter valid email ID and password")
    ).not.toBeInTheDocument();

    expect(mockClearError).toHaveBeenCalled();
  });

  test("calls login with email and password", async () => {
    mockLogin.mockResolvedValue(false);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  test("navigates after successful login", async () => {
    mockLogin.mockResolvedValue({ success: true });

    const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockSetAuthenticatedEmail).toHaveBeenCalledWith(
        "test@example.com"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/search", {
        replace: true,
      });
    });

    expect(consoleLog).toHaveBeenCalledTimes(2);
    consoleLog.mockRestore();
  });

  test("does not navigate when login fails", async () => {
    mockLogin.mockResolvedValue(null);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetAuthenticatedEmail).not.toHaveBeenCalled();
  });

  test("displays login error message", () => {
    useAgentLogin.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: "Invalid credentials",
      clearError: mockClearError,
    });

    render(<LoginForm />);

    expect(
      screen.getByText("Userid and password doesn't matched")
    ).toBeInTheDocument();
  });

  test("displays validation error instead of login error", () => {
    useAgentLogin.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: "Some login error",
      clearError: mockClearError,
    });

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      screen.getByText("Please enter valid email ID and password")
    ).toBeInTheDocument();
  });

  test("displays loading state and disables button", () => {
    useAgentLogin.mockReturnValue({
      login: mockLogin,
      loading: true,
      error: "",
      clearError: mockClearError,
    });

    render(<LoginForm />);

    expect(
      screen.getByRole("button", { name: "Logging in..." })
    ).toBeDisabled();
  });

  test("enables button when loading is false", () => {
    render(<LoginForm />);

    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });
});