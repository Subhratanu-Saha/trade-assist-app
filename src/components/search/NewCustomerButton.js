import React from "react";

const NewCustomerButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl py-3 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-95 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2"
      style={{
        backgroundColor: "#8B5E3C",
        color: "#F3E4C9",
        border: "2px solid #D3D4C0",
      }}
    >
      + New Customer
    </button>
  );
};

export default NewCustomerButton;