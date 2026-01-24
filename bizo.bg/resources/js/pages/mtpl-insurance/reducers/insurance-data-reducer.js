import { produce } from "immer";

export const initialInsuranceData = {
    vehicleData: null,
    offerData: null,
    payloadOffer: null,
    additionalFields: {
        calculatePriceAdditionalFields: null,
        insuredAdditionalFields: null,
    },
    policyData: null,
    calculationId: null,
};

export const insuranceDataReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_VEHICLE_DATA":
                draft.vehicleData = action.payload;
                break;
            case "SET_OFFER_DATA":
                draft.offerData = action.payload;
                break;
            case "SET_PAYLOAD_OFFER":
                draft.payloadOffer = action.payload;
                break;
            case "SET_ADDITIONAL_FIELDS":
                draft.additionalFields = action.payload;
                break;
            case "SET_CALCULATE_PRICE_ADDITIONAL_FIELDS":
                draft.additionalFields.calculatePriceAdditionalFields =
                    action.payload;
                break;
            case "SET_INSURED_ADDITIONAL_FIELDS":
                draft.additionalFields.insuredAdditionalFields = action.payload;
                break;
            case "SET_POLICY_DATA":
                draft.policyData = action.payload;
                break;
            case "SET_CALCULATION_ID":
                draft.calculationId = action.payload;
                break;
            case "RESET_INSURANCE_DATA":
                return initialInsuranceData;
            default:
                break;
        }
    });
};
