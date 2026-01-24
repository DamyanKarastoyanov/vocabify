import * as yup from "yup";
import {
    validateIdentificationNumber,
    getIdentificationNumberRegex,
    getIdentificationNumberErrorMessage,
} from "@/utils/bulgarian-id-validation";

const CustomerValidationSchema = yup.object().shape({
    customer_personal_identification_number_type: yup
        .object()
        .shape({
            value: yup
                .string()
                .required("Типът на документа за самоличност е задължителен"),
            label: yup.string().required(),
        })
        .required("Типът на документа за самоличност е задължителен"),
    customer_personal_identification_number: yup
        .string()
        .required("Идентификационният номер е задължителен")
        .test("identification-number-validation", function (value) {
            const { customer_personal_identification_number_type } =
                this.parent;
            if (!customer_personal_identification_number_type || !value)
                return true;

            // Pass the entire type object (with value and label) to validation functions
            const type = customer_personal_identification_number_type;

            // Check structure first
            const regex = getIdentificationNumberRegex(type);
            if (regex && !regex.test(value)) {
                return this.createError({
                    message: getIdentificationNumberErrorMessage(type),
                });
            }

            // Then check validation (including check digit)
            if (!validateIdentificationNumber(value, type)) {
                return this.createError({
                    message: getIdentificationNumberErrorMessage(type),
                });
            }

            return true;
        }),
    first_name: yup
        .string()
        .required("Името е задължително")
        .min(2, "Името трябва да е поне 2 символа")
        .max(50, "Името не трябва да надвишава 50 символа"),
    last_name: yup
        .string()
        .when("customer_personal_identification_number_type", {
            is: (pinType) =>
                pinType && pinType.value !== "4" && pinType.value !== 4,
            then: (schema) =>
                schema
                    .required("Фамилията е задължителна")
                    .min(2, "Фамилията трябва да е поне 2 символа")
                    .max(50, "Фамилията не трябва да надвишава 50 символа"),
            otherwise: (schema) => schema.nullable().notRequired(),
        }),
    customer_district: yup
        .object()
        .shape({
            value: yup.string().required("Областта е задължителна"),
            label: yup.string().required(),
        })
        .required("Областта е задължителна"),
    customer_municipality: yup
        .object()
        .shape({
            value: yup.string().required("Общината е задължителна"),
            label: yup.string().required(),
        })
        .required("Общината е задължителна"),
    customer_town: yup
        .object()
        .shape({
            value: yup.string().required("Населеното място е задължително"),
            label: yup.string().required(),
        })
        .required("Населеното място е задължително"),
    customer_postcode: yup
        .string()
        .required("Пощенският код е задължителен")
        .matches(/^\d{4}$/, "Пощенският код трябва да е точно 4 цифри"),
    customer_address: yup
        .string()
        .required("Адресът е задължителен")
        .min(5, "Адресът трябва да е поне 5 символа")
        .max(255, "Адресът не трябва да надвишава 255 символа"),
    mobile_phone: yup
        .string()
        .required("Телефонният номер е задължителен")
        .matches(
            /^(\+359|0)[0-9]{8,9}$/,
            "Невалиден телефонен номер. Използвайте формат: +359xxxxxxxx или 0xxxxxxxx",
        )
        .min(10, "Телефонният номер трябва да е поне 10 символа")
        .max(13, "Телефонният номер не трябва да надвишава 13 символа"),
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

export default CustomerValidationSchema;
