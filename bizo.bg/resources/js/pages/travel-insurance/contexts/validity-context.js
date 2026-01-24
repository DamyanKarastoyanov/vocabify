import { createContext, useContext } from "react";

const ValidityContext = createContext({
    isCalculatePriceValid: false,
    setIsCalculatePriceValid: () => {},
    isInsuredPersonsValid: false,
    setIsInsuredPersonsValid: () => {},
    isPaymentValid: false,
    setIsPaymentValid: () => {},
});

const useValidityContext = () => useContext(ValidityContext);

export { ValidityContext, useValidityContext };
