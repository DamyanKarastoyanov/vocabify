import { produce } from "immer";

export const initialValidity = {
    isCalculatePriceValid: false,
    isInsuredPersonsValid: false,
    payment: false,
};

export const validityReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_CALCULATE_PRICE_VALID":
                draft.isCalculatePriceValid = action.payload;
                break;
            case "SET_INSURED_PERSONS_VALID":
                draft.isInsuredPersonsValid = action.payload;
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
