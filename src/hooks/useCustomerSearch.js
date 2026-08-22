import { useState } from "react";

const useCustomerSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseCode, setResponseCode] = useState(null);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://trade-assist-api.onrender.com";

  const searchCustomer = async (searchText) => {
    setLoading(true);
    setError("");
    setResponseCode(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/customers?email=${encodeURIComponent(searchText)}`
      );

      const result = await response.json();
      setResponseCode(response.status);

      if (!response.ok) {
        setError(result?.message || "Something went wrong.");
        return null;
      }

      const match = result?.data?.[0];

      if (!match) {
        setResponseCode(404);
        return null;
      }

      // Map backend field names to what CustomerRecord expects
      return {
        name: match.name,
        email: match.emailaddr,
        phone: match.contactnum,
      };
    } catch (caughtError) {
      setError(caughtError?.message || "Something went wrong while searching.");
      setResponseCode(500);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchCustomer, loading, error, responseCode };
};

export default useCustomerSearch;