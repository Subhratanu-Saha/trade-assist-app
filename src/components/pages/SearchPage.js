import React, { useState } from "react";
import SearchBar from "../search/searchBar";
import NewCustomerButton from "../search/NewCustomerButton";

// import CustomerRecord from "../components/customer/CustomerRecord";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 shadow-2xl p-6 space-y-6">

        {/* Search Bar */}
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Customer Record */}
        {/* Uncomment after Friend 2's PR is merged */}

        {/*
        <CustomerRecord customer={customer} />
        */}

        {/* Temporary Placeholder */}
        <div className="w-full rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center text-white">
          Customer Record 
          <br />
          <span className="text-sm text-slate-400">
            
          </span>
        </div>

        {/* New Customer Button */}
        <NewCustomerButton />

      </div>
    </div>
  );
};

export default SearchPage;