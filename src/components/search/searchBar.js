import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Customer Search by Email"
          className="w-full rounded-2xl border border-slate-600 bg-slate-800 py-3 pl-5 pr-14 text-white placeholder-slate-400 outline-none transition duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
        />

        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <FiSearch size={22} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;