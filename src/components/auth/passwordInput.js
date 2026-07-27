import React, { useState } from "react";
import eyeOpen from "../../assets/eye open.png";
import eyeClosed from "../../assets/eye closed.svg";

const PasswordInput = ({
  placeholder = "Enter your password",
  disabled = false,
  onPasswordChange,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    // Send password to parent component
    if (onPasswordChange) {
      onPasswordChange(value);
    }

    setError(validatePassword(value));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-80 mx-auto my-5">
      <label className="block mb-2 font-semibold text-black">
        Password
      </label>

      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2.5 pr-11 border border-gray-300 rounded-lg box-border bg-white text-gray-900 placeholder-gray-400"
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

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;