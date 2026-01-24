import { createContext, useContext } from "react";

const GuestPaymentValidityContext = createContext({
    isPaymentValid: false,
    setIsPaymentValid: () => {},
});

const useGuestPaymentValidityContext = () =>
    useContext(GuestPaymentValidityContext);

export { GuestPaymentValidityContext, useGuestPaymentValidityContext };
