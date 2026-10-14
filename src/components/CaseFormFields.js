import React from "react";

const supportedWidgets = new Set(["select", "text", "textarea", "checkbox"]);

export const getFieldUiConfig = (fieldSchema, uiConfig) => {
  const defaultWidget =
    fieldSchema?.type === "boolean" ? "checkbox" : "text";
  const requestedWidget = uiConfig?.["ui:widget"];
  const widget = supportedWidgets.has(requestedWidget)
    ? requestedWidget
    : defaultWidget;

  return {
    widget,
    classNames:
      typeof uiConfig?.["ui:classNames"] === "string"
        ? uiConfig["ui:classNames"]
        : "",
  };
};

function CaseFormFields({ schema, values = {}, onChange = () => {} }) {
  const properties =
    schema?.properties && typeof schema.properties === "object"
      ? schema.properties
      : {};
  const ui = schema?.ui && typeof schema.ui === "object" ? schema.ui : {};

  return (
    <>
      {Object.entries(properties).map(([name, fieldSchema]) => {
        if (!fieldSchema || typeof fieldSchema !== "object") {
          return null;
        }

        const { widget, classNames } = getFieldUiConfig(
          fieldSchema,
          ui[name]
        );
        const label = fieldSchema.title || name;
        const value = values[name] ?? (widget === "checkbox" ? false : "");
        const options = Array.isArray(fieldSchema.enum)
          ? fieldSchema.enum
          : [];
        const selectOptions =
          widget === "select" &&
          value !== "" &&
          !options.includes(value)
            ? [value, ...options]
            : options;
        const commonProps = {
          id: name,
          name,
          className: `case-form-control${classNames ? ` ${classNames}` : ""}${
            widget === "textarea" ? " case-form-textarea" : ""
          }`,
          onChange: (event) =>
            onChange(
              name,
              widget === "checkbox"
                ? event.target.checked
                : event.target.value
            ),
        };

        return (
          <div
            key={name}
            className={
              widget === "checkbox"
                ? "flex items-center gap-2"
                : "flex flex-col gap-1.5"
            }
          >
            <label htmlFor={name}>{label}</label>
            {widget === "select" ? (
              <select {...commonProps} value={value}>
                <option value="">Select an option</option>
                {selectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                ))}
              </select>
            ) : widget === "textarea" ? (
              <textarea {...commonProps} rows={5} value={value} />
            ) : widget === "checkbox" ? (
              <input {...commonProps} type="checkbox" checked={Boolean(value)} />
            ) : (
              <input {...commonProps} type="text" value={value} />
            )}
          </div>
        );
      })}
    </>
  );
}

export default CaseFormFields;
