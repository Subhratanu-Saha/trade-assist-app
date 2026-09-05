import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import CustomerRecord from "../CustomerRecord";
import { useCustomer } from "../../context/CustomerContext";

const CustomerDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("purchase");
  const { customer } = useCustomer();

  if (!customer) {
    return <Navigate to="/search" replace />;
  }

  const tabs = [
    { id: "purchase", label: "Purchase" },
    { id: "case", label: "Case" },
    { id: "fund", label: "Fund" },
  ];

  return (
    <section
      aria-label="Customer details"
      className="flex min-h-screen w-full items-center justify-center bg-[#f3e4c9] px-4 py-6"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2">
        <div className="w-full max-w-xl">
          <CustomerRecord customer={customer} />
        </div>

        <div className="w-full overflow-hidden rounded-[1.25rem] border-2 border-[#d3d4c0] bg-[#fffdf7] shadow-xl">
          <div className="px-5 pt-5 sm:px-7">
            <div
              className="flex gap-1 border-b border-[#d3d4c0]"
              role="tablist"
              aria-label="Customer record types"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-details`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors outline-none focus:outline-none focus:ring-0 ${
                    activeTab === tab.id
                      ? "border-[#8b5e3c] text-[#18242b]"
                      : "border-transparent text-[#687078] hover:text-[#18242b]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div id={`${activeTab}-details`} role="tabpanel" className="py-6">
              <div className="border border-dashed border-[#b7b9a8] bg-[#f7f7f1] px-4 py-6 text-center">
                <p className="text-sm text-[#687078]">
                  No {activeTab} details available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetailsPage;