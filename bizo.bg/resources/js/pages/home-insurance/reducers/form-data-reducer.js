import { produce } from "immer";

export const initialFormData = {
    calculatePrice: null,
    propertyDetails: null,
    policyHolder: null,
    payment: null,
    isThirdPartyBeneficiary: false,
};

export const formDataReducer = (state, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_CALCULATE_PRICE_DATA":
                draft.calculatePrice = action.payload;
                break;
            case "SET_PROPERTY_DETAILS_DATA":
                draft.propertyDetails = action.payload;
                break;
            case "SET_POLICY_HOLDER_DATA":
                draft.policyHolder = action.payload;
                break;
            case "SET_PAYMENT_DATA":
                draft.payment = action.payload;
                break;
            case "SET_THIRD_PARTY_BENEFICIARY":
                draft.isThirdPartyBeneficiary = action.payload;
                break;
            case "DROP_BENEFICIARY_DATA":
                if (draft.policyHolder) {
                    const { bank, third_party_customer, ...rest } =
                        draft.policyHolder;
                    draft.policyHolder = rest;
                }
                break;
            case "RESET_FORM_DATA":
                return initialFormData;
            default:
                return state;
        }
    });
};
