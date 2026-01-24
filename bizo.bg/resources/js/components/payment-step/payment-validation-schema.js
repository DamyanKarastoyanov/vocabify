import * as yup from "yup";

const paymentValidationSchema = yup.object().shape({
    payment_method: yup.string().required("Моля, изберете начин на плащане"),
});

export default paymentValidationSchema;
