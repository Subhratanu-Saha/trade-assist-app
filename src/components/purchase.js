import React, { useEffect, useState } from "react";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://trade-assist-api.onrender.com";

const getLastFiveYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

const purchaseRequests = new Map();

const fetchPurchaseData = (customerId) => {
  const existingRequest = purchaseRequests.get(customerId);

  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(
    `${API_BASE_URL}/api/v1/purchase?customerId=${encodeURIComponent(
      customerId
    )}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Purchase API failed: ${response.status}`);
      }

      return response.json();
    })
    .finally(() => {
      if (purchaseRequests.get(customerId) === request) {
        purchaseRequests.delete(customerId);
      }
    });

  purchaseRequests.set(customerId, request);
  return request;
};

function Purchase({ customerId }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = getLastFiveYears();

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError("");

        if (!customerId) {
          if (isCurrentRequest) {
            setPurchases([]);
            setError("Customer ID not found.");
            setLoading(false);
          }
          return;
        }

        const result = await fetchPurchaseData(customerId);
        const purchaseData = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : result?.data && typeof result.data === "object"
          ? [result.data]
          : [];

        if (isCurrentRequest) {
          setPurchases(purchaseData);
        }
      } catch (err) {
        if (isCurrentRequest) {
          setError("Unable to load purchase details.");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    fetchPurchases();

    return () => {
      isCurrentRequest = false;
    };
  }, [customerId]);

  const columns = [
    { key: "purchaseid", label: "Purchase ID", aliases: ["purchaseId"] },
    { key: "productitem", label: "Product Item", aliases: ["productItem"] },
    {
      key: "transactionid",
      label: "Transaction ID",
      aliases: ["transactionId"],
    },
  ];

  const getPurchaseValue = (purchase, column) => {
    const value = [column.key, ...column.aliases]
      .map((key) => purchase[key])
      .find((value) => value !== undefined);

    return value;
  };

  const getPurchaseYear = (purchase) => {
    const rawDate =
      purchase.purchasedt || purchase.purchaseDt || purchase.purchaseDate;

    if (!rawDate) return null;

    const parsedDate = new Date(rawDate);
    return isNaN(parsedDate) ? null : parsedDate.getFullYear();
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return typeof value === "object" ? JSON.stringify(value) : String(value);
  };

  const filteredPurchases = purchases.filter(
    (purchase) => getPurchaseYear(purchase) === selectedYear
  );

  return (
    <div className="w-full border border-[#D3D4C0] bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0A2947]">
          Purchase Details
        </h2>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-[#8B5E3C] bg-white px-3 py-1 text-sm text-[#0A2947]"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-x-auto border border-[#8B5E3C]">
        {loading && (
          <div className="py-6 text-center text-gray-500">
            Loading purchase details...
          </div>
        )}

        {!loading && error && (
          <div className="py-6 text-center text-red-500">{error}</div>
        )}

        {!loading && !error && filteredPurchases.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            No purchase details found.
          </div>
        )}

        {!loading && !error && filteredPurchases.length > 0 && (
          <table className="min-w-full divide-y divide-[#D3D4C0] text-left text-sm text-[#0A2947]">
            <thead className="bg-[#f8f8f2] font-semibold">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="whitespace-nowrap px-4 py-4"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3D4C0]">
              {filteredPurchases.map((purchase, index) => (
                <tr key={purchase.purchaseid || purchase.purchaseId || index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-4 py-4"
                    >
                      {formatValue(getPurchaseValue(purchase, column))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Purchase;