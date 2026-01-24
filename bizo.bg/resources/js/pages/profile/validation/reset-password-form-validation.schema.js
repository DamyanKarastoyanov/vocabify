import * as yup from "yup";
import { PASSWORD_VALIDATION } from "@/utils/password-validation";

const resetPasswordFormValidationSchema = yup.object().shape({
    current_password: yup.string().required("Текущата парола е задължителна"),
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

export default resetPasswordFormValidationSchema;
