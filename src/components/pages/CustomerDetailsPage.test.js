import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomerDetailsPage from "./CustomerDetailsPage";
import { useCustomer } from "../../context/CustomerContext";

// Mock navigation
jest.mock("react-router-dom", () => {
  const React = require("react");

  return {
    Navigate: ({ to, replace }) =>
      React.createElement("div", {
        "data-testid": "redirect",
        "data-to": to,
        "data-replace": String(replace),
      }),
  };
});

// Mock customer context
jest.mock("../../context/CustomerContext", () => ({
  useCustomer: jest.fn(),
}));

// Mock child components
jest.mock("../CustomerRecord", () => {
  return function MockCustomerRecord({ customer }) {
    return (
      <div data-testid="customer-record">
        {customer.name || "Customer Record"}
      </div>
    );
  };
});

jest.mock("../purchase", () => {
  return function MockPurchase({ customerId }) {
    return <div data-testid="purchase">Purchase: {customerId}</div>;
  };
});

jest.mock("../case", () => {
  return function MockCase({ customerId }) {
    return <div data-testid="case">Case: {customerId}</div>;
  };
});

// Helper function
const renderPage = (customer) => {
  useCustomer.mockReturnValue({ customer });

  return render(<CustomerDetailsPage />);
};

describe("CustomerDetailsPage Component", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Redirect when customer is missing
  test("redirects to search when customer is null", () => {
    renderPage(null);

    expect(screen.getByTestId("redirect")).toHaveAttribute(
      "data-to",
      "/search"
    );

    expect(screen.getByTestId("redirect")).toHaveAttribute(
      "data-replace",
      "true"
    );
  });

  // Test 2: Render customer record
  test("renders customer record", () => {
    renderPage({
      name: "John",
      customerId: "C101",
    });

    expect(screen.getByTestId("customer-record"))
      .toHaveTextContent("John");
  });

  // Test 3: Default Purchase tab
  test("displays Purchase tab by default", () => {
    renderPage({
      name: "John",
      customerId: "C101",
    });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C101");

    expect(screen.queryByTestId("case"))
      .not.toBeInTheDocument();
  });

  // Test 4: Switch to Case tab
  test("displays Case details when Case is clicked", () => {
    renderPage({
      customerId: "C101",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Case" })
    );

    expect(screen.getByTestId("case"))
      .toHaveTextContent("C101");

    expect(screen.queryByTestId("purchase"))
      .not.toBeInTheDocument();
  });

  // Test 5: Switch to Fund tab
  test("displays Fund message when Fund is clicked", () => {
    renderPage({
      customerId: "C101",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Fund" })
    );

    expect(
      screen.getByText("No fund details available.")
    ).toBeInTheDocument();

    expect(screen.queryByTestId("purchase"))
      .not.toBeInTheDocument();

    expect(screen.queryByTestId("case"))
      .not.toBeInTheDocument();
  });

  // Test 6: Switch back to Purchase
  test("switches back to Purchase tab", () => {
    renderPage({
      customerId: "C101",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Case" })
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Purchase" })
    );

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C101");
  });

  // Test 7: customerId property
  test("uses customerId property", () => {
    renderPage({ customerId: "C101" });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C101");
  });

  // Test 8: customer_id property
  test("uses customer_id property", () => {
    renderPage({ customer_id: "C102" });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C102");
  });

  // Test 9: customerid property
  test("uses customerid property", () => {
    renderPage({ customerid: "C103" });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C103");
  });

  // Test 10: customerID property
  test("uses customerID property", () => {
    renderPage({ customerID: "C104" });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C104");
  });

  // Test 11: id property
  test("uses id property", () => {
    renderPage({ id: "C105" });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("C105");
  });

  // Test 12: Missing customer ID
  test("handles missing customer ID", () => {
    renderPage({ name: "John" });

    expect(screen.getByTestId("purchase"))
      .toHaveTextContent("Purchase:");
  });

});