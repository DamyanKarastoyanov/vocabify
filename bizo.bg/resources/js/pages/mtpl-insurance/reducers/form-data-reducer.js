import { produce } from "immer";

export const initialFormData = {
    vehicleDataFormData: null,
    calculatePriceFormData: null,
    selectedOffer: null,
    insuredPersonFormData: null,
    paymentFormData: null,
};

export const formDataReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_VEHICLE_DATA":
                draft.vehicleDataFormData = action.payload;
                break;
            case "SET_CALCULATE_PRICE_DATA":
                draft.calculatePriceFormData = action.payload;
                break;
            case "SET_SELECTED_OFFER":
                draft.selectedOffer = action.payload;
                break;
            case "SET_INSURED_PERSON_DATA":
                draft.insuredPersonFormData = action.payload;
                break;
            case "SET_PAYMENT_DATA":
                draft.paymentFormData = action.payload;
                break;
            case "RESET_FORM_DATA":
                return initialFormData;
            default:
                return state;
        }
    });
};
