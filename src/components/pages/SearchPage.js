import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import SearchBar from "../search/searchBar";
import NewCustomerButton from "../search/NewCustomerButton";
import CustomerRecord from "../CustomerRecord";
import useCustomerSearch from "../../hooks/useCustomerSearch";
import { useCustomer } from "../../context/CustomerContext";
import { useAuth } from "../../context/AuthContext";


const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const { searchCustomer, loading, error, customer, responseCode, } = useCustomerSearch();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { selectCustomer } = useCustomer();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (responseCode === 200 && customer) {
      selectCustomer(customer);
    }
  }, [responseCode, customer, selectCustomer]);
  // Backend Response States

  const handleSearch = async () => {
    // =====================================================
    // TODO:
    // Integrate Customer Search API after backend is merged.
    //
    // Expected Responses:
    //
    // 200 -> Show CustomerRecord
    // 404 -> Show NewCustomerButton
    // 400 -> Show Error
    // 500 -> Show Error
    // =====================================================


    const email = searchText.trim();

    // Validate email input
    if (!email) {
      return;
    }



    await searchCustomer(email);
  };


  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-6"
      style={{ backgroundColor: "#F3E4C9" }}
    >
      <button
        type="button"
        onClick={handleLogout}
        className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-md border border-[#0A2947]/30 bg-[#F3E4C9]/80 px-4 py-2 text-sm font-normal text-[#8B5E3C] transition hover:bg-[#D3D4C0] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:ring-offset-2 focus:ring-offset-[#F3E4C9]"
      >
        Logout
        <FiLogOut size={16} aria-hidden="true" />
      </button>

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
          <Link
            to="/customer"
            onClick={() => selectCustomer(customer)}
            aria-label={`View details for ${customer.name || "customer"}`}
            className="block rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#F3E4C9]"
          >
            <CustomerRecord customer={customer} />
          </Link>
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
              backgroundColor: "#F3E4C9",
              border: "2px solid #8B5E3C",
              color: "#0A2947",
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