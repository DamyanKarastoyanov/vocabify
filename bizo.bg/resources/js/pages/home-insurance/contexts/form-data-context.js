import { createContext, useContext } from "react";

const FormDataContext = createContext({
    calculatePriceFormData: null,
    setCalculatePriceFormData: () => {},
    propertyDetailsFormData: null,
    setPropertyDetailsFormData: () => {},
    policyHolderFormData: null,
    setPolicyHolderFormData: () => {},
    paymentFormData: null,
    setPaymentFormData: () => {},
    payingInfo: null,
    setPayingInfo: () => {},
    lastVisitedStep: 1,
    setLastVisitedStep: () => {},
    isThirdPartyBeneficiary: false,
    setIsThirdPartyBeneficiary: () => {},
    dropBeneficiaryData: () => {},
    resetFormData: () => {},
});

const useFormDataContext = () => useContext(FormDataContext);

export { FormDataContext, useFormDataContext };
