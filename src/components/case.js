import React, { useEffect, useState } from "react";
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://trade-assist-api.onrender.com";

const fetchCaseData = async (customerId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/cases/list?customerId=${encodeURIComponent(
      customerId
    )}`
  );

  if (!response.ok) {
    throw new Error(`Case API failed: ${response.status}`);
  }

  return response.json();
};

function Case({ customerId }) {
  const [openCases, setOpenCases] = useState([]);
  const [closedCases, setClosedCases] = useState([]);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    const loadCases = async () => {
      try {
        setLoading(true);
        setError("");

        if (!customerId) {
          if (isCurrentRequest) {
            setOpenCases([]);
            setClosedCases([]);
            setError("Customer ID not found.");
            setLoading(false);
          }
          return;
        }

        const result = await fetchCaseData(customerId);

        const open = Array.isArray(result?.data?.open)
          ? result.data.open
          : [];

        const closed = Array.isArray(result?.data?.closed)
          ? result.data.closed
          : [];

        if (isCurrentRequest) {
          setOpenCases(open);
          setClosedCases(closed);
        }
      } catch (err) {
        if (isCurrentRequest) {
          setError("Unable to load case details.");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    loadCases();

    return () => {
      isCurrentRequest = false;
    };
  }, [customerId]);

  const toggleCase = (caseId) => {
    setExpandedCaseId((currentId) =>
      currentId === caseId ? null : caseId
    );
  };

  const CaseAccordion = ({ caseItem, index }) => {
    const caseId = caseItem.caseId || index;
    const isExpanded = expandedCaseId === caseId;

    return (
      <div className="mb-3 overflow-hidden border border-[#8B5E3C] bg-white">
        <button
          type="button"
          onClick={() => toggleCase(caseId)}
          className="flex w-full items-center justify-between bg-[#f8f8f2] px-4 py-4 text-left transition hover:bg-[#f1f1e8]"
          aria-expanded={isExpanded}
        >
          <span className="font-medium text-[#0A2947]">
            Case ID {caseItem.caseId}
          </span>

          <span className="text-lg text-[#0A2947]">
            {isExpanded ? "▲" : "▼"}
          </span>
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-6 text-center text-gray-500">
        Loading case details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Open Cases */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#0A2947]">
          Open Cases
        </h2>

        {openCases.length === 0 ? (
          <div className="mb-6 border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
            No open cases available.
          </div>
        ) : (
          <div className="mb-6">
            {openCases.map((caseItem, index) => (
              <CaseAccordion
                key={caseItem.caseId || index}
                caseItem={caseItem}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Closed Cases */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#0A2947]">
          Closed Cases
        </h2>

        {closedCases.length === 0 ? (
          <div className="border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
            No closed cases available.
          </div>
        ) : (
          <div>
            {closedCases.map((caseItem, index) => (
              <CaseAccordion
                key={caseItem.caseId || index}
                caseItem={caseItem}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Case;