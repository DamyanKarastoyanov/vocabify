import * as yup from "yup";

const calculatePriceValidationSchema = yup.object().shape({
    currency: yup.object().required("Моля, изберете валута"),
    start_date: yup.mixed().required("Моля, изберете начална дата"),
    end_date: yup
        .mixed()
        .required("Моля, изберете крайна дата")
        .test(
            "end-date-after-start-date",
            "Крайната дата не може да бъде преди началната дата",
            function (value) {
                const { start_date } = this.parent;
                if (!start_date || !value) return true; // Skip validation if either date is missing

                // Convert both values to timestamps for comparison
                // Handle both Date objects and numeric timestamps
                const startTimestamp =
                    start_date instanceof Date
                        ? start_date.getTime()
                        : start_date;
                const endTimestamp =
                    value instanceof Date ? value.getTime() : value;

                return endTimestamp >= startTimestamp;
            },
        ),
    travel_type: yup.object().required("Моля, изберете вид на пътуване"),
    travel_type_activity: yup.object().when("travel_type", {
        is: (travelType) => travelType && travelType.value !== 1,
        then: (schema) => schema.required("Моля, изберете активност"),
        otherwise: (schema) => schema.nullable(),
    }),
    destination: yup.object().required("Моля, изберете дестинация"),
    insurance_amount: yup
        .object()
        .required("Моля, изберете застрахователна сума"),
    number_of_passengers: yup
        .number()
        .required("Моля, изберете брой пътници")
        .min(1, "Броят пътници трябва да бъде поне 1"),
    number_of_passengers_under_18: yup
        .number()
        .transform((value, originalValue) => {
            if (
                originalValue === "" ||
                originalValue === null ||
                originalValue === undefined
            )
                return 0;
            const cleaned = String(originalValue).replace(/^0+/, "") || "0";
            return Number(cleaned);
        })
        .min(0, "Броят не може да бъде отрицателен")
        .nullable()
        .test(
            "sum-under-18-26",
            "Сумата на пътниците под 18 и под 26 не може да надвишава общия брой пътници",
            function (value) {
                const { number_of_passengers, number_of_passengers_under_26 } =
                    this.parent;
                const under18 = value || 0;
                const under26 = number_of_passengers_under_26 || 0;
                const total = number_of_passengers || 0;
                return under18 + under26 <= total;
            },
        ),
    number_of_passengers_under_26: yup
        .number()
        .transform((value, originalValue) => {
            if (
                originalValue === "" ||
                originalValue === null ||
                originalValue === undefined
            )
                return 0;
            const cleaned = String(originalValue).replace(/^0+/, "") || "0";
            return Number(cleaned);
        })
        .min(0, "Броят не може да бъде отрицателен")
        .nullable()
        .test(
            "sum-under-18-26",
            "Сумата на пътниците под 18 и под 26 не може да надвишава общия брой пътници",
            function (value) {
                const { number_of_passengers, number_of_passengers_under_18 } =
                    this.parent;
                const under18 = number_of_passengers_under_18 || 0;
                const under26 = value || 0;
                const total = number_of_passengers || 0;
                return under18 + under26 <= total;
            },
        ),
    number_of_passengers_between_70_and_80: yup
        .number()
        .min(0, "Броят не може да бъде отрицателен")
        .nullable(),
    additional_risks: yup.array().of(yup.number()).nullable(),
    // Dynamic validation for additional risk amounts (1-10)
    additional_risk_1_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(1),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_2_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(2),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_3_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(3),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_4_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(4),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_5_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(5),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_6_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(6),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_7_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(7),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_8_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(8),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_9_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(9),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
    additional_risk_10_amount: yup.object().when("additional_risks", {
        is: (risks) => risks && risks.includes(10),
        then: (schema) => schema.required("Моля, изберете сума за този риск"),
        otherwise: (schema) => schema.nullable(),
    }),
});

export default calculatePriceValidationSchema;
