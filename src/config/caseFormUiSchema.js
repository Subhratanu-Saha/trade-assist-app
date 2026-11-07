const caseFormUiSchema = {
  contactChannel: {
    "ui:widget": "select",
    "ui:classNames": "form-field",
    "ui:placeholder": "Select contact channel",
  },
  customerNeed: {
    "ui:widget": "select",
    "ui:classNames": "form-field",
    "ui:placeholder": "Select customer need",
  },
  employeeResponse: {
    "ui:widget": "radio",
    "ui:classNames": "form-field",
  },
  orderNumber: {
    "ui:classNames": "form-field",
    "ui:placeholder": "Enter order number",
    "ui:options": {
      patternMessage: "Order number must look like ORD-204 or PAY-451",
    },
  },
  notes: {
    "ui:widget": "textarea",
    "ui:classNames": "form-field",
    "ui:placeholder": "Add any relevant remarks",
  },
  escalated: {
    "ui:widget": "hidden",
    "ui:classNames": "form-field",
  },
};

export default caseFormUiSchema;
