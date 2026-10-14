const caseFormSchema = {
  type: "object",
  properties: {
    contactChannel: {
      type: "string",
      title: "Contact channel",
    },
    customerNeed: {
      type: "string",
      title: "Customer need",
    },
    employeeResponse: {
      type: "string",
      title: "Employee response",
    },
    orderNumber: {
      type: "string",
      title: "Order number",
    },
    notes: {
      type: "string",
      title: "Notes",
    },
    isEscalated: {
      type: "boolean",
      title: "Escalated",
    },
  },
  ui: {
    contactChannel: {
      "ui:widget": "select",
      "ui:classNames": "form-field",
    },
    notes: {
      "ui:widget": "textarea",
      "ui:classNames": "form-field",
    },
    isEscalated: {
      "ui:widget": "checkbox",
    },
  },
};

export default caseFormSchema;
