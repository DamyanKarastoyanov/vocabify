/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import { useState } from "react";

/**
 * Internal dependencies
 */
import Select from "@/components/select/select";
import InlineStack from "@/components/inline-stack/inline-stack";
import Box from "@/components/box/box";
import { token } from "@/tokens/tokens";

const defaultDateRangeOptions = [
    { value: "allTime", label: "Без период" },
    { value: "tm", label: "Този месец" },
    { value: "lm", label: "Миналия месец" },
];

const DateRangePickerReload = (props) => {
    const {
        loadOnly,
        dateRangeOptions = defaultDateRangeOptions,
        dateRangeValue = "allTime",
        customKey = null,
    } = props;

    const route = useRoute();

    const getSelectedRange = (routeParams) => {
        const { period } = routeParams;

        if (period) {
            return (
                dateRangeOptions.find((option) => option.value === period) ||
                dateRangeOptions[0]
            );
        }

        return (
            dateRangeOptions.find(
                (option) => option.value === dateRangeValue,
            ) || dateRangeOptions[0]
        );
    };

    const [selectedDateRange, setSelectedDateRange] = useState(() =>
        getSelectedRange(route().params),
    );

    const reloadWithPeriod = (selectedOption) => {
        setSelectedDateRange(selectedOption);

        if (selectedOption.value === "custom") {
            return;
        }

        const dates = customKey
            ? {
                  [`period_${customKey}`]: selectedOption.value,
              }
            : {
                  period: selectedOption.value,
              };

        router.reload({ only: [loadOnly], data: dates });
    };

    return (
        <InlineStack gap="500">
            <Box width={token("size.4800")}>
                <Select
                    options={dateRangeOptions}
                    onChange={reloadWithPeriod}
                    value={selectedDateRange}
                    menuPortalTarget={document.body}
                    menuPlacement="bottom"
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
                    }}
                />
            </Box>
        </InlineStack>
    );
};

export default DateRangePickerReload;
