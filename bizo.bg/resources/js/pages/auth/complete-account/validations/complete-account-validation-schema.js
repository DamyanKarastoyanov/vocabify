import * as yup from "yup";
import { PASSWORD_VALIDATION } from "@/utils/password-validation";

const CompleteAccountValidationSchema = yup.object().shape({
    first_name: yup
        .string()
        .required("Името е задължително")
        .max(255, "Името трябва да бъде до 255 символа"),
    last_name: yup
        .string()
        .required("Фамилията е задължителна")
        .max(255, "Фамилията трябва да бъде до 255 символа"),
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

export default CompleteAccountValidationSchema;
