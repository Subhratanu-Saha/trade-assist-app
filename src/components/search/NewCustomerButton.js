import React from "react";

const NewCustomerButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-cyan-500 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-cyan-600 hover:shadow-xl active:scale-95"
    >
      + New Customer
    </button>
  );
};

export default NewCustomerButton;