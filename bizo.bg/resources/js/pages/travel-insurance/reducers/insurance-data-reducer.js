import { produce } from "immer";

export const initialInsuranceData = {
    priceData: null,
    offerData: null,
    policyData: null,
};

export const insuranceDataReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_PRICE_DATA":
                draft.priceData = action.payload;
                break;
            case "SET_OFFER_DATA":
                draft.offerData = action.payload;
                break;
            case "SET_POLICY_DATA":
                draft.policyData = action.payload;
                break;
            case "RESET_POLICY_DATA":
                draft.policyData = null;
                break;
            case "RESET_PRICE_AND_OFFER_DATA":
                draft.priceData = null;
                draft.offerData = null;
                break;
            case "RESET_INSURANCE_DATA":
                return initialInsuranceData;
            default:
                break;
        }
    });
};
