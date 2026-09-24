import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import CustomerRecord from "../CustomerRecord";
import Purchase from "../purchase";
import { useCustomer } from "../../context/CustomerContext";

const CustomerDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("purchase");
  const { customer } = useCustomer();

  if (!customer) {
    return <Navigate to="/search" replace />;
  }

  const customerId =
    customer.customerId ||
    customer.customer_id ||
    customer.customerid ||
    customer.customerID ||
    customer.id;

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

        {/* Customer Record */}
        <div className="w-full max-w-xl">
          <CustomerRecord customer={customer} />
        </div>

        {/* Tabs + Details */}
        <div className="w-full max-w-xl">

          {/* Tabs */}
          <div className="flex w-full border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-gray-800 text-gray-800"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4 w-full rounded-lg bg-white p-5 shadow-sm">

            {/* Purchase */}
            {activeTab === "purchase" && (
              <Purchase customerId={customerId} />
            )}

            {/* Case */}
            {activeTab === "case" && (
              <div className="relative border border-dashed border-gray-300 p-6 pt-16 text-center">
                <button
                  type="button"
                  className="absolute right-4 top-4 rounded-md bg-[#0A2947] px-3 py-2 text-sm font-semibold text-white"
                >
                  + New Case
                </button>
                <p className="text-sm text-gray-500">
                  No case details available.
                </p>
              </div>
            )}

            {/* Fund */}
            {activeTab === "fund" && (
              <div className="border border-dashed border-gray-300 p-6 text-center">
                <p className="text-sm text-gray-500">
                  No fund details available.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetailsPage;