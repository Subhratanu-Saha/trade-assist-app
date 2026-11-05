
const caseFormSchema = {
  type: "object",
  properties: {
    contactChannel: {
      type: "string",
      title: "Contact Channel",
      enum: ["WhatsApp", "Phone", "Email", "In Store"],
      "ui:widget": "select",
      "ui:classNames": "form-field",
    },

    customerNeed: {
      type: "string",
      title: "Customer Need",
      enum: [
        "Order Issue",
        "Refund",
        "Product Inquiry",
        "Delivery Issue",
        "Other",
      ],
    },

    employeeResponse: {
      type: "string",
      title: "Employee Response",
      enum: ["Resolved", "Follow Up Required", "Escalated"],
    },

    orderNumber: {
      type: "string",
      title: "Order Number",
      maxLength: 20,
      pattern: "^(ORD|PAY)-\\d{3,}$",
    },

    notes: {
      type: "string",
      title: "Other Remarks",
      minLength: 5,
      maxLength: 200,
      "ui:widget": "textarea",
    },

    escalated: {
      type: "boolean",
      title: "Escalated",
    },
  },

  required: [
    "contactChannel",
    "customerNeed",
    "employeeResponse",
  ],
};

export default caseFormSchema;
