import { produce } from "immer";

export const initialFormData = {
    calculatePrice: null,
    insuredPersons: null,
    payment: null,
    payingInfo: null,
    lastVisitedStep: 1,
};

export const formDataReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_CALCULATE_PRICE_DATA":
                draft.calculatePrice = action.payload;
                break;
            case "SET_INSURED_PERSONS_DATA":
                draft.insuredPersons = action.payload;
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
