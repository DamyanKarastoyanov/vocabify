import { produce } from "immer";

export const initialFormData = {
    calculatePriceFormData: null,
    insuredPersonsFormData: null,
    payment: null,
};

export const formDataReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_CALCULATE_PRICE_DATA":
                draft.calculatePriceFormData = action.payload;
                break;
            case "SET_INSURED_PERSONS_DATA":
                draft.insuredPersonsFormData = action.payload;
                break;
            case "SET_PAYMENT_DATA":
                draft.payment = action.payload;
                break;
            case "RESET_FORM_DATA":
                return initialFormData;
            default:
                return state;
        }
    });
};
