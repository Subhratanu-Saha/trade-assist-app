import React, { useState } from "react";
import SearchBar from "../search/searchBar";
import NewCustomerButton from "../search/NewCustomerButton";
import CustomerRecord from "../CustomerRecord";
import useCustomerSearch from "../../hooks/useCustomerSearch";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const [customer, setCustomer] = useState(null);

  const { searchCustomer, loading, error, responseCode } = useCustomerSearch();

  const handleSearch = async () => {
    const result = await searchCustomer(searchText);
    setCustomer(result);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ backgroundColor: "#F3E4C9" }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-6 border"
        style={{
          backgroundColor: "#0A2947",
          borderColor: "#8B5E3C",
        }}
      >
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
        />

        {loading && (
          <div className="text-center text-lg font-semibold" style={{ color: "#F3E4C9" }}>
            Searching...
          </div>
        )}

        {responseCode === 200 && customer && (
          <CustomerRecord customer={customer} />
        )}

        {responseCode === 404 && <NewCustomerButton />}

        {(responseCode === 400 || responseCode === 500) && (
          <div
            className="rounded-xl p-4 text-center font-medium"
            style={{ backgroundColor: "#D3D4C0", border: "2px solid #8B5E3C", color: "#0A2947" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;