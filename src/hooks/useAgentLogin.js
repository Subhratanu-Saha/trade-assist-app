import { useState } from "react";
import { saveUserSession } from "../utils/sessionStorage";

const useAgentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();
      const isSuccessfulLogin = response.ok;

      if (!isSuccessfulLogin) {
        throw new Error(result?.message || "Login failed.");
      }

      const sessionPayload = saveUserSession({
        email,
        ...(result || {}),
      });

      setData(sessionPayload);
      return sessionPayload;
    } catch (caughtError) {
      const message =
        caughtError?.message || "Something went wrong while logging in.";
      setError(message);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    data,
  };
};

export default useAgentLogin;
