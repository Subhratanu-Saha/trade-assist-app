jest.mock("react-router-dom", () => {
  const { TextEncoder, TextDecoder } = require("util");

  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;

  return jest.requireActual("react-router");
});
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "./App";

import { useAuth } from "./context/AuthContext";
import { isUserAuthenticated } from "./utils/sessionStorage";

jest.mock("./context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: jest.fn(),
}));

jest.mock("./context/CustomerContext", () => ({
  CustomerProvider: ({ children }) => children,
}));

jest.mock("./utils/sessionStorage", () => ({
  isUserAuthenticated: jest.fn(),
}));

jest.mock("./components/LoginForm", () => {
  return function MockLoginForm() {
    return <div>Login Form</div>;
  };
});

jest.mock("./components/search/PrivateRoute", () => {
  return function MockPrivateRoute({ children }) {
    return <>{children}</>;
  };
});

jest.mock("./components/pages/SearchPage", () => {
  return function MockSearchPage() {
    return <div>Search Page</div>;
  };
});

jest.mock("./components/pages/CustomerDetailsPage", () => {
  return function MockCustomerDetailsPage() {
    return <div>Customer Details Page</div>;
  };
});

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location">{location.pathname}</div>;
};

const renderApp = (initialPath = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
      <LocationDisplay />
    </MemoryRouter>
  );
};

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render nothing while authentication is loading", () => {
    useAuth.mockReturnValue({
      email: null,
      authLoading: true,
    });

    renderApp("/");

    expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
    expect(screen.queryByText("Search Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Customer Details Page")).not.toBeInTheDocument();

    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });

  test("should display LoginForm when user is not authenticated", () => {
    useAuth.mockReturnValue({
      email: null,
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(false);

    renderApp("/");

    expect(screen.getByText("Login Form")).toBeInTheDocument();
    expect(isUserAuthenticated).toHaveBeenCalledWith(null);
  });

  test("should redirect authenticated user from root to search page", async () => {
    useAuth.mockReturnValue({
      email: "user@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(true);

    renderApp("/");

    expect(await screen.findByText("Search Page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("/search");
    });
  });

  test("should display SearchPage for search route", () => {
    useAuth.mockReturnValue({
      email: "user@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(true);

    renderApp("/search");

    expect(screen.getByText("Search Page")).toBeInTheDocument();
  });

  test("should display CustomerDetailsPage for customer route", () => {
    useAuth.mockReturnValue({
      email: "user@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(true);

    renderApp("/customer");

    expect(screen.getByText("Customer Details Page")).toBeInTheDocument();
  });

  test("should redirect unknown route to search when authenticated", async () => {
    useAuth.mockReturnValue({
      email: "user@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(true);

    renderApp("/unknown");

    expect(await screen.findByText("Search Page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("/search");
    });
  });

  test("should redirect unknown route to root when unauthenticated", async () => {
    useAuth.mockReturnValue({
      email: null,
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(false);

    renderApp("/unknown");

    expect(await screen.findByText("Login Form")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent("/");
    });
  });

  test("should check authentication using the current email", () => {
    useAuth.mockReturnValue({
      email: "test@example.com",
      authLoading: false,
    });

    isUserAuthenticated.mockReturnValue(false);

    renderApp("/");

    expect(isUserAuthenticated).toHaveBeenCalledWith(
      "test@example.com"
    );
  });
});
