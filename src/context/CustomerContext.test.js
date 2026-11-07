
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import { CustomerProvider, useCustomer } from "./CustomerContext";

const TestComponent = () => {
  const { customer, selectCustomer, clearCustomer } = useCustomer();

  return (
    <div>
      <p data-testid="customer">
        {customer ? customer.name : "No customer"}
      </p>

      <p data-testid="customer-id">
        {customer ? customer.id : "No ID"}
      </p>

      <button
        onClick={() =>
          selectCustomer({
            id: "C001",
            name: "John",
            email: "john@example.com",
          })
        }
      >
        Select Customer
      </button>

      <button onClick={clearCustomer}>
        Clear Customer
      </button>
    </div>
  );
};

describe("CustomerContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("should have null customer when sessionStorage is empty", () => {
    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    expect(screen.getByTestId("customer")).toHaveTextContent(
      "No customer"
    );

    expect(screen.getByTestId("customer-id")).toHaveTextContent(
      "No ID"
    );
  });

  test("should load customer from sessionStorage", () => {
    const customer = {
      id: "C002",
      name: "Alice",
      email: "alice@example.com",
    };

    sessionStorage.setItem(
      "selectedCustomer",
      JSON.stringify(customer)
    );

    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    expect(screen.getByTestId("customer")).toHaveTextContent("Alice");
    expect(screen.getByTestId("customer-id")).toHaveTextContent("C002");
  });

  test("should remove invalid JSON from sessionStorage", () => {
    sessionStorage.setItem("selectedCustomer", "{invalid json");

    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    expect(screen.getByTestId("customer")).toHaveTextContent(
      "No customer"
    );

    expect(sessionStorage.getItem("selectedCustomer")).toBeNull();
  });

  test("should select a customer and save it in sessionStorage", async () => {
    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Select Customer" })
    );

    expect(screen.getByTestId("customer")).toHaveTextContent("John");
    expect(screen.getByTestId("customer-id")).toHaveTextContent("C001");

    const storedCustomer = JSON.parse(
      sessionStorage.getItem("selectedCustomer")
    );

    expect(storedCustomer).toEqual({
      id: "C001",
      name: "John",
      email: "john@example.com",
    });
  });

  test("should clear customer and remove it from sessionStorage", async () => {
    const customer = {
      id: "C003",
      name: "David",
      email: "david@example.com",
    };

    sessionStorage.setItem(
      "selectedCustomer",
      JSON.stringify(customer)
    );

    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    expect(screen.getByTestId("customer")).toHaveTextContent("David");

    fireEvent.click(
      screen.getByRole("button", { name: "Clear Customer" })
    );

    await waitFor(() => {
      expect(screen.getByTestId("customer")).toHaveTextContent(
        "No customer"
      );
    });

    expect(sessionStorage.getItem("selectedCustomer")).toBeNull();
  });

  test("should allow selecting a new customer after clearing the previous one", () => {
    const customer = {
      id: "C004",
      name: "Robert",
      email: "robert@example.com",
    };

    sessionStorage.setItem(
      "selectedCustomer",
      JSON.stringify(customer)
    );

    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Clear Customer" })
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Select Customer" })
    );

    expect(screen.getByTestId("customer")).toHaveTextContent("John");
    expect(
      JSON.parse(sessionStorage.getItem("selectedCustomer"))
    ).toEqual({
      id: "C001",
      name: "John",
      email: "john@example.com",
    });
  });
});
