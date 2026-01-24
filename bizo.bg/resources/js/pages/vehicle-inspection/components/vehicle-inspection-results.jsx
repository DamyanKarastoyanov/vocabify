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
import Button from "@/components/button/button";

const FIELD_MAPPING = [
    {
        key: "registration_number",
        label: "Регистрационен номер:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.registrationNumber ||
            rawData?.registration_number ||
            null,
    },
    {
        key: "vehicle_identification",
        label: "Идентификационен номер:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.identificationNumber || null,
    },
    {
        key: "status",
        label: "Статус на прегледа:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.status === "valid" ||
            inspectionData?.isValid === true
                ? "Валиден"
                : "Невалиден",
        getColor: (rawData, inspectionData) =>
            inspectionData?.status === "valid" ||
            inspectionData?.isValid === true
                ? "green-100"
                : "red-500",
    },
    {
        key: "next_inspection_date",
        label: "Следващ преглед:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.nextInspectionDate || null,
    },
    {
        key: "inspection_type",
        label: "Тип преглед:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.isPeriodic
                ? "Периодичен преглед"
                : "Първичен преглед",
    },
    {
        key: "euro_standard",
        label: "Екологична категория:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.ecoCategory
                ? `EURO ${inspectionData.ecoCategory}`
                : null,
    },
    {
        key: "valid_until",
        label: "Валиден до:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.nextInspectionDate || null,
        color: "green-100",
    },
    {
        key: "make",
        label: "Марка:",
        getValue: (rawData, inspectionData) => inspectionData?.make || null,
    },
    {
        key: "model",
        label: "Модел:",
        getValue: (rawData, inspectionData) => inspectionData?.model || null,
    },
    {
        key: "engine_number",
        label: "Номер на двигател:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.engineNumber || null,
    },
    {
        key: "chassis_number",
        label: "Номер на шаси:",
        getValue: (rawData, inspectionData) =>
            inspectionData?.chassisNumber || null,
    },
];

const VehicleInspectionResults = (props) => {
    const { results, onNewSearch } = props;
    const rawData = results?.data;
    const inspectionData = rawData?.inspectionData || {};
    const found = rawData?.found ?? false;

    const hasData =
        found &&
        inspectionData?.nextInspectionDate &&
        Object.keys(inspectionData).length > 0;

    return (
        <BlockStack gap="800" className="bz-vehicle-inspection-results">
            {hasData && (
                <BlockStack gap="400">
                    <BlockStack gap="100">
                        {FIELD_MAPPING.map(
                            ({ key, label, color, getColor, getValue }) => {
                                const value = getValue
                                    ? getValue(rawData, inspectionData)
                                    : null;
                                if (!value) return null;

                                const textColor = getColor
                                    ? getColor(rawData, inspectionData)
                                    : color;

                                return (
                                    <InlineStack
                                        className="bz-vehicle-inspection-results-row"
                                        key={key}
                                        align="space-between"
                                        wrap={false}
                                        blockAlign="center"
                                    >
                                        <Text
                                            variant="body-m"
                                            color="text-secondary"
                                        >
                                            {label}
                                        </Text>

                                        <div className="bz-vehicle-inspection-results-separator" />

                                        <Text
                                            variant="body-m"
                                            color={textColor}
                                        >
                                            {value}
                                        </Text>
                                    </InlineStack>
                                );
                            },
                        )}
                    </BlockStack>
                </BlockStack>
            )}

            {results.message && (
                <Box>
                    <Text variant="body-m">{results.message}</Text>
                </Box>
            )}

            <InlineStack align="center">
                <Button onClick={onNewSearch} width="300px">
                    {hasData ? "Нова проверка" : "Назад"}
                </Button>
            </InlineStack>
        </BlockStack>
    );
};

export default VehicleInspectionResults;
