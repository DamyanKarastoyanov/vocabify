import * as yup from "yup";

const propertyFormValidationSchema = yup.object().shape({
    district: yup
        .object()
        .shape({
            value: yup.string().required("Областта е задължителна"),
            label: yup.string().required(),
        })
        .required("Областта е задължителна"),
    municipality: yup
        .object()
        .shape({
            value: yup.string().required("Общината е задължителна"),
            label: yup.string().required(),
        })
        .required("Общината е задължителна"),
    town: yup
        .object()
        .shape({
            value: yup.string().required("Градът е задължителен"),
            label: yup.string().required(),
        })
        .required("Градът е задължителен"),
    postcode: yup
        .string()
        .required("Пощенският код е задължителен")
        .matches(/^\d+$/, "Пощенският код трябва да съдържа само цифри"),
    address: yup
        .string()
        .required("Адресът на имота е задължителен")
        .min(3, "Адресът трябва да е поне 3 символа")
        .max(100, "Адресът не трябва да надвишава 100 символа"),
    property_size: yup
        .string()
        .required("Размерът на имота е задължителен")
        .matches(/^\d+$/, "Размерът на имота трябва да съдържа само цифри")
        .test(
            "size-range",
            "Размерът на имота трябва да е между 1 и 1000",
            (value) =>
                !value || (parseInt(value) >= 1 && parseInt(value) <= 1000),
        ),
});

export default propertyFormValidationSchema;
