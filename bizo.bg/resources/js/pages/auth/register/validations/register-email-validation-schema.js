import * as yup from "yup";

const RegisterEmailValidationSchema = yup.object().shape({
    email: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .max(254, "Имейлът не може да бъде повече от 254 символа")
        .matches(
            /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/,
            "Невалиден имейл адрес",
        )
        .required("Имейлът е задължителен"),
    termsAccepted: yup
        .boolean()
        .oneOf([true], "")
        .required(
            "Трябва да приемете общите условия и политиката за защита на личните данни",
        ),
});

export default RegisterEmailValidationSchema;
