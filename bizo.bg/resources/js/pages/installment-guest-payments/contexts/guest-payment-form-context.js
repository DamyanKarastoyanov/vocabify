import { createContext, useContext } from "react";

const GuestPaymentFormContext = createContext({
    paymentFormData: null,
    setPaymentFormData: () => {},
    lastVisitedStep: 1,
    setLastVisitedStep: () => {},
});

const useGuestPaymentFormContext = () => useContext(GuestPaymentFormContext);

export { GuestPaymentFormContext, useGuestPaymentFormContext };
