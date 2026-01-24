import * as yup from "yup";

const profileFormValidationSchema = yup.object().shape({
    profile_first_name: yup
        .string()
        .required("Името е задължително")
        .min(2, "Името трябва да е поне 2 символа")
        .max(50, "Името не трябва да надвишава 50 символа"),
    profile_last_name: yup
        .string()
        .required("Фамилията е задължителна")
        .min(2, "Фамилията трябва да е поне 2 символа")
        .max(50, "Фамилията не трябва да надвишава 50 символа"),
    email: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .max(254, "Имейлът не може да бъде повече от 254 символа")
        .matches(
            /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/,
            "Невалиден имейл адрес",
        )
        .required("Имейлът е задължителен"),
});

export default profileFormValidationSchema;
