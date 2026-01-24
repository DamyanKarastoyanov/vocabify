import { produce } from "immer";

export const initialValidity = {
    calculatePrice: false,
    propertyDetails: false,
    policyHolder: false,
    beneficiary: false,
    payment: false,
};

export const validityReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_CALCULATE_PRICE_VALID":
                draft.calculatePrice = action.payload;
                break;
            case "SET_PROPERTY_DETAILS_VALID":
                draft.propertyDetails = action.payload;
                break;
            case "SET_POLICY_HOLDER_VALID":
                draft.policyHolder = action.payload;
                break;
            case "SET_BENEFICIARY_VALID":
                draft.beneficiary = action.payload;
                break;
            case "SET_PAYMENT_VALID":
                draft.payment = action.payload;
                break;
            case "RESET_VALIDITY":
                return initialValidity;
            default:
                break;
        }
    });
};
