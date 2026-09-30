import { createContext, useCallback, useContext, useState } from "react";

const CustomerContext = createContext(null);
const SELECTED_CUSTOMER_KEY = "selectedCustomer";

const getStoredCustomer = () => {
    const storedCustomer = sessionStorage.getItem(SELECTED_CUSTOMER_KEY);

    if (!storedCustomer) {
        return null;
    }

    try {
        return JSON.parse(storedCustomer);
    } catch (error) {
        sessionStorage.removeItem(SELECTED_CUSTOMER_KEY);
        return null;
    }
};

export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState(getStoredCustomer);

    const selectCustomer = useCallback((customerData) => {
        setCustomer(customerData);
        sessionStorage.setItem(
            SELECTED_CUSTOMER_KEY,
            JSON.stringify(customerData)
        );
    }, []);

    const clearCustomer = useCallback(() => {
        setCustomer(null);
        sessionStorage.removeItem(SELECTED_CUSTOMER_KEY);
    }, []);

    return (
        <CustomerContext.Provider
            value={{
                customer,
                selectCustomer,
                clearCustomer,
            }}
        >
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    return useContext(CustomerContext);
};