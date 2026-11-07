
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomerRecord from "./CustomerRecord";

describe("CustomerRecord Component", () => {
  test("displays Loading when customer is not provided", () => {
    render(<CustomerRecord customer={null} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays Loading when customer is undefined", () => {
    render(<CustomerRecord />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays all customer details when provided", () => {
    const customer = {
      name: "John Doe",
      contactnum: "9876543210",
      emailaddr: "john@example.com",
    };

    render(<CustomerRecord customer={customer} />);

    expect(screen.getByText("Customer Record")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "John Doe" })).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("displays Unnamed Customer when name is missing", () => {
    const customer = {
      contactnum: "9876543210",
      emailaddr: "john@example.com",
    };

    render(<CustomerRecord customer={customer} />);

    expect(screen.getByRole("heading", { name: "Unnamed Customer" })).toBeInTheDocument();
  });

  test("displays Not Available when phone number is missing", () => {
    const customer = {
      name: "John Doe",
      emailaddr: "john@example.com",
    };

    render(<CustomerRecord customer={customer} />);

    expect(screen.getByText("Not Available")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("displays Not Available when email address is missing", () => {
    const customer = {
      name: "John Doe",
      contactnum: "9876543210",
    };

    render(<CustomerRecord customer={customer} />);

    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Not Available")).toBeInTheDocument();
  });

  test("displays fallback values when all customer details are empty", () => {
    const customer = {
      name: "",
      contactnum: "",
      emailaddr: "",
    };

    render(<CustomerRecord customer={customer} />);

    expect(screen.getByRole("heading", { name: "Unnamed Customer" })).toBeInTheDocument();
    expect(screen.getAllByText("Not Available")).toHaveLength(2);
  });

  test("displays fallback values when customer details are null", () => {
    const customer = {
      name: null,
      contactnum: null,
      emailaddr: null,
    };

    render(<CustomerRecord customer={customer} />);

    expect(screen.getByRole("heading", { name: "Unnamed Customer" })).toBeInTheDocument();
    expect(screen.getAllByText("Not Available")).toHaveLength(2);
  });
});
