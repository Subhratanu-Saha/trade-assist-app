import React from "react";

const CONTROL_CLASS_NAMES =
  "mt-1 w-full rounded border border-gray-300 px-3 py-2";

const getDefaultWidget = (fieldSchema) => {
  if (fieldSchema.enum) {
    return "select";
  }

  return "input";
};

const CaseFormFields = ({ schema, uiSchema = {} }) => {
  const properties = schema?.properties || {};

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([fieldName, fieldSchema]) => {
        const fieldUiSchema = uiSchema[fieldName] || {};
        const widget =
          fieldUiSchema["ui:widget"] ??
          fieldSchema["ui:widget"] ??
          getDefaultWidget(fieldSchema);
        const classNames =
          fieldUiSchema["ui:classNames"] ??
          fieldSchema["ui:classNames"] ??
          "";
        const placeholder = fieldUiSchema["ui:placeholder"];
        const patternMessage =
          fieldUiSchema["ui:options"]?.patternMessage;
        const isRequired = schema.required?.includes(fieldName) || false;
        const label = fieldSchema.title || fieldName;

        if (widget === "hidden") {
          return (
            <div key={fieldName} className={classNames}>
              <input
                type="hidden"
                name={fieldName}
                value={fieldSchema.type === "boolean" ? "false" : ""}
              />
            </div>
          );
        }

        if (
          !["select", "input", "textarea", "radio", "checkbox"].includes(widget)
        ) {
          return (
            <div key={fieldName} className={classNames}>
              <p className="font-medium text-[#0A2947]">{label}</p>
              <p role="alert" className="text-sm text-red-600">
                Unsupported widget &quot;{widget}&quot; for {fieldName}.
              </p>
            </div>
          );
        }

        const controlId = `case-form-${fieldName}`;

        return (
          <div key={fieldName} className={classNames}>
            {widget === "radio" ? (
              <fieldset>
                <legend className="block text-sm font-medium text-[#0A2947]">
                  {label}
                </legend>
                {(fieldSchema.enum || []).map((value) => (
                  <label key={value} className="mr-4 inline-flex items-center">
                    <input
                      type="radio"
                      name={fieldName}
                      value={value}
                      required={isRequired}
                      className="mr-2"
                    />
                    {value}
                  </label>
                ))}
              </fieldset>
            ) : (
              <>
                <label
                  htmlFor={controlId}
                  className="block text-sm font-medium text-[#0A2947]"
                >
                  {label}
                </label>
                {widget === "select" ? (
                  <select
                    id={controlId}
                    name={fieldName}
                    required={isRequired}
                    className={CONTROL_CLASS_NAMES}
                  >
                    <option value="">
                      {placeholder || `Select ${label}`}
                    </option>
                    {(fieldSchema.enum || []).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : widget === "textarea" ? (
                  <textarea
                    id={controlId}
                    name={fieldName}
                    required={isRequired}
                    minLength={fieldSchema.minLength}
                    maxLength={fieldSchema.maxLength}
                    placeholder={placeholder}
                    className={CONTROL_CLASS_NAMES}
                  />
                ) : (
                  <input
                    id={controlId}
                    name={fieldName}
                    type={widget === "checkbox" ? "checkbox" : "text"}
                    value={widget === "checkbox" ? "true" : undefined}
                    required={isRequired}
                    minLength={fieldSchema.minLength}
                    maxLength={fieldSchema.maxLength}
                    pattern={fieldSchema.pattern}
                    placeholder={placeholder}
                    className={CONTROL_CLASS_NAMES}
                    onChange={(event) => {
                      const input = event.currentTarget;
                      if (
                        fieldSchema.maxLength &&
                        input.value.length > fieldSchema.maxLength
                      ) {
                        input.setCustomValidity(
                          `Order number cannot be longer than ${fieldSchema.maxLength} characters.`
                        );
                      } else if (
                        fieldSchema.pattern &&
                        input.value &&
                        !new RegExp(fieldSchema.pattern).test(input.value)
                      ) {
                        input.setCustomValidity(
                          patternMessage ||
                            "Value does not match the required format."
                        );
                      } else {
                        input.setCustomValidity("");
                      }
                    }}
                    onInvalid={(event) => {
                      if (event.currentTarget.validity.patternMismatch) {
                        event.currentTarget.setCustomValidity(
                          patternMessage ||
                            "Value does not match the required format."
                        );
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CaseFormFields;
