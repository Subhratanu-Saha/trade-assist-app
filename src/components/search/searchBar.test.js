import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./searchBar";

describe("SearchBar Component", () => {
  const mockOnChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input and button", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    expect(
      screen.getByPlaceholderText("Search Customer by Email")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Search Customer" })
    ).toBeInTheDocument();
  });

  test("displays the provided input value", () => {
    render(
      <SearchBar
        value="test@example.com"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    expect(
      screen.getByPlaceholderText("Search Customer by Email")
    ).toHaveValue("test@example.com");
  });

  test("calls onChange when user types", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(
      "Search Customer by Email"
    );

    fireEvent.change(input, {
      target: { value: "test@example.com" },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test("calls onSearch when search button is clicked", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Search Customer" })
    );

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test("calls onSearch when Enter key is pressed", () => {
    render(
      <SearchBar
        value="test@example.com"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.keyDown(
      screen.getByPlaceholderText("Search Customer by Email"),
      { key: "Enter", code: "Enter" }
    );

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test("does not call onSearch for other keys", () => {
    render(
      <SearchBar
        value="test@example.com"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.keyDown(
      screen.getByPlaceholderText("Search Customer by Email"),
      { key: "a", code: "KeyA" }
    );

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test("does not call onSearch when Tab is pressed", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.keyDown(
      screen.getByPlaceholderText("Search Customer by Email"),
      { key: "Tab" }
    );

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test("applies the expected input styles", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(
      "Search Customer by Email"
    );

    expect(input).toHaveStyle({
      backgroundColor: "#D3D4C0",
      border: "2px solid #8B5E3C",
      color: "#0A2947",
    });
  });

  test("applies the expected button styles", () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const button = screen.getByRole("button", {
      name: "Search Customer",
    });

    expect(button).toHaveStyle({
      color: "#8B5E3C",
    });
  });
});