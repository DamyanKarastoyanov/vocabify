import { createContext, useContext } from "react";

const ValidityContext = createContext({
    isCalculatePriceValid: false,
    setIsCalculatePriceValid: () => {},
    isPropertyDetailsValid: false,
    setIsPropertyDetailsValid: () => {},
    isPolicyHolderValid: false,
    setIsPolicyHolderValid: () => {},
    isBeneficiaryValid: false,
    setIsBeneficiaryValid: () => {},
    isPaymentValid: false,
    setIsPaymentValid: () => {},
    resetFormData: () => {},
});

const useValidityContext = () => useContext(ValidityContext);

export { ValidityContext, useValidityContext };
