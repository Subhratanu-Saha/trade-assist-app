import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordInput from "./passwordInput";

describe("PasswordInput Component", () => {

  // Test 1: Default placeholder
  it("renders password input with default placeholder", () => {
    render(<PasswordInput />);

    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();

    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  // Test 2: Custom placeholder
  it("renders with custom placeholder", () => {
    render(
      <PasswordInput placeholder="Enter secure password" />
    );

    expect(
      screen.getByPlaceholderText("Enter secure password")
    ).toBeInTheDocument();
  });

  // Test 3: Empty password after entering a value
  it("does not show an error for an empty password", () => {
    render(<PasswordInput />);

    const input = screen.getByPlaceholderText(
      "Enter your password"
    );

    fireEvent.change(input, {
      target: { value: "Abcd@1234" },
    });

    fireEvent.change(input, {
      target: { value: "" },
    });

    expect(input).toHaveValue("");

    expect(
      screen.queryByText(/Password must/)
    ).not.toBeInTheDocument();
  });

  // Test 4: Password shorter than 8 characters
  it("shows error for password shorter than 8 characters", () => {
    render(<PasswordInput />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Abc@123" } }
    );

    expect(
      screen.getByText(
        "Password must be at least 8 characters long."
      )
    ).toBeInTheDocument();
  });

  // Test 5: Missing uppercase letter
  it("shows error when uppercase letter is missing", () => {
    render(<PasswordInput />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "abcdef@123" } }
    );

    expect(
      screen.getByText(
        "Password must contain at least one uppercase letter."
      )
    ).toBeInTheDocument();
  });

  // Test 6: Missing lowercase letter
  it("shows error when lowercase letter is missing", () => {
    render(<PasswordInput />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "ABCDEFG@123" } }
    );

    expect(
      screen.getByText(
        "Password must contain at least one lowercase letter."
      )
    ).toBeInTheDocument();
  });

  // Test 7: Missing number
  it("shows error when number is missing", () => {
    render(<PasswordInput />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Abcdefgh@" } }
    );

    expect(
      screen.getByText(
        "Password must contain at least one number."
      )
    ).toBeInTheDocument();
  });

  // Test 8: Missing special character
  it("shows error when special character is missing", () => {
    render(<PasswordInput />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Abcdefg123" } }
    );

    expect(
      screen.getByText(
        "Password must contain at least one special character."
      )
    ).toBeInTheDocument();
  });

  // Test 9: Valid password
  it("does not show an error for a valid password", () => {
    render(<PasswordInput />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Abcd@1234" } }
    );

    expect(
      screen.queryByText(/Password must/)
    ).not.toBeInTheDocument();
  });

  // Test 10: Parent callback
  it("calls onPasswordChange when password changes", () => {
    const mockCallback = jest.fn();

    render(
      <PasswordInput onPasswordChange={mockCallback} />
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Abcd@1234" } }
    );

    expect(mockCallback).toHaveBeenCalledWith("Abcd@1234");
  });

  // Test 11: Show password
  it("shows password when eye button is clicked", () => {
    render(<PasswordInput />);

    const input = screen.getByPlaceholderText(
      "Enter your password"
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );

    expect(input).toHaveAttribute("type", "text");

    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();

    expect(
      screen.getByAltText("Hide Password")
    ).toBeInTheDocument();
  });

  // Test 12: Hide password
  it("hides password when eye button is clicked again", () => {
    render(<PasswordInput />);

    const input = screen.getByPlaceholderText(
      "Enter your password"
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Hide password" })
    );

    expect(input).toHaveAttribute("type", "password");

    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeInTheDocument();

    expect(
      screen.getByAltText("Show Password")
    ).toBeInTheDocument();
  });

  // Test 13: Disabled input
  it("disables password input when disabled is true", () => {
    render(<PasswordInput disabled={true} />);

    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeDisabled();
  });

  // Test 14: Optional callback
  it("works without onPasswordChange callback", () => {
    render(<PasswordInput />);

    const input = screen.getByPlaceholderText(
      "Enter your password"
    );

    fireEvent.change(input, {
      target: { value: "Abcd@1234" },
    });

    expect(input).toHaveValue("Abcd@1234");
  });

});