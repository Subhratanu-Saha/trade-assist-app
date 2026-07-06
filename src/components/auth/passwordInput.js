import React, { useState } from "react";
import eyeOpen from "../../assets/eye open.png";
import eyeClosed from "../../assets/eye closed.svg";

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Enter your password",
  error,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-80 mx-auto my-5">
      <div className="relative">
        <input
          id="password"
          className="w-full px-3 py-2.5 pr-11 border border-gray-300 rounded-lg box-border bg-white text-gray-900 placeholder-gray-400"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />

        <button
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <img
            className="w-5 h-5"
            src={showPassword ? eyeClosed : eyeOpen}
            alt={showPassword ? "Hide Password" : "Show Password"}
          />
        </button>
      </div>

      {error && <p className="text-red-500 mt-1.5 text-sm">{error}</p>}
    </div>
  );
};

export default PasswordInput;