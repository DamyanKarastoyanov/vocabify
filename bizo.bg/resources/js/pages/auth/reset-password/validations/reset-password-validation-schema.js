import * as yup from "yup";
import { PASSWORD_VALIDATION } from "@/utils/password-validation";

const ResetPasswordValidationSchema = yup.object().shape({
    email: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .max(254, "Имейлът не може да бъде повече от 254 символа")
        .matches(
            /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/,
            "Невалиден имейл адрес",
        )
        .required("Имейлът е задължителен"),
    password: yup
        .string()
        .required("Паролата е задължителна")
        .matches(
            PASSWORD_VALIDATION.LOWERCASE_REGEX,
            PASSWORD_VALIDATION.LOWERCASE_MESSAGE,
        )
        .matches(
            PASSWORD_VALIDATION.UPPERCASE_REGEX,
            PASSWORD_VALIDATION.UPPERCASE_MESSAGE,
        )
        .matches(
            PASSWORD_VALIDATION.DIGIT_REGEX,
            PASSWORD_VALIDATION.DIGIT_MESSAGE,
        )
        .matches(
            PASSWORD_VALIDATION.SPECIAL_CHAR_REGEX,
            PASSWORD_VALIDATION.SPECIAL_CHAR_MESSAGE,
        ),
    password_confirmation: yup
        .string()
        .required("Повторената парола е задължителна")
        .oneOf([yup.ref("password")], "Паролите не съвпадат"),
});

export default ResetPasswordValidationSchema;
