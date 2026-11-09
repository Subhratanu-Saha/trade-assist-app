import caseFormSchema from "./caseFormSchema";

describe("caseFormSchema", () => {
  test("should have object as its type", () => {
    expect(caseFormSchema.type).toBe("object");
  });

  test("should contain all six properties", () => {
    expect(Object.keys(caseFormSchema.properties)).toEqual([
      "contactChannel",
      "customerNeed",
      "employeeResponse",
      "orderNumber",
      "notes",
      "escalated",
    ]);
  });

  test("should have correct contact channel options", () => {
    expect(caseFormSchema.properties.contactChannel).toEqual({
      type: "string",
      title: "Contact Channel",
      enum: ["WhatsApp", "Phone", "Email", "In Store"],
    });
  });

  test("should have correct customer need options", () => {
    expect(caseFormSchema.properties.customerNeed.enum).toEqual([
      "Order Issue",
      "Refund",
      "Product Inquiry",
      "Delivery Issue",
      "Other",
    ]);
  });

  test("should have correct employee response options", () => {
    expect(caseFormSchema.properties.employeeResponse.enum).toEqual([
      "Resolved",
      "Follow Up Required",
      "Escalated",
    ]);
  });

  test("should have correct order number validation", () => {
    expect(caseFormSchema.properties.orderNumber).toEqual({
      type: "string",
      title: "Order Number",
      minLength: 10,
      maxLength: 20,
    });
  });

  test("should have correct notes validation", () => {
    expect(caseFormSchema.properties.notes).toEqual({
      type: "string",
      title: "Other Remarks",
      minLength: 5,
      maxLength: 200,
    });
  });

  test("should define escalated as boolean", () => {
    expect(caseFormSchema.properties.escalated).toEqual({
      type: "boolean",
      title: "Escalated",
    });
  });

  test("should have exactly three required fields", () => {
    expect(caseFormSchema.required).toEqual([
      "contactChannel",
      "customerNeed",
      "employeeResponse",
    ]);
  });
});