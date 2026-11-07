
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  // Test 1: Render button
  test("renders button with the provided label", () => {
    render(<Button label="Submit" />);

    expect(
      screen.getByRole("button", { name: "Submit" })
    ).toBeInTheDocument();
  });

  // Test 2: Default button type
  test("uses button as the default type", () => {
    render(<Button label="Submit" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "type",
      "button"
    );
  });

  // Test 3: Custom button type
  test("accepts a custom button type", () => {
    render(<Button label="Submit" type="submit" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "type",
      "submit"
    );
  });

  // Test 4: Click event
  test("calls onClick when clicked", () => {
    const mockOnClick = jest.fn();

    render(<Button label="Click Me" onClick={mockOnClick} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Click Me" })
    );

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // Test 5: Disabled button
  test("disables button when disabled is true", () => {
    render(<Button label="Submit" disabled={true} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Test 6: Enabled button by default
  test("button is enabled by default", () => {
    render(<Button label="Submit" />);

    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  // Test 7: No click callback
  test("does not throw when onClick is not provided", () => {
    render(<Button label="Submit" />);

    expect(() => {
      fireEvent.click(screen.getByRole("button"));
    }).not.toThrow();
  });

  // Test 8: Disabled button does not trigger click
  test("does not call onClick when button is disabled", () => {
    const mockOnClick = jest.fn();

    render(
      <Button
        label="Submit"
        onClick={mockOnClick}
        disabled={true}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  // Test 9: CSS classes
  test("applies the expected CSS classes", () => {
    render(<Button label="Submit" />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("h-12");
    expect(button).toHaveClass("rounded-md");
    expect(button).toHaveClass("bg-[#0A2947]");
    expect(button).toHaveClass("font-semibold");
    expect(button).toHaveClass("disabled:cursor-not-allowed");
  });
});
