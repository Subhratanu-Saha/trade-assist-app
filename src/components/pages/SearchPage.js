import React, { useState } from "react";
import SearchBar from "../search/searchBar";
import NewCustomerButton from "../search/NewCustomerButton";

// Uncomment after Friend 2's PR is merged
// import CustomerRecord from "../customer/CustomerRecord";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");

  // Backend Response States
  const [customer, setCustomer] = useState(null);
  const [responseCode, setResponseCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // =====================================================
    // TODO:
    // Integrate Customer Search API after backend is merged.
    //
    // Expected Response
    //
    // 200 -> Show CustomerRecord
    // 404 -> Show NewCustomerButton
    // 400 -> Show Error
    // 500 -> Show Error
    // =====================================================

    console.log("Customer Search API will be integrated here.");

    // Clear previous search result
    setCustomer(null);
    setResponseCode(null);
    setError("");
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ backgroundColor: "#F3E4C9" }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-6"
        style={{ backgroundColor: "#0A2947" }}
      >
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
        />

        {/* Loading */}

        {loading && (
          <div
            className="text-center text-lg font-semibold"
            style={{ color: "#F3E4C9" }}
          >
            Searching...
          </div>
        )}

        {/* Customer Found */}

        {responseCode === 200 && customer && (
          <>
            {/*
              Friend 2's Component

              <CustomerRecord customer={customer} />
            */}
          </>
        )}

        {/* Customer Not Found */}

        {responseCode === 404 && (
          <NewCustomerButton />
        )}

        {/* Error */}

        {(responseCode === 400 || responseCode === 500) && (
          <div
            className="rounded-xl p-4 text-center font-medium"
            style={{
              backgroundColor: "#D3D4C0",
              border: "2px solid #8B5E3C",
              color: "#8B0000",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;