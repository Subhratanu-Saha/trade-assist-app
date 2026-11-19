import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import caseFormSchema from "../config/caseFormSchema";
import caseFormUiSchema from "../config/caseFormUiSchema";
import CaseFormFields from "./CaseFormFields";

describe("CaseFormFields", () => {
  it("uses the UI Schema widget and class name conventions", () => {
    render(
      <CaseFormFields
        schema={caseFormSchema}
        uiSchema={caseFormUiSchema}
      />
    );

    expect(screen.getByLabelText("Contact Channel").tagName).toBe("SELECT");
    expect(screen.getByLabelText("Contact Channel").parentElement).toHaveClass(
      "form-field"
    );
  });

  it("honors ui:widget overrides when rendering schema fields", () => {
    const schema = {
      properties: {
        choice: {
          type: "string",
          enum: ["First", "Second"],
          "ui:widget": "input",
          "ui:classNames": "custom-field",
        },
      },
    };

    render(<CaseFormFields schema={schema} />);

    expect(screen.getByLabelText("choice").tagName).toBe("INPUT");
    expect(screen.getByLabelText("choice").parentElement).toHaveClass(
      "custom-field"
    );
  });

  it("renders the notes field as a textarea with its length constraints", () => {
    render(
      <CaseFormFields
        schema={caseFormSchema}
        uiSchema={caseFormUiSchema}
      />
    );

    const notes = screen.getByLabelText("Other Remarks");

    expect(notes.tagName).toBe("TEXTAREA");
    expect(notes).toHaveAttribute("minLength", "5");
    expect(notes).toHaveAttribute("maxLength", "200");
  });

  it("applies required constraints during form validation", () => {
    const { container } = render(
      <form>
        <CaseFormFields
          schema={caseFormSchema}
          uiSchema={caseFormUiSchema}
        />
      </form>
    );
    const form = container.querySelector("form");
    const contactChannel = screen.getByLabelText("Contact Channel");
    const customerNeed = screen.getByLabelText("Customer Need");
    const employeeResponse = screen.getByLabelText("Resolved");
    expect(contactChannel).toBeRequired();
    expect(employeeResponse).toBeRequired();
    expect(form.checkValidity()).toBe(false);

    userEvent.selectOptions(contactChannel, "WhatsApp");
    userEvent.selectOptions(customerNeed, "Refund");
    userEvent.click(employeeResponse);
    expect(form.checkValidity()).toBe(true);
  });

  it("limits notes input to its configured maximum length", () => {
    render(
      <CaseFormFields
        schema={caseFormSchema}
        uiSchema={caseFormUiSchema}
      />
    );
    const notes = screen.getByLabelText("Other Remarks");

    userEvent.type(notes, "x".repeat(201));

    expect(notes).toHaveValue("x".repeat(200));
  });

  it("uses the UI schema widgets, classes, and placeholders for every field", () => {
    render(
      <CaseFormFields
        schema={caseFormSchema}
        uiSchema={caseFormUiSchema}
      />
    );

    expect(screen.getByLabelText("Customer Need").tagName).toBe("SELECT");
    expect(screen.getByLabelText("Resolved")).toHaveAttribute(
      "type",
      "radio"
    );
    expect(screen.queryByRole("checkbox", { name: "Escalated" })).toBeNull();
    expect(screen.getByLabelText("Order Number")).toHaveAttribute(
      "placeholder",
      "Enter order number"
    );
    expect(document.querySelector('input[name="escalated"]')).toHaveAttribute(
      "type",
      "hidden"
    );

    Object.keys(caseFormSchema.properties).forEach((fieldName) => {
      expect(caseFormUiSchema[fieldName]["ui:classNames"]).toBe("form-field");
    });
  });

  it("accepts valid order numbers and rejects invalid formats and lengths", () => {
    render(
      <CaseFormFields
        schema={caseFormSchema}
        uiSchema={caseFormUiSchema}
      />
    );
    const orderNumber = screen.getByLabelText("Order Number");

    expect(orderNumber).toHaveAttribute("maxLength", "20");
    expect(orderNumber).toHaveAttribute("pattern", "^(ORD|PAY)-\\d{3,}$");
    expect(orderNumber).not.toHaveAttribute("minLength");
    expect(orderNumber).toHaveAttribute("placeholder", "Enter order number");
    expect(orderNumber.parentElement).toHaveClass("form-field");

    ["ORD-204", "PAY-451"].forEach((value) => {
      fireEvent.change(orderNumber, { target: { value } });
      expect(orderNumber.checkValidity()).toBe(true);
    });

    fireEvent.change(orderNumber, { target: { value: "abc" } });
    expect(orderNumber.checkValidity()).toBe(false);
    expect(orderNumber.validationMessage).toBe(
      "Order number must look like ORD-204 or PAY-451"
    );

    fireEvent.change(orderNumber, {
      target: { value: `ORD-${"1".repeat(17)}` },
    });
    expect(orderNumber.value).toHaveLength(21);
    expect(orderNumber.checkValidity()).toBe(false);
    expect(orderNumber.validationMessage).toBe(
      "Order number cannot be longer than 20 characters."
    );
  });

  it("submits checked boolean widgets as the string true", () => {
    const schema = {
      type: "object",
      properties: {
        escalated: {
          type: "boolean",
          title: "Escalated",
        },
      },
    };
    const uiSchema = {
      escalated: {
        "ui:widget": "checkbox",
        "ui:classNames": "form-field",
      },
    };
    const { container } = render(
      <form>
        <CaseFormFields schema={schema} uiSchema={uiSchema} />
      </form>
    );
    const checkbox = screen.getByRole("checkbox", { name: "Escalated" });

    userEvent.click(checkbox);

    expect(new FormData(container.querySelector("form")).get("escalated")).toBe(
      "true"
    );
  });
});
