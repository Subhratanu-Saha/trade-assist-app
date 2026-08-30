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
  const navigate = useNavigate();
  const { setEmail: setAuthenticatedEmail } = useAuth();
  const { login, loading, error } = useAgentLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result) {
      console.log("Login Successful");
      console.log(result);
      setAuthenticatedEmail(email);
      setEmail(true);
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
        <div className="bg-white rounded-3xl shadow-lg w-full px-6 py-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5 mx-auto w-full login-form-inputs"
          >
            <EmailInput
              onEmailChange={setEmail}
            />

            <PasswordInput
              onPasswordChange={setPassword}
            />

            {error && (
              <p className="text-red-600 text-center text-sm">
                Userid and password doesn't matched
              </p>
            )}

            <Button
              label={loading ? "Logging in..." : "Login"}
              type="submit"
              disabled={loading}
            />

          </form>

        </div>
      </div>
    </div>
  );
}

export default LoginForm;