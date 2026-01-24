/**
 * Extracts error message for a field from react-hook-form errors object
 * Supports both flat keys and dot-notation nested keys
 * @param {string} fieldKey - Field key (can be flat or dot-notation like "vehicle.usage")
 * @param {Object} errors - react-hook-form errors object
 * @returns {string|undefined} Error message or undefined if no error
 */
const getFieldError = (fieldKey, errors) => {
    if (!fieldKey || !errors) return undefined;

    // Try flat access first (for keys without dots)
    if (errors[fieldKey]) {
        const error = errors[fieldKey];

        // If it has a message property, return it
        if (error && typeof error === "object" && "message" in error) {
            return typeof error.message === "string"
                ? error.message
                : undefined;
        }

        // If it's a string, return it
        if (typeof error === "string") {
            return error;
        }

        // Skip if it looks like a field value object (has value and label but no message)
        if (
            error &&
            typeof error === "object" &&
            "value" in error &&
            "label" in error &&
            !("message" in error)
        ) {
            return undefined;
        }

        return undefined;
    }

    // Try nested access for dot-notation keys (e.g., "vehicle.usage" -> errors.vehicle.usage)
    const parts = fieldKey.split(".");
    if (parts.length > 1) {
        let nestedError = errors;
        for (const part of parts) {
            if (
                nestedError &&
                typeof nestedError === "object" &&
                nestedError[part] !== undefined
            ) {
                nestedError = nestedError[part];
            } else {
                return undefined;
            }
        }

        // Handle both { message: "..." } and direct string cases
        if (typeof nestedError === "string") {
            return nestedError;
        }
        if (
            nestedError &&
            typeof nestedError === "object" &&
            "message" in nestedError
        ) {
            return typeof nestedError.message === "string"
                ? nestedError.message
                : undefined;
        }

        return undefined;
    }

    return undefined;
};

export default getFieldError;
