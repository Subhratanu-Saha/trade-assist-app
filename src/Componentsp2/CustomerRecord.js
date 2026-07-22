import React from "react";

const CustomerRecord = ({ customer }) => {
  if (!customer) {
    return (
      <div className="flex min-h-40 w-full max-w-xl items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-slate-500 shadow-lg">
        Loading...
      </div>
    );
  }

  const details = [
    {
      label: "Phone Number",
      value: customer.phone,
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M6.6 4.8h10.8a1.8 1.8 0 0 1 1.8 1.8v10.8a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8V6.6a1.8 1.8 0 0 1 1.8-1.8Z" />
          <path d="M6.6 7.8h10.8" strokeLinecap="round" />
          <path d="M9 15.6h6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Email Address",
      value: customer.email,
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
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
    <section className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500" />

      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Customer Record
        </p>

        <h2 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
          {customer.name || "Unnamed Customer"}
        </h2>

        <div className="mt-6 space-y-4">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-white/5 p-4 transition-colors duration-200 hover:bg-white/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-base font-semibold text-white">
                  {item.value || "Not Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerRecord;