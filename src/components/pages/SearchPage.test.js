import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchPage from "./SearchPage";
import useCustomerSearch from "../../hooks/useCustomerSearch";
import { useCustomer } from "../../context/CustomerContext";

// Mock router
jest.mock("react-router-dom", () => {
  const React = require("react");

  return {
    Link: ({ to, children, ...props }) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

// Mock hooks
jest.mock("../../hooks/useCustomerSearch");
jest.mock("../../context/CustomerContext");

// Mock SearchBar
jest.mock("../search/searchBar", () => {
  return function MockSearchBar({ value, onChange, onSearch }) {
    return (
      <div>
        <input
          aria-label="Search email"
          value={value}
          onChange={onChange}
        />
        <button onClick={onSearch}>Search</button>
      </div>
    );
  };
});

// Mock NewCustomerButton
jest.mock("../search/NewCustomerButton", () => {
  return function MockNewCustomerButton() {
    return <button>New Customer</button>;
  };
});

// Mock CustomerRecord
jest.mock("../CustomerRecord", () => {
  return function MockCustomerRecord({ customer }) {
    return <div>Customer: {customer.name}</div>;
  };
});

const mockSearchCustomer = jest.fn();
const mockSelectCustomer = jest.fn();

const customer = {
  customerId: 1,
  name: "John Doe",
  email: "john@example.com",
};

const renderPage = () => render(<SearchPage />);

const setSearchState = (overrides = {}) => {
  useCustomerSearch.mockReturnValue({
    searchCustomer: mockSearchCustomer,
    loading: false,
    error: null,
    customer: null,
    responseCode: null,
    ...overrides,
  });

  useCustomer.mockReturnValue({
    selectCustomer: mockSelectCustomer,
  });
};

describe("SearchPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSearchState();
  });

  test("renders the search page", () => {
    renderPage();

    expect(screen.getByLabelText("Search email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  test("updates search input when typing", () => {
    renderPage();

    const input = screen.getByLabelText("Search email");

    fireEvent.change(input, {
      target: { value: "john@example.com" },
    });

    expect(input).toHaveValue("john@example.com");
  });

  test("does not search when input is empty", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(mockSearchCustomer).not.toHaveBeenCalled();
  });

  test("does not search when input contains only spaces", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Search email"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(mockSearchCustomer).not.toHaveBeenCalled();
  });

  test("searches using trimmed email", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Search email"), {
      target: { value: " john@example.com " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(mockSearchCustomer).toHaveBeenCalledWith("john@example.com");
    });
  });

  test("displays loading message", () => {
    setSearchState({ loading: true });

    renderPage();

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  test("displays customer for 200 response", () => {
    setSearchState({
      responseCode: 200,
      customer,
    });

    renderPage();

    expect(screen.getByText("Customer: John Doe")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "View details for John Doe" })
    ).toHaveAttribute("href", "/customer");
  });

  test("uses fallback name when customer name is missing", () => {
    setSearchState({
      responseCode: 200,
      customer: { email: "john@example.com" },
    });

    renderPage();

    expect(
      screen.getByRole("link", { name: "View details for customer" })
    ).toBeInTheDocument();
  });

  test("selects customer through useEffect", () => {
    setSearchState({
      responseCode: 200,
      customer,
    });

    renderPage();

    expect(mockSelectCustomer).toHaveBeenCalledWith(customer);
  });

  test("selects customer when link is clicked", () => {
    setSearchState({
      responseCode: 200,
      customer,
    });

    renderPage();

    fireEvent.click(
      screen.getByRole("link", { name: "View details for John Doe" })
    );

    expect(mockSelectCustomer).toHaveBeenCalledWith(customer);
  });

  test("does not select customer for non-200 response", () => {
    renderPage();

    expect(mockSelectCustomer).not.toHaveBeenCalled();
  });

  test("does not select customer when customer is missing", () => {
    setSearchState({
      responseCode: 200,
      customer: null,
    });

    renderPage();

    expect(mockSelectCustomer).not.toHaveBeenCalled();
  });

  test("displays New Customer button for 404 response", () => {
    setSearchState({ responseCode: 404 });

    renderPage();

    expect(
      screen.getByRole("button", { name: "New Customer" })
    ).toBeInTheDocument();
  });

  test("displays error for 400 response", () => {
    setSearchState({
      responseCode: 400,
      error: "Bad Request",
    });

    renderPage();

    expect(screen.getByText("Bad Request")).toBeInTheDocument();
  });

  test("displays error for 500 response", () => {
    setSearchState({
      responseCode: 500,
      error: "Internal Server Error",
    });

    renderPage();

    expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
  });

  test("does not display customer for non-200 response", () => {
    setSearchState({
      responseCode: 404,
      customer,
    });

    renderPage();

    expect(screen.queryByText("Customer: John Doe")).not.toBeInTheDocument();
  });
});