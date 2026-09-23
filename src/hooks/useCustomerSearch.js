import { useRef, useState } from "react";

const useCustomerSearch = () => {
  const [customer, setCustomer] = useState(null);
  const [responseCode, setResponseCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const requestInProgress = useRef(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const searchCustomer = async (email) => {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;
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
      requestInProgress.current = false;
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