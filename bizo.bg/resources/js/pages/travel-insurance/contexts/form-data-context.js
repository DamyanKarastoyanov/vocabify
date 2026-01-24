import { createContext, useContext } from "react";

const FormDataContext = createContext({
    calculatePriceFormData: null,
    setCalculatePriceFormData: () => {},
    InsuredPersonsFormData: null,
    setInsuredPersonsFormData: () => {},
    paymentFormData: null,
    setPaymentFormData: () => {},
    payingInfo: null,
    setPayingInfo: () => {},
    lastVisitedStep: 1,
    setLastVisitedStep: () => {},
    resetFormData: () => {},
});

const useFormDataContext = () => useContext(FormDataContext);

export { FormDataContext, useFormDataContext };
