import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import CustomerRecord from "../CustomerRecord";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return String(value);
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? formatValue(value)
    : date.toLocaleDateString();
};

const DetailRows = ({ rows }) => (
  <dl className="grid gap-4 sm:grid-cols-2">
    {rows.map(({ label, value }) => (
      <div
        key={label}
        className="border-b border-[#d3d4c0] pb-3 last:border-0 sm:last:border-b"
      >
        <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#687078]">
          {label}
        </dt>
        <dd className="mt-1 break-words text-base font-medium text-[#18242b]">
          {formatValue(value)}
        </dd>
      </div>
    ))}
  </dl>
);

const EmptyDetails = ({ label }) => (
  <div className="border border-dashed border-[#b7b9a8] bg-[#f7f7f1] px-4 py-6 text-center">
    <p className="text-sm text-[#687078]">No {label.toLowerCase()} details available.</p>
  </div>
);

const CustomerDetailsPage = ({ customer: customerProp }) => {
  const [activeTab, setActiveTab] = useState("purchase");
  const { state } = useLocation();
  const customer = customerProp || state?.customer;

  if (!customer) {
    return <Navigate to="/search" replace />;
  }

  const purchase = customer.purchase || customer.purchases;
  const tabs = [
    { id: "purchase", label: "Purchase" },
    { id: "case", label: "Case" },
    { id: "fund", label: "Fund" },
  ];

  const renderDetails = () => {
    if (activeTab === "purchase") {
      if (!purchase || (Array.isArray(purchase) && purchase.length === 0)) {
        return <EmptyDetails label="purchase" />;
      }

      const purchases = Array.isArray(purchase) ? purchase : [purchase];
      return (
        <div className="space-y-5">
          {purchases.map((item, index) => (
            <DetailRows
              key={item.purchaseid || item.id || index}
              rows={[
                { label: "Product", value: item.productitem },
                { label: "Transaction ID", value: item.transactionid },
                { label: "Payment", value: item.payment },
                { label: "Purchased", value: formatDate(item.purchasedt) },
              ]}
            />
          ))}
        </div>
      );
    }

    const records = customer[activeTab] || customer[`${activeTab}s`];
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return <EmptyDetails label={activeTab} />;
    }

    const record = Array.isArray(records) ? records[0] : records;
    return (
      <DetailRows
        rows={Object.entries(record).map(([label, value]) => ({
          label: label.replace(/([A-Z])/g, " $1").replace(/_/g, " "),
          value,
        }))}
      />
    );
  };

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
              {renderDetails()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetailsPage;