import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailInput from "./auth/EmailInput";
import PasswordInput from "./auth/passwordInput";
import Button from "./Button";
import useAgentLogin from "../hooks/useAgentLogin";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();
  const { setAuthenticatedEmail } = useAuth();
  const { login, loading, error, clearError } = useAgentLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setValidationError("Please enter valid email ID and password");
      return;
    }

    setValidationError("");

    const result = await login(email, password);

    if (result) {
      console.log("Login Successful");
      console.log(result);

      setAuthenticatedEmail(email);
      navigate("/search", { replace: true });
    }
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-slate-900 shadow-2xl py-8 px-4">
      <style>{`
        .login-form-inputs > div {
          width: 100% !important;
          max-width: 20rem !important;
        }
      `}</style>

      <div className="flex justify-center">
        <div className="bg-white rounded-3xl shadow-lg w-full px-8 py-8 min-h-96">
          <form
            onSubmit={handleSubmit}
            className="space-y-3 mx-auto w-full login-form-inputs"
          >
            <EmailInput
              onEmailChange={(value) => {
                setEmail(value);
                setValidationError("");
                clearError();
              }}
            />

            <PasswordInput
              onPasswordChange={(value) => {
                setPassword(value);
                setValidationError("");
                clearError();
              }}
            />

            <div style={{ marginTop: "25px" }}>
              <Button
                label={loading ? "Logging in..." : "Login"}
                type="submit"
                disabled={loading}
              />
            </div>

            {(validationError || error) && (
              <p className="text-red-600 text-center text-sm"
              style={{ marginTop: "15px" }}>
                {validationError || "Userid and password doesn't matched"}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;