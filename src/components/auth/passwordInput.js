import React, { useState } from "react";
import "./passwordInput.css";
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
    <div className="password-input-container">
      <label htmlFor="password" className="password-label">
        Password
      </label>

      <div className="password-wrapper">
        <input
          id="password"
          className="password-input"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />

        <button
          type="button"
          className="toggle-password-btn"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <img
            className="password-icon"
            src={showPassword ? eyeClosed : eyeOpen}
            alt={showPassword ? "Hide Password" : "Show Password"}
          />
        </button>
      </div>

      {error && <p className="password-error">{error}</p>}
    </div>
  );
};

export default PasswordInput;