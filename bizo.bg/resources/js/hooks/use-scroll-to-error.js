import { useEffect } from "react";
import { scrollToFirstError } from "@/utils/scrollToFirstError";

/**
 * Hook that automatically scrolls to first error when form has validation errors
 * @param {Object} errors - Form errors object
 * @param {boolean} hasErrors - Whether form currently has errors
 */

export const useScrollToError = (errors, hasErrors) => {
    useEffect(() => {
        if (hasErrors && Object.keys(errors).length > 0) {
            setTimeout(() => {
                scrollToFirstError();
            }, 100);
        }
    }, [hasErrors, errors]);
};
