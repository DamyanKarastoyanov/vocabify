import { useEffect } from "react";

/**
 * Enforces a minimum date (floor) for insurance start dates.
 * Automatically corrects dates that fall before the minimum allowed date.
 *
 * @param {Object} formDataState - The form data state containing calculatePrice
 * @param {Function} formDataDispatch - Dispatch function for form data updates
 * @param {string} dateFieldName - Name of the date field ('start_date' or 'policy_start_date')
 * @param {number} daysOffset - Days offset from today (0 for today, 1 for tomorrow)
 */
export const useInsuranceDateFloor = (
    formDataState,
    formDataDispatch,
    dateFieldName,
    daysOffset = 0,
) => {
    useEffect(() => {
        if (!formDataState?.calculatePrice) {
            return;
        }

        const dateValue = formDataState.calculatePrice[dateFieldName];

        if (!dateValue) {
            return;
        }

        const today = new Date();
        const correctDate = new Date(
            today.getTime() + daysOffset * 24 * 60 * 60 * 1000,
        ).setHours(0, 0, 0, 0);

        if (dateValue < correctDate) {
            formDataDispatch({
                type: "SET_CALCULATE_PRICE_DATA",
                payload: {
                    ...formDataState.calculatePrice,
                    [dateFieldName]: new Date(correctDate).setHours(0, 0, 0, 0),
                },
            });
        }
    }, [formDataState?.calculatePrice?.[dateFieldName]]);
};
