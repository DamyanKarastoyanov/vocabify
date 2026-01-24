import * as yup from "yup";

const InsuredPersonValidationSchema = yup.object().shape({
    first_name: yup
        .string()
        .required("Името е задължително")
        .min(2, "Името трябва да е поне 2 символа"),
    last_name: yup
        .string()
        .required("Фамилията е задължителна")
        .min(2, "Фамилията трябва да е поне 2 символа"),
    insured_phone: yup
        .string()
        .required("Телефонният номер е задължителен")
        .matches(
            /^[0-9]{10}$/,
            "Телефонният номер трябва да бъде 10 цифри (напр. 0888123456)",
        ),
    insured_email: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .max(254, "Имейлът не може да бъде повече от 254 символа")
        .matches(
            /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/,
            "Невалиден имейл адрес",
        )
        .required("Имейлът е задължителен"),
});

export default InsuredPersonValidationSchema;
