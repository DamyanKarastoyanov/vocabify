import * as yup from "yup";

const personFormValidationSchema = yup.object().shape({
    personal_identification_number_type: yup
        .object()
        .shape({
            value: yup
                .string()
                .required("Типът на документа за самоличност е задължителен"),
            label: yup.string().required(),
        })
        .required("Типът на документа за самоличност е задължителен"),
    personal_identification_number: yup
        .string()
        .required("ЕГН/ЛНЧ е задължително")
        .matches(/^\d+$/, "ЕГН/ЛНЧ трябва да съдържа само цифри")
        .test(
            "len",
            "ЕГН/ЛНЧ трябва да е точно 10 цифри",
            (val) => !val || val.length === 10,
        ),
    first_name: yup
        .string()
        .required("Името е задължително")
        .min(2, "Името трябва да е поне 2 символа")
        .max(50, "Името не трябва да надвишава 50 символа"),
    last_name: yup
        .string()
        .required("Фамилията е задължителна")
        .min(2, "Фамилията трябва да е поне 2 символа")
        .max(50, "Фамилията не трябва да надвишава 50 символа"),
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
    postcode: yup
        .string()
        .required("Пощенският код е задължителен")
        .matches(/^\d+$/, "Пощенският код трябва да съдържа само цифри"),
    address: yup
        .string()
        .required("Адресът е задължителен")
        .min(3, "Адресът трябва да е поне 3 символа")
        .max(100, "Адресът не трябва да надвишава 100 символа"),
});

export default personFormValidationSchema;
