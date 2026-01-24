/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";

const FIELD_MAPPING = [
    { key: "plateNumber", label: "Регистрационен номер:" },
    {
        key: "status",
        label: "Статус на винетка:",
        getValue: (data) =>
            data.hasValidVignette ? "Валидна" : "Няма активна винетка",
        getColor: (data) => (data.hasValidVignette ? "green-100" : "red-500"),
        alwaysShow: true,
    },
    { key: "vignetteNumber", label: "Номер на винетка:" },
    { key: "validFrom", label: "Валидна от:" },
    {
        key: "validTo",
        label: "Валидна до:",
        color: "green-100",
    },
    { key: "vignetteStatus", label: "Статус:" },
    { key: "price", label: "Цена:" },
];

const VignetteCheckResults = (props) => {
    const { results, onNewSearch } = props;
    const rawData = results?.data?.data;
    const vignetteInfo = rawData?.vignetteInfo;

    const data = {
        plateNumber: rawData?.plateNumber,
        hasValidVignette: rawData?.hasValidVignette,
        vignetteNumber: vignetteInfo?.vignetteNumber,
        vehicleClass: vignetteInfo?.vehicleClass,
        emissionsClass: vignetteInfo?.emissionsClass,
        validFrom: vignetteInfo?.validFrom,
        validTo: vignetteInfo?.validTo,
        vignetteStatus: vignetteInfo?.status,
        price: vignetteInfo?.price
            ? `${vignetteInfo.price} ${vignetteInfo.currency || "BGN"}`
            : null,
    };

    return (
        <BlockStack gap="800" className="bz-vignette-check-results">
            {rawData && (
                <BlockStack gap="100">
                    {FIELD_MAPPING.map(
                        ({
                            key,
                            label,
                            color,
                            getColor,
                            getValue,
                            alwaysShow,
                        }) => {
                            const value = getValue ? getValue(data) : data[key];

                            if (!value && !alwaysShow) return null;

                            const textColor = getColor ? getColor(data) : color;

                            return (
                                <InlineStack
                                    className="bz-vignette-check-results-row"
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

                                    <div className="bz-vignette-check-results-separator" />

                                    <Text variant="body-m" color={textColor}>
                                        {value}
                                    </Text>
                                </InlineStack>
                            );
                        },
                    )}
                </BlockStack>
            )}

            <InlineStack align="center">
                <Button onClick={onNewSearch} width="300px">
                    <Text>Нова проверка</Text>
                </Button>
            </InlineStack>
        </BlockStack>
    );
};

export default VignetteCheckResults;
