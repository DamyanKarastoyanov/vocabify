import * as yup from "yup";
import {
    validateIdentificationNumber,
    getIdentificationNumberRegex,
    getIdentificationNumberErrorMessage,
} from "@/utils/bulgarian-id-validation";

const beneficiaryStepValidationSchema = yup.object().shape({
    bank: yup
        .object()
        .shape({
            value: yup.number().required("Банката е задължителна"),
            label: yup.string().required(),
        })
        .required("Банката е задължителна"),
    customer_personal_identification_number_type: yup.object().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .object()
                .shape({
                    value: yup
                        .number()
                        .required(
                            "Типът на документа за самоличност е задължителен",
                        ),
                    label: yup.string().required(),
                })
                .required("Типът на документа за самоличност е задължителен"),
        otherwise: () => yup.object().nullable(),
    }),
    customer_personal_identification_number: yup.string().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
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
        otherwise: () => yup.string().nullable(),
    }),
    first_name: yup.string().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .string()
                .required("Името е задължително")
                .min(2, "Името трябва да е поне 2 символа")
                .max(50, "Името не трябва да надвишава 50 символа"),
        otherwise: () => yup.string().nullable(),
    }),
    last_name: yup
        .string()
        .when(["bank", "customer_personal_identification_number_type"], {
            is: (bank, pinType) =>
                bank?.value === 1 &&
                pinType &&
                pinType.value !== "4" &&
                pinType.value !== 4,
            then: () =>
                yup
                    .string()
                    .required("Фамилията е задължителна")
                    .min(2, "Фамилията трябва да е поне 2 символа")
                    .max(50, "Фамилията не трябва да надвишава 50 символа"),
            otherwise: () => yup.string().nullable(),
        }),
    customer_district: yup.object().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .object()
                .shape({
                    value: yup.number().required("Областта е задължителна"),
                    label: yup.string().required(),
                })
                .required("Областта е задължителна"),
        otherwise: () => yup.object().nullable(),
    }),
    customer_municipality: yup.object().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .object()
                .shape({
                    value: yup.number().required("Общината е задължителна"),
                    label: yup.string().required(),
                })
                .required("Общината е задължителна"),
        otherwise: () => yup.object().nullable(),
    }),
    customer_town: yup.object().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .object()
                .shape({
                    value: yup.number().required("Градът е задължителен"),
                    label: yup.string().required(),
                    postcode: yup.string().required(),
                })
                .required("Градът е задължителен"),
        otherwise: () => yup.object().nullable(),
    }),
    customer_postcode: yup.string().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .string()
                .required("Пощенският код е задължителен")
                .matches(
                    /^\d+$/,
                    "Пощенският код трябва да съдържа само цифри",
                ),
        otherwise: () => yup.string().nullable(),
    }),
    customer_address: yup.string().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .string()
                .required("Адресът е задължителен")
                .min(3, "Адресът трябва да е поне 3 символа")
                .max(100, "Адресът не трябва да надвишава 100 символа"),
        otherwise: () => yup.string().nullable(),
    }),
    mobile_phone: yup.string().when("bank", {
        is: (bank) => bank?.value === 1,
        then: () =>
            yup
                .string()
                .required("Телефонният номер е задължителен")
                .matches(
                    /^[0-9+]+$/,
                    "Телефонният номер трябва да съдържа само цифри и +",
                )
                .min(10, "Телефонният номер трябва да е поне 10 цифри")
                .max(13, "Телефонният номер не трябва да надвишава 13 символа"),
        otherwise: () => yup.string().nullable(),
    }),
});

export default beneficiaryStepValidationSchema;
