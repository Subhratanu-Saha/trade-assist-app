import { useState } from "react";

const useAgentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  // Dynamic API Base URL
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://trade-assist-api.onrender.com";

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth`, {
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

      if (!response.ok) {
        throw new Error(result?.message || "Login failed.");
      }

      setData(result);
      return result;
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