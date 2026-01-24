import * as yup from "yup";
import {
    validateIdentificationNumber,
    getIdentificationNumberRegex,
    getIdentificationNumberErrorMessage,
} from "@/utils/bulgarian-id-validation";

const InsuredPersonsValidationSchema = yup.object().shape({
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
            value: yup.string().required("Градът е задължителен"),
            label: yup.string().required(),
            postcode: yup.string().required(),
        })
        .required("Градът е задължителен"),
    customer_postcode: yup
        .string()
        .required("Пощенският код е задължителен")
        .matches(/^\d+$/, "Пощенският код трябва да съдържа само цифри"),
    customer_address: yup
        .string()
        .required("Адресът е задължителен")
        .min(3, "Адресът трябва да е поне 3 символа")
        .max(100, "Адресът не трябва да надвишава 100 символа"),
    mobile_phone: yup
        .string()
        .required("Телефонният номер е задължителен")
        .matches(
            /^[0-9+]+$/,
            "Телефонният номер трябва да съдържа само цифри и +",
        )
        .min(10, "Телефонният номер трябва да е поне 10 цифри")
        .max(13, "Телефонният номер не трябва да надвишава 13 символа"),
    // Optional fields for when customer is also insured
    latin_full_name: yup.string().when("is_insurer_also_a_customer", {
        is: true,
        then: (schema) =>
            schema
                .required("Латинското име е задължително")
                .min(2, "Латинското име трябва да е поне 2 символа")
                .max(100, "Латинското име не трябва да надвишава 100 символа"),
        otherwise: (schema) => schema.notRequired(),
    }),
    email: yup
        .string()
        .transform((v) => (typeof v === "string" ? v.trim() : v))
        .max(254, "Имейлът не може да бъде повече от 254 символа")
        .matches(
            /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/,
            "Невалиден имейл адрес",
        )
        .required("Имейлът е задължителен"),
    birth_date: yup
        .mixed()
        .nullable()
        .transform((value) => {
            // Handle various input formats
            if (value === null || value === undefined || value === "") {
                return null;
            }

            // If it's already a Date object, return it
            if (value instanceof Date) {
                return value;
            }

            // If it's a timestamp (number), convert to Date
            if (typeof value === "number") {
                return new Date(value);
            }

            // If it's a string, try to parse it
            if (typeof value === "string") {
                const parsed = new Date(value);
                return isNaN(parsed.getTime()) ? null : parsed;
            }

            return null;
        })
        .test("is-date", "Невалидна дата", (value) => {
            if (value === null || value === undefined) {
                return true; // Let the conditional validation handle required
            }
            return value instanceof Date && !isNaN(value.getTime());
        })
        .when("customer_personal_identification_number_type", {
            is: (pinType) =>
                pinType && (pinType.value === 2 || pinType.value === 3),
            then: (schema) =>
                schema
                    .required("Датата на раждане е задължителна")
                    .max(
                        new Date(),
                        "Датата на раждане не може да бъде в бъдещето",
                    )
                    .test(
                        "age",
                        "Възрастта трябва да бъде между 0 и 120 години",
                        function (value) {
                            if (!value) return false;
                            const today = new Date();
                            const birthDate = new Date(value);
                            let age =
                                today.getFullYear() - birthDate.getFullYear();
                            const monthDiff =
                                today.getMonth() - birthDate.getMonth();

                            if (
                                monthDiff < 0 ||
                                (monthDiff === 0 &&
                                    today.getDate() < birthDate.getDate())
                            ) {
                                age--;
                            }

                            return age >= 0 && age <= 120;
                        },
                    ),
            otherwise: (schema) => schema.notRequired(),
        }),
    is_student: yup.boolean(),
    is_insurer_also_a_customer: yup.boolean(),
});

export default InsuredPersonsValidationSchema;
