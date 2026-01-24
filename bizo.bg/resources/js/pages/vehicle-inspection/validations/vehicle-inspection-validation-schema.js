import * as yup from "yup";

const VehicleInspectionValidationSchema = yup.object().shape({
    registration_number: yup
        .string()
        .required("Регистрационният номер е задължителен")
        .min(3, "Регистрационният номер трябва да бъде поне 3 символа"),
    captcha_code: yup
        .string()
        .required("Кодът за сигурност е задължителен")
        .min(4, "Кодът за сигурност трябва да бъде поне 4 символа"),
    termsAccepted: yup
        .boolean()
        .oneOf([true], "")
        .required(
            "Трябва да приемете общите условия и политиката за защита на личните данни",
        ),
});

export default VehicleInspectionValidationSchema;
