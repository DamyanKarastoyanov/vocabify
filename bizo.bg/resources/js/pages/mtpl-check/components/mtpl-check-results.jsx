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
    { key: "registrationNumber", label: "Регистрационен номер:" },
    {
        key: "status",
        label: "Статус на ГО:",
        getValue: (data) => (data.hasValidInsurance ? "Валидна" : "Невалидна"),
        getColor: (data) => (data.hasValidInsurance ? "green-100" : "red-500"),
        alwaysShow: true,
    },
    { key: "insurer", label: "Застраховател:" },
    { key: "startDate", label: "Валидна от:" },
    { key: "endDate", label: "Валидна до:" },
    { key: "policyNumber", label: "Номер на полица:" },
];

const MtplCheckResults = (props) => {
    const { results, onNewSearch } = props;
    const rawData = results?.data;
    const hasValidInsurance = rawData?.hasValidInsurance;
    const details = rawData?.details?.[0]; // Get first insurance detail

    const data = {
        registrationNumber: rawData?.registrationNumber,
        hasValidInsurance: hasValidInsurance,
        status: hasValidInsurance ? "Валидна" : "Невалидна",
        insurer: details?.insurer,
        startDate: details?.startDate,
        endDate: details?.endDate,
        policyNumber: details?.policyNumber,
    };

    return (
        <BlockStack gap="800" className="bz-mtpl-check-results">
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
                                    className="bz-mtpl-check-results-row"
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

                                    <div className="bz-mtpl-check-results-separator" />

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

export default MtplCheckResults;
