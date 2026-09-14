import React, { useState } from "react";

function EmailInput({
  placeholder = "Enter your email",
  error,
  label = "Email Address",
  disabled = false,
  onEmailChange,
}) {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    // Send email to parent
    if (onEmailChange) {
      onEmailChange(value);
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="mx-auto">
      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 rounded-md border ${
          email === ""
            ? "border-gray-300"
            : isValid
            ? "border-green-500"
            : "border-red-500"
        }`}
      />

      <div className="h-5">
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {email !== "" &&
          (isValid ? (
            <p className="text-green-600 text-sm">
              ✔ Valid Email
            </p>
          ) : (
            <p className="text-red-600 text-sm">
              Please write a proper email address.
            </p>
          ))}
      </div>
    </div>
  );
}

export default EmailInput;