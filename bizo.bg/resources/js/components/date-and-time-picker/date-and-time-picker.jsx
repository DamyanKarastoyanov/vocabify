/**
 * External dependencies
 */
import moment from "moment";
import { forwardRef, useState, useRef, useMemo } from "react";
import DatePickerComponent from "react-datepicker";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import DateAndTimePickerHeader from "@/components/date-and-time-picker/date-and-time-picker-header";
import DateAndTimePickerEnhancedHeader from "@/components/date-and-time-picker/date-and-time-picker-enhanced-header";
import DateAndTimePickerInput from "@/components/date-and-time-picker/date-and-time-picker-input";
import DateAndTimePickerFieldInput from "@/components/date-and-time-picker/date-and-time-picker-field-input";
import Button from "@/components/button/button";
import { roundToNearest30Minutes } from "@/components/date-picker/utils/date-picker-utils";

const DateAndTimePicker = forwardRef(
    function DateAndTimePicker(props, datePickerRef) {
        const {
            onChange = () => {},
            startDate,
            fieldInput = false,
            disabled,
            invalid,
            maxDate = moment().toDate(),
            minDate,
            showTime = true,
            useEnhancedHeader = false,
            placeholder,
            ...restProps
        } = props;

        const [date, setDate] = useState(
            startDate ? new Date(startDate) : null,
        );

        if (!datePickerRef?.current) {
            datePickerRef = useRef();
        }

        const handleChange = (selectedDate) => {
            // Allow clearing the date (selectedDate can be null)
            if (!selectedDate) {
                setDate(null);
                onChange(null);
                return;
            }

            // If showTime is false, strip out the time component by setting it to start of day
            const adjustedDate = showTime
                ? selectedDate
                : moment(selectedDate).startOf("day").toDate();
            setDate(adjustedDate);
            onChange(adjustedDate);
        };

        const handleTodayClick = () => {
            const newDate = showTime
                ? roundToNearest30Minutes(new Date())
                : moment().startOf("day").toDate();
            setDate(newDate);
            onChange(newDate);
            datePickerRef.current.setPreSelection(newDate);
        };

        const inputComponent = useMemo(() => {
            return fieldInput ? (
                <DateAndTimePickerFieldInput
                    showTime={showTime}
                    placeholderText={placeholder}
                />
            ) : (
                <DateAndTimePickerInput placeholderText={placeholder} />
            );
        }, [fieldInput, showTime, placeholder]);

        // Choose the appropriate header componentx
        const headerComponent = useEnhancedHeader
            ? (headerProps) => (
                  <DateAndTimePickerEnhancedHeader
                      {...headerProps}
                      minDate={minDate}
                      maxDate={maxDate}
                  />
              )
            : DateAndTimePickerHeader;

        return (
            <div
                className={classNames(
                    "bz-date-and-time-picker",
                    disabled && "bz-date-and-time-picker--disabled",
                    invalid && "bz-date-and-time-picker--invalid",
                    !fieldInput && "bz-date-and-time-picker--plain",
                    !showTime && "bz-date-and-time-picker--date-only",
                )}
            >
                <DatePickerComponent
                    ref={datePickerRef}
                    fixedHeight
                    selected={date}
                    onChange={handleChange}
                    maxDate={maxDate}
                    minDate={minDate}
                    dateFormat={showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
                    customInput={inputComponent}
                    renderCustomHeader={headerComponent}
                    disabled={disabled}
                    placeholderText={placeholder}
                    {...(showTime && {
                        showTimeSelect: true,
                        timeFormat: "HH:mm",
                        timeIntervals: 30,
                        timeCaption: "time",
                    })}
                    {...restProps}
                >
                    {!useEnhancedHeader && (
                        <Button onClick={handleTodayClick}>Today</Button>
                    )}
                </DatePickerComponent>
            </div>
        );
    },
);

export default DateAndTimePicker;
