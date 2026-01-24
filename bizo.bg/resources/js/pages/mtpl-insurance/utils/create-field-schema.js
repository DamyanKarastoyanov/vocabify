import * as yup from "yup";

/**
 * Creates a yup validation schema for a form field based on its type and configuration
 * @param {Object} field - Field configuration object
 * @returns {yup.Schema} Yup validation schema
 */
const createFieldSchema = (field) => {
    let fieldSchema;
    const validation = field.validationSchema || {};

    switch (field.type) {
        case "date":
            fieldSchema = yup
                .mixed()
                .nullable()
                .transform((value) => {
                    if (value === null || value === undefined || value === "") {
                        return null;
                    }
                    if (value instanceof Date) {
                        return value;
                    }
                    if (typeof value === "number") {
                        return new Date(value);
                    }
                    if (typeof value === "string") {
                        const parsed = new Date(value);
                        return isNaN(parsed.getTime()) ? null : parsed;
                    }
                    return null;
                })
                .test(
                    "is-valid-date",
                    field.isRequired
                        ? `${field.label} е задължително поле`
                        : "Моля, въведете валидна дата",
                    function (value) {
                        if (field.isRequired) {
                            if (value === null || value === undefined) {
                                return false;
                            }
                        } else {
                            if (value === null || value === undefined) {
                                return true;
                            }
                        }
                        if (value instanceof Date) {
                            return !isNaN(value.getTime());
                        }
                        return false;
                    },
                );

            // Apply date format validation if specified
            if (validation.date_format) {
                fieldSchema = fieldSchema.test(
                    "date-format",
                    `${field.label} трябва да бъде във формат ${validation.date_format}`,
                    function (value) {
                        if (!value || !(value instanceof Date)) {
                            return true; // Let other validations handle null/undefined
                        }
                        // Validate format by checking if date can be formatted correctly
                        // Y-m-d format validation
                        if (validation.date_format === "Y-m-d") {
                            const year = value.getFullYear();
                            const month = String(value.getMonth() + 1).padStart(
                                2,
                                "0",
                            );
                            const day = String(value.getDate()).padStart(
                                2,
                                "0",
                            );
                            const formatted = `${year}-${month}-${day}`;
                            // Basic format check - ensure it matches Y-m-d pattern
                            return /^\d{4}-\d{2}-\d{2}$/.test(formatted);
                        }
                        return true;
                    },
                );
            }

            // Apply after_or_equal validation
            if (validation.after_or_equal) {
                const minDate = new Date(validation.after_or_equal);
                // Set time to start of day for inclusive comparison
                minDate.setHours(0, 0, 0, 0);
                if (!isNaN(minDate.getTime())) {
                    fieldSchema = fieldSchema.test(
                        "after-or-equal",
                        `${field.label} трябва да бъде след или на ${validation.after_or_equal}`,
                        function (value) {
                            if (!value || !(value instanceof Date)) {
                                return true; // Let other validations handle null/undefined
                            }
                            const valueDate = new Date(value);
                            valueDate.setHours(0, 0, 0, 0);
                            return valueDate >= minDate;
                        },
                    );
                }
            }

            // Apply before_or_equal validation
            if (validation.before_or_equal) {
                const maxDate = new Date(validation.before_or_equal);
                // Set time to end of day for inclusive comparison
                maxDate.setHours(23, 59, 59, 999);
                if (!isNaN(maxDate.getTime())) {
                    fieldSchema = fieldSchema.test(
                        "before-or-equal",
                        `${field.label} трябва да бъде преди или на ${validation.before_or_equal}`,
                        function (value) {
                            if (!value || !(value instanceof Date)) {
                                return true; // Let other validations handle null/undefined
                            }
                            const valueDate = new Date(value);
                            valueDate.setHours(23, 59, 59, 999);
                            return valueDate <= maxDate;
                        },
                    );
                }
            }

            break;

        case "number":
            fieldSchema = yup
                .number()
                .typeError("Моля, въведете валидно число")
                .test(
                    "is-valid-number",
                    "Моля, въведете валидно число",
                    function (value) {
                        if (
                            !field.isRequired &&
                            (value === null ||
                                value === undefined ||
                                value === "")
                        ) {
                            return true;
                        }
                        return !isNaN(value) && value !== "";
                    },
                );

            if (validation.min !== undefined && validation.min !== null) {
                fieldSchema = fieldSchema.min(
                    validation.min,
                    `${field.label} трябва да е поне ${validation.min}`,
                );
            }

            if (validation.max !== undefined && validation.max !== null) {
                fieldSchema = fieldSchema.max(
                    validation.max,
                    `${field.label} не трябва да надвишава ${validation.max}`,
                );
            }

            if (field.isRequired) {
                fieldSchema = fieldSchema.required(
                    `${field.label} е задължително поле`,
                );
            } else {
                fieldSchema = fieldSchema.nullable();
            }
            break;

        case "select":
            fieldSchema = yup
                .object()
                .shape({
                    value: yup.mixed(),
                    label: yup.string(),
                })
                .test(
                    "has-value",
                    `${field.label} е задължително поле`,
                    function (value) {
                        if (!field.isRequired) {
                            return true;
                        }
                        if (!value) {
                            return false;
                        }
                        return (
                            value.value !== undefined &&
                            value.value !== null &&
                            value.value !== ""
                        );
                    },
                );
            if (field.isRequired) {
                fieldSchema = fieldSchema.required(
                    `${field.label} е задължително поле`,
                );
            } else {
                fieldSchema = fieldSchema.nullable();
            }
            break;

        case "text":
        default:
            fieldSchema = yup.string();

            if (validation.min !== undefined && validation.min !== null) {
                fieldSchema = fieldSchema.min(
                    validation.min,
                    `${field.label} трябва да е поне ${validation.min} символа`,
                );
            }

            if (validation.max !== undefined && validation.max !== null) {
                fieldSchema = fieldSchema.max(
                    validation.max,
                    `${field.label} не трябва да надвишава ${validation.max} символа`,
                );
            }

            if (validation.length !== undefined && validation.length !== null) {
                fieldSchema = fieldSchema.length(
                    validation.length,
                    `${field.label} трябва да е точно ${validation.length} символа`,
                );
            }

            if (field.isRequired) {
                fieldSchema = fieldSchema.required(
                    `${field.label} е задължително поле`,
                );
            } else {
                fieldSchema = fieldSchema.nullable();
            }
            break;
    }

    return fieldSchema;
};

export default createFieldSchema;
