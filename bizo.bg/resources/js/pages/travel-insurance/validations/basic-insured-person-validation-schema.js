import * as yup from "yup";
import {
    validateIdentificationNumber,
    getIdentificationNumberRegex,
    getIdentificationNumberErrorMessage,
} from "@/utils/bulgarian-id-validation";

// Simplified schema for non-customer insured persons (sections 2, 3, etc.)
const BasicInsuredPersonValidationSchema = yup.object().shape({
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
    latin_full_name: yup
        .string()
        .required("Латинското име е задължително")
        .min(2, "Латинското име трябва да е поне 2 символа")
        .max(100, "Латинското име не трябва да надвишава 100 символа"),
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
});

export default BasicInsuredPersonValidationSchema;
