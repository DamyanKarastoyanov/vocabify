import { createContext, useContext } from "react";

const InsuranceDataContext = createContext({
    step: 1,
    vehicleData: null,
    setVehicleData: () => {},
    offerData: null,
    setOfferData: () => {},
    payloadOffer: null,
    setPayloadOffer: () => {},
    additionalFields: {
        calculatePriceAdditionalFields: null,
        insuredAdditionalFields: null,
    },
    setAdditionalFields: () => {},
    setCalculatePriceAdditionalFields: () => {},
    setInsuredAdditionalFields: () => {},
    policyData: null,
    setPolicyData: () => {},
    calculationId: null,
    setCalculationId: () => {},
});

const useInsuranceDataContext = () => useContext(InsuranceDataContext);

export { InsuranceDataContext, useInsuranceDataContext };
