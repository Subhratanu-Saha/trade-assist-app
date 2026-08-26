import React from "react";
import { Link } from "react-router-dom";
  
const CustomerRecord = ({ customer }) => {
  if (!customer) {
    return (
      <div className="flex min-h-40 w-full max-w-xl items-center justify-center rounded-3xl border border-[#D3D4C0] bg-[#F3E4C9] p-10 text-[#0A2947] shadow-lg">
        Loading...
      </div>
    );
  }

  const customerPath = `/customer/${encodeURIComponent(customer.customerid)}`;
  const rememberCustomer = () => {
    window.sessionStorage.setItem("selectedCustomer", JSON.stringify(customer));
  };

  const details = [
    {
      label: "Phone Number",
      value: customer.contactnum,
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6.6 4.8h10.8a1.8 1.8 0 0 1 1.8 1.8v10.8a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8V6.6a1.8 1.8 0 0 1 1.8-1.8Z" />
          <path d="M6.6 7.8h10.8" strokeLinecap="round" />
          <path d="M9 15.6h6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Email Address",
      value: customer.emailaddr,
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
          <path
            d="M4.5 8 12 13.5 19.5 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <Link
      to={customerPath}
      state={{ customer }}
      onClick={rememberCustomer}
      className="block w-full max-w-xl overflow-hidden rounded-3xl border border-[#D3D4C0] bg-[#0A2947] shadow-2xl transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#F3E4C9]"
    >
      <div className="h-2 w-full bg-gradient-to-r from-[#8B5E3C] via-[#D3D4C0] to-[#F3E4C9]" />

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D3D4C0]">
          Customer Record
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[#F3E4C9] underline">
          {customer.name || "Unnamed Customer"} 
        </h2>

        <div className="mt-6 space-y-4">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-[#8B5E3C]/30 bg-[#F3E4C9] p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5E3C] text-[#F3E4C9]">
                {item.icon}
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[#8B5E3C]">
                  {item.label}
                </p>

                <p className="mt-1 text-lg font-semibold text-[#0A2947]">
                  {item.value || "Not Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default CustomerRecord;