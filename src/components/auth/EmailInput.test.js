
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailInput from "./EmailInput";

describe("EmailInput Component", () => {

  // Test 1: Render with default props
  test("renders with default label and placeholder", () => {
    render(<EmailInput />);

    expect(screen.getByText("Email Address")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();
  });

  // Test 2: Custom label and placeholder
  test("renders custom label and placeholder", () => {
    render(
      <EmailInput
        label="Work Email"
        placeholder="Enter work email"
      />
    );

    expect(screen.getByText("Work Email")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter work email")
    ).toBeInTheDocument();
  });

  // Test 3: Initial empty input
  test("shows default border when input is empty", () => {
    render(<EmailInput />);

    const input = screen.getByPlaceholderText("Enter your email");

    expect(input).toHaveValue("");
    expect(input).toHaveClass("border-gray-300");

    expect(
      screen.queryByText("Please write a proper email address.")
    ).not.toBeInTheDocument();
  });

  // Test 4: Valid email
  test("shows valid email message for correct email", () => {
    render(<EmailInput />);

    const input = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(input, {
      target: { value: "test@example.com" },
    });

    expect(input).toHaveValue("test@example.com");
    expect(input).toHaveClass("border-green-500");

    expect(screen.getByText("✔ Valid Email")).toBeInTheDocument();
  });

  // Test 5: Invalid email
  test("shows error message for invalid email", () => {
    render(<EmailInput />);

    const input = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(input, {
      target: { value: "invalid-email" },
    });

    expect(input).toHaveValue("invalid-email");
    expect(input).toHaveClass("border-red-500");

    expect(
      screen.getByText("Please write a proper email address.")
    ).toBeInTheDocument();
  });

  // Test 6: Empty value after typing
  test("returns to default border when input becomes empty", () => {
    render(<EmailInput />);

    const input = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(input, {
      target: { value: "invalid-email" },
    });

    fireEvent.change(input, {
      target: { value: "" },
    });

    expect(input).toHaveValue("");
    expect(input).toHaveClass("border-gray-300");

    expect(
      screen.queryByText("Please write a proper email address.")
    ).not.toBeInTheDocument();
  });

  // Test 7: onEmailChange callback
  test("calls onEmailChange when the user types", () => {
    const mockCallback = jest.fn();

    render(<EmailInput onEmailChange={mockCallback} />);

    const input = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(input, {
      target: { value: "test@example.com" },
    });

    expect(mockCallback).toHaveBeenCalledWith("test@example.com");
  });

  // Test 8: Disabled input
  test("disables input when disabled prop is true", () => {
    render(<EmailInput disabled={true} />);

    const input = screen.getByPlaceholderText("Enter your email");

    expect(input).toBeDisabled();
  });

  // Test 9: Enabled input
  test("keeps input enabled by default", () => {
    render(<EmailInput />);

    const input = screen.getByPlaceholderText("Enter your email");

    expect(input).not.toBeDisabled();
  });

  // Test 10: Display external error
  test("displays error message passed through props", () => {
    render(<EmailInput error="Email is required" />);

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  // Test 11: No external error
  test("does not display error message when error prop is absent", () => {
    render(<EmailInput />);

    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  // Test 12: Callback is optional
  test("works without onEmailChange callback", () => {
    render(<EmailInput />);

    const input = screen.getByPlaceholderText("Enter your email");

    expect(() => {
      fireEvent.change(input, {
        target: { value: "test@example.com" },
      });
    }).not.toThrow();

    expect(screen.getByText("✔ Valid Email")).toBeInTheDocument();
  });

});
