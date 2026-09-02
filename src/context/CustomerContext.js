import { createContext, useCallback, useContext, useState } from "react";

const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);

    const selectCustomer = useCallback((customerData) => {
        setCustomer(customerData);
    }, []);

    const clearCustomer = useCallback(() => {
        setCustomer(null);
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