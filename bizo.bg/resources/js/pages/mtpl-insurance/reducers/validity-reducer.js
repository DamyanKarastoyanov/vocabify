import { produce } from "immer";

export const initialValidity = {
    isVehicleDataValid: false,
    isCalculatePriceValid: false,
    isOfferSelected: false,
    isInsuredPersonValid: false,
    isPaymentValid: false,
};

export const validityReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_VEHICLE_DATA_VALID":
                draft.isVehicleDataValid = action.payload;
                break;
            case "SET_CALCULATE_PRICE_VALID":
                draft.isCalculatePriceValid = action.payload;
                break;
            case "SET_OFFER_SELECTED":
                draft.isOfferSelected = action.payload;
                break;
            case "SET_INSURED_PERSON_VALID":
                draft.isInsuredPersonValid = action.payload;
                break;
            case "SET_PAYMENT_VALID":
                draft.isPaymentValid = action.payload;
                break;
            case "RESET_VALIDITY":
                return initialValidity;
            default:
                break;
        }
    });
};
