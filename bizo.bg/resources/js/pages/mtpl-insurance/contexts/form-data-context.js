import { createContext, useContext } from "react";

const FormDataContext = createContext({
    vehicleDataFormData: null,
    setVehicleDataFormData: () => {},
    calculatePriceFormData: null,
    setCalculatePriceFormData: () => {},
    selectedOffer: null,
    setSelectedOffer: () => {},
    insuredPersonFormData: null,
    setInsuredPersonFormData: () => {},
    paymentFormData: null,
    setPaymentFormData: () => {},
    lastVisitedStep: 1,
    setLastVisitedStep: () => {},
    resetFormData: () => {},
});

const useFormDataContext = () => useContext(FormDataContext);

export { FormDataContext, useFormDataContext };
