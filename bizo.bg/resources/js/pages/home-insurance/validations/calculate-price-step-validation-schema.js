import * as yup from "yup";

const CalculatePriceStepValidationSchema = yup.object().shape({
    start_date: yup.string().required("Началната дата е задължителна"),
    period: yup
        .object()
        .shape({
            value: yup.string().required("Периодът е задължителен"),
            label: yup.string().required(),
        })
        .required("Периодът е задължителен"),
    currency: yup
        .object()
        .shape({
            value: yup.string().required("Валутата е задължителна"),
            label: yup.string().required(),
        })
        .required("Валутата е задължителна"),
    installment: yup
        .object()
        .shape({
            value: yup.string().required("Вноската е задължителна"),
            label: yup.string().required(),
        })
        .required("Вноската е задължителна"),
});

export default CalculatePriceStepValidationSchema;
