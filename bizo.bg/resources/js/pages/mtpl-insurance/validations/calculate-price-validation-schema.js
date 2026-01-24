import * as yup from "yup";

const CalculatePriceValidationSchema = yup.object().shape({
    wheel_direction: yup
        .object()
        .shape({
            value: yup.string().required("Посоката на волана е задължителна"),
            label: yup.string().required(),
        })
        .required("Посоката на волана е задължителна"),
    policy_start_date: yup
        .string()
        .required("Началната дата на застраховката е задължителна")
        .test(
            "is-future-date",
            "Началната дата не може да бъде в миналото",
            function (value) {
                if (!value) return true; // Let required validation handle empty values
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today;
            },
        ),
    //['insured.xp', 'vehicle.engine_volume', 'vehicle.engine_power_kw, vehicle.usage'];
    engine_volume: yup
        .number()
        .min("300", "Минималният обем на двигателя е 300 кубически сантиметра")
        .typeError("Моля, въведете валидно число")
        .transform((value, originalValue) => {
            // Convert empty strings to undefined before number validation
            if (originalValue === "" || originalValue === null) {
                return undefined;
            }
            return value;
        })
        .required("Обемът на двигателя е задължителен"),
    engine_power_kw: yup
        .number()
        .typeError("Моля, въведете валидно число")
        .transform((value, originalValue) => {
            // Convert empty strings to undefined before number validation
            if (originalValue === "" || originalValue === null) {
                return undefined;
            }
            return value;
        })
        .required("Мощността на двигателя е задължителна"),
    vehicle_usage: yup
        .object()
        .shape({
            value: yup.string(),
            label: yup.string(),
        })
        .required("Предназначението на МПС е задължително"),
    driver_experience: yup
        .object()
        .nullable()
        .shape({
            value: yup.number().typeError("Моля, изберете валиден стаж"),
            label: yup.string(),
        })
        .test(
            "has-valid-value",
            "Стажът на водача е задължителен",
            function (value) {
                if (!value || value === null || value === undefined) {
                    return false;
                }
                if (value.value === "") {
                    return false;
                }
                return typeof value.value === "number" && !isNaN(value.value);
            },
        ),
    policy_installments: yup
        .object()
        .shape({
            value: yup
                .number()
                .required("Броят на вноските е задължителен")
                .min(1, "Минимален брой вноски е 1")
                .max(12, "Максимален брой вноски е 12"),
            label: yup.string().required(),
        })
        .required("Броят на вноските е задължителен"),
});

export default CalculatePriceValidationSchema;
