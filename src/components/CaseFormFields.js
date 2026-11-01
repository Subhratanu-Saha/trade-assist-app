import React from "react";

const CONTROL_CLASS_NAMES =
  "mt-1 w-full rounded border border-gray-300 px-3 py-2";

const getDefaultWidget = (fieldSchema) => {
  if (fieldSchema.enum) {
    return "select";
  }

  return "input";
};

const CaseFormFields = ({ schema }) => {
  const properties = schema?.properties || {};

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([fieldName, fieldSchema]) => {
        const widget =
          fieldSchema.ui?.widget ?? getDefaultWidget(fieldSchema);
        const classNames = fieldSchema.ui?.classNames || "";
        const isRequired = schema.required?.includes(fieldName) || false;
        const label = fieldSchema.title || fieldName;

        if (widget !== "select" && widget !== "input") {
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
                <option value="">Select {label}</option>
                {(fieldSchema.enum || []).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={controlId}
                name={fieldName}
                type={fieldSchema.type === "boolean" ? "checkbox" : "text"}
                required={isRequired}
                minLength={fieldSchema.minLength}
                maxLength={fieldSchema.maxLength}
                className={CONTROL_CLASS_NAMES}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CaseFormFields;
