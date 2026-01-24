/**
 * External dependencies
 */
import moment from "moment";
import { useState, useEffect } from "react";

/**
 * Internal dependencies
 */
import IconButton from "@/components/icon-button/icon-button";
import IconCaretLeft from "@/components/icons/caret-left";
import IconCaretRight from "@/components/icons/caret-right";
import Select from "@/components/select/select";
import InlineStack from "@/components/inline-stack/inline-stack";

const DateAndTimePickerEnhancedHeader = (props) => {
    const {
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        changeYear,
        changeMonth,
        minDate,
        maxDate,
    } = props;

    const [selectedYear, setSelectedYear] = useState(moment(date).year());
    const [selectedMonth, setSelectedMonth] = useState(moment(date).month());

    // Generate year options based on min/max dates
    const getYearOptions = () => {
        const currentYear = moment().year();
        const minYear = minDate ? moment(minDate).year() : currentYear - 100;
        const maxYear = maxDate ? moment(maxDate).year() : currentYear + 10;

        const years = [];
        for (let year = maxYear; year >= minYear; year--) {
            years.push({
                value: year,
                label: year.toString(),
                hideRadioButton: true,
            });
        }
        return years;
    };

    // Generate month options
    const getMonthOptions = () => {
        return moment.months().map((month, index) => ({
            value: index,
            label: month,
            hideRadioButton: true,
        }));
    };

    // Update local state when date prop changes
    useEffect(() => {
        setSelectedYear(moment(date).year());
        setSelectedMonth(moment(date).month());
    }, [date]);

    const handleYearChange = (selectedOption) => {
        if (selectedOption && changeYear) {
            setSelectedYear(selectedOption.value);
            changeYear(selectedOption.value);
        }
    };

    const handleMonthChange = (selectedOption) => {
        if (selectedOption && changeMonth) {
            setSelectedMonth(selectedOption.value);
            changeMonth(selectedOption.value);
        }
    };

    const yearOptions = getYearOptions();
    const monthOptions = getMonthOptions();

    const selectedYearOption = yearOptions.find(
        (option) => option.value === selectedYear,
    );
    const selectedMonthOption = monthOptions.find(
        (option) => option.value === selectedMonth,
    );

    return (
        <InlineStack align="space-between" blockAlign="center" wrap={false}>
            <IconButton
                size="300"
                icon={IconCaretLeft}
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
            />

            <InlineStack
                align="center"
                blockAlign="center"
                gap="050"
                wrap={false}
                style={{ flex: "1 1 auto", minWidth: 0 }}
            >
                <div className="bz-date-and-time-picker-enhanced-header__select-wrapper bz-date-and-time-picker-enhanced-header__select-wrapper--month">
                    <Select
                        value={selectedMonthOption}
                        onChange={handleMonthChange}
                        options={monthOptions}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 99999,
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 99999,
                            }),
                            control: (base) => ({
                                ...base,
                                minHeight: "32px",
                                fontSize: "14px",
                            }),
                        }}
                    />
                </div>

                <div className="bz-date-and-time-picker-enhanced-header__select-wrapper bz-date-and-time-picker-enhanced-header__select-wrapper--year">
                    <Select
                        value={selectedYearOption}
                        onChange={handleYearChange}
                        options={yearOptions}
                        isSearchable={true}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 99999,
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 99999,
                                maxHeight: "200px",
                            }),
                            menuList: (base) => ({
                                ...base,
                                maxHeight: "200px",
                            }),
                            control: (base) => ({
                                ...base,
                                minHeight: "32px",
                                fontSize: "14px",
                            }),
                        }}
                    />
                </div>
            </InlineStack>

            <IconButton
                size="300"
                icon={IconCaretRight}
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
            />
        </InlineStack>
    );
};

export default DateAndTimePickerEnhancedHeader;
