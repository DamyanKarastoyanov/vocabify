import { createContext, useContext } from "react";

const InsuranceDataContext = createContext({
    step: 1,
    priceData: null,
    setPriceData: () => {},
    offerData: null,
    setOfferData: () => {},
    policyData: null,
    setPolicyData: () => {},
});

const useInsuranceDataContext = () => useContext(InsuranceDataContext);

export { InsuranceDataContext, useInsuranceDataContext };
