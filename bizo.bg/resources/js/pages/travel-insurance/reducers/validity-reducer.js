import { produce } from "immer";

export const initialValidity = {
    calculatePrice: false,
    InsuredPersons: false,
    payment: false,
};

export const validityReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_CALCULATE_PRICE_VALID":
                draft.calculatePrice = action.payload;
                break;
            case "SET_INSURED_PERSONS_VALID":
                draft.InsuredPersons = action.payload;
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
