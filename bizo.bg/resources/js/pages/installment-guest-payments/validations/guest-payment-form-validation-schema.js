import * as yup from "yup";

const GuestPaymentFormValidationSchema = yup.object().shape({
    payment_method: yup
        .string()
        .required("Моля, изберете начин на плащане")
        .oneOf(["card", "bank_transfer"], "Невалиден начин на плащане"),
});

export default GuestPaymentFormValidationSchema;
