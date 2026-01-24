import * as yup from "yup";

const emailTestValidationSchema = yup.object().shape({
    email: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .max(254, "Имейлът не може да бъде повече от 254 символа")
        .test("email-format", "Невалиден имейл адрес", function (value) {
            if (!value || value.length === 0) {
                return true;
            }
            return /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(
                value,
            );
        }),
});

export default emailTestValidationSchema;
