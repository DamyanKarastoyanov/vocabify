/**
 * External dependencies
 */
import { forwardRef } from "react";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconCalendarCheck from "@/components/icons/calendar-check";
import IconClock from "@/components/icons/clock";

const DateAndTimePickerFieldInput = forwardRef((props, ref) => {
    const {
        value,
        onClick,
        disabled,
        showTime,
        placeholderText,
        ...restProps
    } = props;

    const resolvedPlaceholder = placeholderText ?? "";

    return (
        <InlineStack
            wrap={false}
            align="space-between"
            blockAlign="center"
            className="react-datepicker-ignore-onclickoutside bz-date-and-time-picker-input"
            onClick={onClick}
        >
            <input
                value={value || ""}
                readOnly
                ref={ref}
                placeholder={resolvedPlaceholder}
                {...restProps}
                disabled={disabled}
            />
            <InlineStack blockAlign="center" align="end" wrap={false} gap="100">
                <Icon size="600" icon={IconCalendarCheck} />
                {showTime && (
                    <Icon size="400" icon={IconClock} color="brand-500" />
                )}
            </InlineStack>
        </InlineStack>
    );
});

export default DateAndTimePickerFieldInput;
