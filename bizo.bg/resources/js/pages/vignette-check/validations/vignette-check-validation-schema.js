import * as yup from "yup";

const VignetteCheckValidationSchema = yup.object().shape({
    vehicle: yup.object().nullable(),
    registration_number: yup
        .string()
        .required("Регистрационният номер е задължителен")
        .min(3, "Регистрационният номер трябва да бъде поне 3 символа"),
    termsAccepted: yup
        .boolean()
        .oneOf([true], "")
        .required(
            "Трябва да приемете общите условия и политиката за защита на личните данни",
        ),
});

export default VignetteCheckValidationSchema;
