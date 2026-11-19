import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Case from "./case";

describe("Case form submission", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { open: [], closed: [] } }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows a Submit button and logs typed form data on submit", async () => {
    const info = jest.spyOn(console, "info").mockImplementation(() => {});
    render(<Case customerId="customer-1" />);

    await screen.findByText("No open cases available.");
    userEvent.click(screen.getByRole("button", { name: "+ New Case" }));

    const form = screen.getByRole("form", { name: "New case form" });
    expect(
      screen.getByRole("button", { name: "Submit", type: "submit" })
    ).toBeVisible();

    userEvent.selectOptions(
      screen.getByLabelText("Contact Channel"),
      "WhatsApp"
    );
    userEvent.selectOptions(screen.getByLabelText("Customer Need"), "Refund");
    userEvent.click(screen.getByLabelText("Resolved"));
    fireEvent.submit(form);

    await waitFor(() => {
      expect(info).toHaveBeenCalledWith("New case form submitted:", {
        contactChannel: "WhatsApp",
        customerNeed: "Refund",
        employeeResponse: "Resolved",
        orderNumber: "",
        notes: "",
        escalated: false,
      });
    });
  });
});
