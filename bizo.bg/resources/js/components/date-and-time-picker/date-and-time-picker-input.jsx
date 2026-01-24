/**
 * External dependencies
 */
import { forwardRef } from "react";

/**
 * Internal dependencies
 */
import Text from "@/components/text/text";

const DateAndTimePickerInput = forwardRef((props, ref) => {
    const { value, disabled, placeholderText, ...restProps } = props;

    const displayValue = value || placeholderText || "";

    return (
        <div
            ref={ref}
            {...restProps}
            className={
                disabled ? "bz-date-and-time-picker-input--disabled" : ""
            }
        >
            <Text
                variant="heading-m"
                color={
                    disabled
                        ? "purple-100"
                        : value
                          ? "purple-400"
                          : "purple-100"
                }
            >
                {displayValue}
            </Text>
        </div>
    );
});

export default DateAndTimePickerInput;
