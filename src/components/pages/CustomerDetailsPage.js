import { Navigate, useLocation, useParams } from "react-router-dom";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString();
};

const getStoredCustomer = () => {
  try {
    const storedCustomer = window.sessionStorage.getItem("selectedCustomer");
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  } catch {
    return null;
  }
};

const CustomerDetailsPage = () => {
  const { customerId } = useParams();
  const { state } = useLocation();
  const customer = state?.customer || getStoredCustomer();

  if (!customer) {
    return <Navigate to="/search" replace />;
  }

  const details = [
    ["Customer ID", customer.customerid || customerId],
    ["Name", customer.name],
    ["Email Address", customer.emailaddr],
    ["Phone Number", customer.contactnum],
    ["Date of Birth", formatDate(customer.dob)],
    ["Gender", customer.gender],
    ["Address", customer.address],
    ["Active Status", customer.isactive === true ? "Active" : customer.isactive === false ? "Inactive" : "Not available"],
    ["Created At", formatDate(customer.sysonboarddt)],
    ["Last Modified", formatDate(customer.syslastmodifieddt)],
  ];

  return (
    <div className="min-h-screen bg-[#F3E4C9] px-4 py-8">
      <main className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#D3D4C0] bg-[#0A2947] shadow-2xl">
        <div className="h-2 w-full bg-gradient-to-r from-[#8B5E3C] via-[#D3D4C0] to-[#F3E4C9]" />

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D3D4C0]">
            Customer Record
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#F3E4C9]">
            {customer.name || "Unnamed Customer"}
          </h1>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#8B5E3C]/30 bg-[#F3E4C9] p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-widest text-[#8B5E3C]">
                  {label}
                </dt>
                <dd className="mt-2 break-words text-lg font-semibold text-[#0A2947]">
                  {value || "Not available"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailsPage;