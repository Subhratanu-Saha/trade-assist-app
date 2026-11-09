import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NewCustomerButton from "./NewCustomerButton";

describe("NewCustomerButton Component", () => {
  test("renders the button correctly", () => {
    render(<NewCustomerButton />);

    expect(
      screen.getByRole("button", { name: "+ New Customer" })
    ).toBeInTheDocument();
  });

  test("displays correct button text", () => {
    render(<NewCustomerButton />);

    expect(screen.getByText("+ New Customer")).toBeInTheDocument();
  });

  test("has button type", () => {
    render(<NewCustomerButton />);

    expect(
      screen.getByRole("button")
    ).toHaveAttribute("type", "button");
  });

  test("calls onClick when button is clicked", () => {
    const mockOnClick = jest.fn();

    render(<NewCustomerButton onClick={mockOnClick} />);

    fireEvent.click(
      screen.getByRole("button", { name: "+ New Customer" })
    );

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("does not call onClick without a callback", () => {
    render(<NewCustomerButton />);

    expect(() => {
      fireEvent.click(screen.getByRole("button"));
    }).not.toThrow();
  });

  test("applies the correct background color", () => {
    render(<NewCustomerButton />);

    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "rgb(139, 94, 60)",
    });
  });

  test("applies the correct text color", () => {
    render(<NewCustomerButton />);

    expect(screen.getByRole("button")).toHaveStyle({
      color: "rgb(243, 228, 201)",
    });
  });

 test("applies the correct border", () => {
  render(<NewCustomerButton />);

  expect(screen.getByRole("button")).toHaveStyle({
    border: "2px solid #D3D4C0",
  });
});

  test("applies the expected CSS classes", () => {
    render(<NewCustomerButton />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("rounded-2xl");
    expect(button).toHaveClass("py-3");
    expect(button).toHaveClass("text-lg");
    expect(button).toHaveClass("font-semibold");
    expect(button).toHaveClass("shadow-lg");
    expect(button).toHaveClass("transition-all");
    expect(button).toHaveClass("hover:scale-95");
    expect(button).toHaveClass("focus:ring-2");
  });
});