import * as yup from "yup";
import {
    validateIdentificationNumber,
    getIdentificationNumberRegex,
    getIdentificationNumberErrorMessage,
} from "@/utils/bulgarian-id-validation";

// Simplified schema for non-customer insured persons (sections 2, 3, etc.)
const BasicInsuredPersonValidationSchema = yup.object().shape({
    personal_identification_number_type: yup
        .object()
        .shape({
            value: yup.string().required("Типът идентификатор е задължителен"),
            label: yup.string().required(),
        })
        .required("Типът идентификатор е задължителен"),
    personal_identification_number: yup
        .string()
        .required("Идентификационният номер е задължителен")
        .test("identification-number-validation", function (value) {
            const { personal_identification_number_type } = this.parent;

            // Skip validation if type is not selected
            if (!personal_identification_number_type) {
                return true;
            }

            // Skip validation if value is empty (required validation will catch this)
            if (!value || value.trim() === "") {
                return true;
            }

            // Pass the entire type object (with value and label) to validation functions
            const type = personal_identification_number_type;

            // Check structure first (regex pattern)
            const regex = getIdentificationNumberRegex(type);
            if (regex) {
                if (!regex.test(value)) {
                    return this.createError({
                        message: getIdentificationNumberErrorMessage(type),
                    });
                }
            } else {
                // If no regex found, type might be unknown - reject it
                return this.createError({
                    message: "Невалиден тип идентификационен номер",
                });
            }

            // Then check validation (including check digit)
            const isValid = validateIdentificationNumber(value, type);
            if (!isValid) {
                return this.createError({
                    message: getIdentificationNumberErrorMessage(type),
                });
            }

            return true;
        }),
    first_name: yup
        .string()
        .required("Името е задължително")
        .max(255, "Името не може да бъде повече от 255 символа"),
    last_name: yup.string().when("personal_identification_number_type", {
        is: (pinType) =>
            pinType && pinType.value !== "4" && pinType.value !== 4,
        then: (schema) =>
            schema
                .required("Фамилията е задължителна")
                .max(255, "Фамилията не може да бъде повече от 255 символа"),
        otherwise: (schema) => schema.nullable().notRequired(),
    }),
    latin_full_name: yup
        .string()
        .required("Името на латиница е задължително")
        .max(255, "Името на латиница не може да бъде повече от 255 символа"),
    district: yup
        .object()
        .shape({
            value: yup.number().required("Областта е задължителна"),
            label: yup.string().required(),
        })
        .required("Областта е задължителна"),
    municipality: yup
        .object()
        .shape({
            value: yup.number().required("Общината е задължителна"),
            label: yup.string().required(),
        })
        .required("Общината е задължителна"),
    town: yup
        .object()
        .shape({
            value: yup.number().required("Населеното място е задължително"),
            label: yup.string().required(),
        })
        .required("Населеното място е задължително"),
    country: yup
        .object()
        .nullable()
        .shape({
            value: yup.number().required("Държавата е задължителна"),
            label: yup.string().required(),
        })
        .test("has-valid-value", "Държавата е задължителна", function (value) {
            if (
                !value ||
                value === null ||
                value === undefined ||
                value.value === ""
            ) {
                return false;
            }
            return typeof value.value === "number" && !isNaN(value.value);
        }),
    address: yup
        .string()
        .required("Адресът е задължителен")
        .max(255, "Адресът не може да бъде повече от 255 символа"),
    postcode: yup
        .string()
        .required("Пощенският код е задължителен")
        .max(20, "Пощенският код не може да бъде повече от 20 символа"),
    mobile_phone: yup
        .string()
        .nullable()
        .when("is_mobile_number_available", {
            is: (val) => val === false,
            then: (schema) =>
                schema
                    .required("Мобилният телефон е задължителен")
                    .matches(
                        /^[0-9+]+$/,
                        "Телефонният номер трябва да съдържа само цифри и +",
                    )
                    .min(10, "Телефонният номер трябва да е поне 10 цифри")
                    .max(
                        13,
                        "Телефонният номер не трябва да надвишава 13 символа",
                    ),
            otherwise: (schema) => schema.notRequired(),
        }),
    is_mobile_number_available: yup.boolean(),
});

export default BasicInsuredPersonValidationSchema;
