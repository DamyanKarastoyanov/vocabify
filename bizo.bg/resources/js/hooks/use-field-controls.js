import { useCallback } from "react";

/**
 * Hook for managing field state and value helpers
 * @param {Array} fields - Array of field objects with `key`, `isEnabled`, `isVisible`, and `isRequired` properties
 * @returns {Object} Utilities for updating field flags and values
 */
const useFieldControls = (fields) => {
    const toggleFieldEnabled = useCallback(
        (key, enabled) => {
            const field = fields.find((f) => f.key === key);
            if (field) {
                field.isEnabled = enabled;
            }
        },
        [fields],
    );

    const toggleFieldVisible = useCallback(
        (key, visible) => {
            const field = fields.find((f) => f.key === key);
            if (field) {
                field.isVisible = visible;
            }
        },
        [fields],
    );

    const toggleFieldRequired = useCallback(
        (key, required) => {
            const field = fields.find((f) => f.key === key);
            if (field) {
                field.isRequired = required;
            }
        },
        [fields],
    );

    const applyUpperCaseToField = useCallback(
        (key, value, setValue, options = {}) => {
            if (!value || typeof value !== "string") {
                return;
            }

            setValue(key, value.toUpperCase(), {
                shouldValidate: true,
                shouldTouch: true,
                ...options,
            });
        },
        [],
    );

    return {
        toggleFieldEnabled,
        toggleFieldVisible,
        toggleFieldRequired,
        applyUpperCaseToField,
    };
};

export default useFieldControls;
