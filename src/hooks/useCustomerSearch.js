import { useState } from "react";

const useCustomerSearch = () => {
  const [customer, setCustomer] = useState(null);
  const [responseCode, setResponseCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use localhost backend during local development
  // and Render backend in deployed environment.
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://trade-assist-api.onrender.com";

  const searchCustomer = async (email) => {
    setLoading(true);
    setError("");
    setCustomer(null);
    setResponseCode(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/customers?email=${encodeURIComponent(email)}`
      );

      const data = await response.json();

      setResponseCode(response.status);

      // API returned an error
      if (!response.ok) {
        setError(
          data?.error ||
            data?.message ||
            "Customer search failed."
        );
        return;
      }

      // Customer found
      if (data?.data && data.data.length > 0) {
        setCustomer(data.data[0]);
        return;
      }

      // API returned 200 with no customer
      setResponseCode(404);
    } catch (err) {
      console.error("Customer Search API error:", err);

      setResponseCode(500);
      setError("Unable to connect to Customer Search API.");
    } finally {
      setLoading(false);
    }
  };

  return {
    customer,
    responseCode,
    error,
    loading,
    searchCustomer,
  };
};

export default useCustomerSearch;