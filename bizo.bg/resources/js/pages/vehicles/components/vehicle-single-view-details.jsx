/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Box from "@/components/box/box";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import IconDocument from "@/components/icons/document";
import Icon from "@/components/icon/icon";

const VEHICLE_MEASUREMENTS = {
    engine_volume: "см³",
    engine_power: "кВ",
};

const VEHICLE_DETAILS_MAPPING = [
    { key: "reg_number", label: "Регистрационен номер:" },
    { key: "vin", label: "VIN:" },
    { key: "talon", label: "Талон:" },
    {
        key: "specification.mark",
        label: "Марка и модел:",
        getValue: (data) => {
            const mark = data?.specification?.mark;
            const model = data?.specification?.model;
            if (!mark || !model) return null;
            return `${mark} ${model}`;
        },
    },
    {
        key: "specification.manufactured_year",
        label: "Година на производство:",
        getValue: (data) => data?.specification?.manufactured_year,
    },
    {
        key: "specification.engine_volume",
        label: "Обем на двигателя:",
        getValue: (data) => {
            const volume = data?.specification?.engine_volume;
            return volume
                ? `${volume} ${VEHICLE_MEASUREMENTS.engine_volume}`
                : null;
        },
    },
    {
        key: "specification.engine_power",
        label: "Мощност:",
        getValue: (data) => {
            const power = data?.specification?.engine_power;
            return power
                ? `${power} ${VEHICLE_MEASUREMENTS.engine_power}`
                : null;
        },
    },
    {
        key: "specification.euro_standard",
        label: "Екологичен стандарт:",
        getValue: (data) => data?.specification?.euro_standard,
    },
];

const VehicleSingleViewDetails = (props) => {
    const { vehicleDetails } = props;

    return (
        <Surface>
            <Box padding="1000">
                <BlockStack gap="800">
                    <InlineStack gap="300">
                        <Icon icon={IconDocument} size="600" />

                        <Text variant="heading-s">Детайли</Text>
                    </InlineStack>

                    <BlockStack gap="300">
                        {VEHICLE_DETAILS_MAPPING.map(
                            ({ key, label, getValue }) => {
                                const value = getValue
                                    ? getValue(vehicleDetails)
                                    : vehicleDetails?.[key];

                                if (!value) return null;

                                return (
                                    <InlineStack
                                        key={key}
                                        align="space-between"
                                        gap="400"
                                    >
                                        <Text variant="body-s" color="subdued">
                                            {label}
                                        </Text>
                                        <Text variant="body-s">{value}</Text>
                                    </InlineStack>
                                );
                            },
                        )}
                    </BlockStack>
                </BlockStack>
            </Box>
        </Surface>
    );
};

export default VehicleSingleViewDetails;
