import React, { useState } from "react";

function EmailInput({ value, onChange, placeholder = "Enter your email", error, label, disabled = false }) {
  const [isValid, setIsValid] = useState(false);
  const handleChange = (e) => {
    const value = e.target.value;
    onChange(e);
    const emailParts = value.split("@");

    if (emailParts.length === 2) {
      const userId = emailParts[0];
      const domainParts = emailParts[1].split(".");

      if (domainParts.length === 2) {
        const domain = domainParts[0];
        const subDomain = domainParts[1];

        if (
          userId !== "" &&
          domain !== "" &&
          subDomain !== ""
        ) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="w-96 mx-auto mt-10">
      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        type="email"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-3 rounded-md border ${
          value === ""
            ? "border-gray-300"
            : isValid
            ? "border-green-500"
            : "border-red-500"
        }`}
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}  
      {value !== "" && (isValid ? <p className="text-green-600 mt-2">✔ Valid Email</p> : <p className="text-red-600 mt-2">Please write a proper email address.</p>)} 
</div>
  );
}

export default EmailInput;