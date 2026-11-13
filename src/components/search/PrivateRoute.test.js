import React from "react";
import { render, screen } from "@testing-library/react";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../../context/AuthContext";
import { isUserAuthenticated } from "../../utils/sessionStorage";

jest.mock("react-router-dom", () => ({
  Navigate: ({ to, replace }) => (
    <div data-testid="redirect" data-to={to} data-replace={String(replace)}>
      Redirecting
    </div>
  ),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../utils/sessionStorage", () => ({
  isUserAuthenticated: jest.fn(),
}));

describe("PrivateRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns null while authentication is loading", () => {
    useAuth.mockReturnValue({
      email: "test@example.com",
      authLoading: true,
    });

    const { container } = render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(container.firstChild).toBeNull();
    expect(isUserAuthenticated).not.toHaveBeenCalled();
  });

  test("renders children when authenticated", () => {
    useAuth.mockReturnValue({
      email: "test@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(true);

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(isUserAuthenticated).toHaveBeenCalledWith("test@example.com");
  });

  test("redirects when user is not authenticated", () => {
    useAuth.mockReturnValue({
      email: "test@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(false);

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByTestId("redirect")).toBeInTheDocument();
    expect(screen.getByTestId("redirect")).toHaveAttribute("data-to", "/");
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("redirects using replace", () => {
    useAuth.mockReturnValue({
      email: "test@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(false);

    render(
      <PrivateRoute>
        <div>Dashboard</div>
      </PrivateRoute>
    );

    expect(screen.getByTestId("redirect")).toHaveAttribute(
      "data-replace",
      "true"
    );
  });

  test("checks authentication with the logged-in email", () => {
    useAuth.mockReturnValue({
      email: "agent@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(true);

    render(
      <PrivateRoute>
        <div>Dashboard</div>
      </PrivateRoute>
    );

    expect(isUserAuthenticated).toHaveBeenCalledWith(
      "agent@example.com"
    );
  });
});