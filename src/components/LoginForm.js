import React, { useState } from "react";
import EmailInput from "./auth/EmailInput";
import PasswordInput from "./auth/passwordInput";
import Button from "./Button";
import useAgentLogin from "../hooks/useAgentLogin";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login, loading, error } = useAgentLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result) {
      console.log("Login Successful");
      console.log(result);

      setLoginSuccess(true);

    }
  };

  if (loginSuccess) {
    return (
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Login Successful
        </h2>

        <p className="mt-3 text-gray-600">
          Next component will be rendered here.
        </p>
      </div>
    );
  }

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