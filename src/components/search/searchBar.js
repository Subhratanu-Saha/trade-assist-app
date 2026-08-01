import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Search Customer by Email"
          className="w-full rounded-2xl py-3 pl-5 pr-14 outline-none transition-all duration-200 placeholder:text-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]"
          style={{
            backgroundColor: "#D3D4C0",
            border: "2px solid #8B5E3C",
            color: "#0A2947",
          }}
        />

        <button
          type="button"
          onClick={onSearch}
          aria-label="Search Customer"
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            color: "#8B5E3C",
          }}
        >
          <FiSearch size={22} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;