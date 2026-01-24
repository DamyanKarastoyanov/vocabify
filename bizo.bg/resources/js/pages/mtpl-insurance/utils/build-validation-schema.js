import createFieldSchema from "./create-field-schema";

/**
 * Builds a validation schema by merging additional fields with a base schema
 * @param {yup.ObjectSchema} baseSchema - Base validation schema
 * @param {Array} matchedAdditionalFields - Array of additional field configurations
 * @returns {yup.ObjectSchema} Final validation schema
 */
const buildValidationSchema = (baseSchema, matchedAdditionalFields) => {
    if (!matchedAdditionalFields || matchedAdditionalFields.length === 0) {
        return baseSchema;
    }

    // Build flat schemas (all keys are now normalized to flat keys)
    const additionalFieldsSchema = {};
    matchedAdditionalFields.forEach((field) => {
        additionalFieldsSchema[field.key] = createFieldSchema(field);
    });

    const finalSchema = baseSchema.shape(additionalFieldsSchema);

    return finalSchema;
};

export default buildValidationSchema;
