import * as yup from "yup";

const PaymentValidationSchema = yup.object().shape({
    payment_method: yup
        .string()
        .required("Методът на плащане е задължителен")
        .oneOf(
            ["card", "bank_transfer"],
            "Моля изберете валиден метод на плащане",
        ),
});

export default PaymentValidationSchema;
