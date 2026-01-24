import * as yup from "yup";

const paymentTypeValidationSchema = yup.object().shape({
    payment_type: yup
        .string()
        .required("Моля, изберете начин на плащане")
        .oneOf(["card_payment", "bank_transfer"], "Невалиден начин на плащане"),
});

export default paymentTypeValidationSchema;
