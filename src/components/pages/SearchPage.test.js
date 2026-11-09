import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import SearchPage from "./SearchPage";

const mockSearchCustomer = jest.fn();
const mockSelectCustomer = jest.fn();
const mockLogout = jest.fn();
const mockNavigate = jest.fn();

let mockSearchState;

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useCustomerSearch", () => ({
  __esModule: true,
  default: () => mockSearchState,
}));

jest.mock("../../context/CustomerContext", () => ({
  useCustomer: () => ({
    selectCustomer: mockSelectCustomer,
  }),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock("../search/searchBar", () => {
  return function MockSearchBar({ value, onChange, onSearch }) {
    return (
      <div>
        <input
          aria-label="Search email"
          value={value}
          onChange={onChange}
        />
        <button type="button" onClick={onSearch}>
          Search
        </button>
      </div>
    );
  };
});

jest.mock("../search/NewCustomerButton", () => {
  return function MockNewCustomerButton() {
    return <button>New Customer</button>;
  };
});

jest.mock("../CustomerRecord", () => {
  return function MockCustomerRecord({ customer }) {
    return <div>Customer: {customer.name}</div>;
  };
});

describe("SearchPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSearchState = {
      searchCustomer: mockSearchCustomer,
      loading: false,
      error: "",
      customer: null,
      responseCode: null,
    };
  });

  test("renders SearchPage successfully", () => {
    render(<SearchPage />);

    expect(
      screen.getByRole("button", { name: /search/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /logout/i })
    ).toBeInTheDocument();
  });

  test("updates search input", () => {
    render(<SearchPage />);

    const input = screen.getByLabelText("Search email");

    fireEvent.change(input, {
      target: { value: "test@example.com" },
    });

    expect(input).toHaveValue("test@example.com");
  });

  test("does not search when input is empty", () => {
    render(<SearchPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /^search$/i })
    );

    expect(mockSearchCustomer).not.toHaveBeenCalled();
  });

  test("does not search when input contains only spaces", () => {
    render(<SearchPage />);

    fireEvent.change(screen.getByLabelText("Search email"), {
      target: { value: "   " },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /^search$/i })
    );

    expect(mockSearchCustomer).not.toHaveBeenCalled();
  });

  test("searches using trimmed email", async () => {
    render(<SearchPage />);

    fireEvent.change(screen.getByLabelText("Search email"), {
      target: { value: "  test@example.com  " },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /^search$/i })
    );

    await waitFor(() => {
      expect(mockSearchCustomer).toHaveBeenCalledWith(
        "test@example.com"
      );
    });
  });

  test("displays loading message", () => {
    mockSearchState.loading = true;

    render(<SearchPage />);

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  test("displays customer record when response code is 200", () => {
    const customer = {
      name: "John",
      emailaddr: "john@example.com",
    };

    mockSearchState.responseCode = 200;
    mockSearchState.customer = customer;

    render(<SearchPage />);

    expect(screen.getByText("Customer: John")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "View details for John",
      })
    ).toHaveAttribute("href", "/customer");

    expect(mockSelectCustomer).toHaveBeenCalledWith(customer);
  });

  test("displays fallback customer name when name is missing", () => {
    const customer = {
      emailaddr: "test@example.com",
    };

    mockSearchState.responseCode = 200;
    mockSearchState.customer = customer;

    render(<SearchPage />);

    expect(
      screen.getByRole("link", {
        name: "View details for customer",
      })
    ).toBeInTheDocument();
  });

  test("selects customer when customer record link is clicked", () => {
    const customer = {
      name: "John",
      emailaddr: "john@example.com",
    };

    mockSearchState.responseCode = 200;
    mockSearchState.customer = customer;

    render(<SearchPage />);

    fireEvent.click(
      screen.getByRole("link", {
        name: "View details for John",
      })
    );

    expect(mockSelectCustomer).toHaveBeenCalledWith(customer);
  });

  test("displays NewCustomerButton when response code is 404", () => {
    mockSearchState.responseCode = 404;

    render(<SearchPage />);

    expect(
      screen.getByRole("button", { name: "New Customer" })
    ).toBeInTheDocument();
  });

  test("displays error message when response code is 400", () => {
    mockSearchState.responseCode = 400;
    mockSearchState.error = "Invalid request";

    render(<SearchPage />);

    expect(screen.getByText("Invalid request")).toBeInTheDocument();
  });

  test("displays error message when response code is 500", () => {
    mockSearchState.responseCode = 500;
    mockSearchState.error = "Server error";

    render(<SearchPage />);

    expect(screen.getByText("Server error")).toBeInTheDocument();
  });

  test("calls logout and navigates to home page", () => {
    render(<SearchPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /logout/i })
    );

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
    });
  });

  test("does not display customer record when customer is null", () => {
    mockSearchState.responseCode = 200;
    mockSearchState.customer = null;

    render(<SearchPage />);

    expect(screen.queryByText(/Customer:/)).not.toBeInTheDocument();
  });

  test("does not display error message for other response codes", () => {
    mockSearchState.responseCode = 201;
    mockSearchState.error = "Some error";

    render(<SearchPage />);

    expect(screen.queryByText("Some error")).not.toBeInTheDocument();
  });
});