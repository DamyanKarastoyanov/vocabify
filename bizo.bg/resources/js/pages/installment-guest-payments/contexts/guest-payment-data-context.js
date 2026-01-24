import { createContext, useContext } from "react";

const GuestPaymentDataContext = createContext({
    offerData: null,
    setOfferData: () => {},
});

const useGuestPaymentDataContext = () => useContext(GuestPaymentDataContext);

export { GuestPaymentDataContext, useGuestPaymentDataContext };
