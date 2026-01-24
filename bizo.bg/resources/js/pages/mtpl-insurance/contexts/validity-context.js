import { createContext, useContext } from "react";

const ValidityContext = createContext({
    isVehicleDataValid: false,
    setIsVehicleDataValid: () => {},
    isCalculatePriceValid: false,
    setIsCalculatePriceValid: () => {},
    isOfferSelected: false,
    setIsOfferSelected: () => {},
    isInsuredPersonValid: false,
    setIsInsuredPersonValid: () => {},
    isPaymentValid: false,
    setIsPaymentValid: () => {},
});

const useValidityContext = () => useContext(ValidityContext);

export { ValidityContext, useValidityContext };
