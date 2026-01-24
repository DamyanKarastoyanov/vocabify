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
import Divider from "@/components/divider/divider";
import { formatDate } from "@/utils/formatting";

const MAIN_INFO_MAPPING = [
    { key: "egn", label: "ЕГН:" },
    { key: "drivingLicenceNumber", label: "Номер на шофьорска книжка:" },
    {
        key: "hasObligations",
        label: "Задължения:",
        getValue: (data) => (data.hasObligations ? "Да" : "Няма задължения"),
        getColor: (data) => (data.hasObligations ? "red-500" : "green-100"),
        alwaysShow: true,
    },
];

const OBLIGATION_MAPPING = [
    { key: "documentNumber", label: "Номер на документ:" },
    {
        key: "issueDate",
        label: "Дата на издаване:",
        getValue: (data) => {
            if (!data.issueDate) return null;
            try {
                const date =
                    data.issueDate instanceof Date
                        ? data.issueDate
                        : new Date(data.issueDate);
                return formatDate(date, "dd.MM.yyyy");
            } catch {
                return null;
            }
        },
    },
    { key: "vehicleNumber", label: "Регистрационен номер:" },
    {
        key: "breachDate",
        label: "Дата на нарушение:",
        getValue: (data) => {
            if (!data.breachDate) return null;
            try {
                const date =
                    data.breachDate instanceof Date
                        ? data.breachDate
                        : new Date(data.breachDate);
                return formatDate(date, "dd.MM.yyyy");
            } catch {
                return null;
            }
        },
    },
    { key: "breachOfOrder", label: "Нарушение:" },
    {
        key: "discountAmount",
        label: "Отстъпка:",
        getValue: (data) =>
            data.discountAmount > 0
                ? `${data.discountAmount.toFixed(2)} ${data.currency || "BGN"}`
                : null,
    },
    {
        key: "amountToPay",
        label: "Сума за плащане:",
        getValue: (data) => {
            if (data.amountToPay === null || data.amountToPay === undefined)
                return null;
            const bgnFormatted = `${data.amountToPay.toFixed(2)}лв`;
            if (
                data.amountEUR !== null &&
                data.amountEUR !== undefined &&
                data.amountEUR > 0
            ) {
                return `${bgnFormatted} (${data.amountEUR.toFixed(2)} EUR)`;
            }
            return bgnFormatted;
        },
        getColor: (data) => (data.amountToPay > 0 ? "red-500" : "green-100"),
    },
];

const TOTALS_MAPPING = [
    {
        key: "total",
        label: "Общо:",
        formatCombinedCurrency: true,
    },
];

const MVRFinesCheckResults = (props) => {
    const { results, onNewSearch } = props;
    const responseData = results?.data?.data;
    const obligations = responseData?.obligations || [];
    const totals = responseData?.totals || {};
    const hasObligations = responseData?.hasObligations || false;

    const formatCombinedCurrency = (amountBGN, amountEUR) => {
        if (amountBGN === null || amountBGN === undefined) return null;
        const bgnFormatted = `${amountBGN.toFixed(2)}лв`;
        if (amountEUR !== null && amountEUR !== undefined && amountEUR > 0) {
            return `${bgnFormatted} (${amountEUR.toFixed(2)} EUR)`;
        }
        return bgnFormatted;
    };

    const mainInfoData = {
        egn: results?.data?.egn,
        drivingLicenceNumber: results?.data?.drivingLicenceNumber,
        hasObligations: hasObligations,
    };

    return (
        <BlockStack gap="800" className="bz-mtpl-check-page">
            {responseData && (
                <BlockStack gap="400">
                    <BlockStack gap="100">
                        {MAIN_INFO_MAPPING.map(
                            ({
                                key,
                                label,
                                color,
                                getColor,
                                getValue,
                                alwaysShow,
                            }) => {
                                const value = getValue
                                    ? getValue(mainInfoData)
                                    : mainInfoData[key];

                                if (!value && !alwaysShow) return null;

                                const textColor = getColor
                                    ? getColor(mainInfoData)
                                    : color;

                                return (
                                    <InlineStack
                                        className="bz-mtpl-check-results-row"
                                        key={key}
                                        align="space-between"
                                    >
                                        <Text
                                            variant="body-m"
                                            color="text-secondary"
                                        >
                                            {label}
                                        </Text>

                                        <div className="bz-mtpl-check-results-separator" />

                                        <Text
                                            variant="body-m"
                                            color={textColor}
                                        >
                                            {value || "-"}
                                        </Text>
                                    </InlineStack>
                                );
                            },
                        )}
                    </BlockStack>

                    {hasObligations && obligations.length > 0 && (
                        <>
                            <BlockStack gap="400">
                                <Text variant="heading-s">Глоби:</Text>

                                {obligations.map(
                                    (obligation, obligationIndex) => (
                                        <Box
                                            key={obligationIndex}
                                            className="bz-mvr-fines-obligation"
                                        >
                                            <BlockStack gap="300">
                                                {OBLIGATION_MAPPING.map(
                                                    ({
                                                        key,
                                                        label,
                                                        color,
                                                        getColor,
                                                        getValue,
                                                    }) => {
                                                        const value = getValue
                                                            ? getValue(
                                                                  obligation,
                                                              )
                                                            : obligation[key];

                                                        if (!value) return null;

                                                        const textColor =
                                                            getColor
                                                                ? getColor(
                                                                      obligation,
                                                                  )
                                                                : color;

                                                        return (
                                                            <InlineStack
                                                                className="bz-mvr-fines-check-results-row"
                                                                key={key}
                                                                align="space-between"
                                                            >
                                                                <Text
                                                                    variant="body-m"
                                                                    color="text-secondary"
                                                                >
                                                                    {label}
                                                                </Text>

                                                                <div className="bz-mtpl-check-results-separator" />

                                                                <Text
                                                                    variant="body-m"
                                                                    color={
                                                                        textColor
                                                                    }
                                                                >
                                                                    {value}
                                                                </Text>
                                                            </InlineStack>
                                                        );
                                                    },
                                                )}
                                            </BlockStack>
                                        </Box>
                                    ),
                                )}
                            </BlockStack>
                        </>
                    )}

                    {hasObligations &&
                        totals &&
                        Object.keys(totals).length > 0 && (
                            <>
                                <BlockStack className="bz-mvr-fines-totals">
                                    {TOTALS_MAPPING.map(
                                        ({
                                            key,
                                            label,
                                            formatCombinedCurrency:
                                                shouldFormatCombinedCurrency,
                                        }) => {
                                            const value =
                                                shouldFormatCombinedCurrency
                                                    ? formatCombinedCurrency(
                                                          totals.amountBGN,
                                                          totals.amountEUR,
                                                      )
                                                    : totals[key];

                                            if (!value) return null;

                                            return (
                                                <InlineStack
                                                    className="bz-mvr-fines-check-results-row"
                                                    key={key}
                                                    align="space-between"
                                                >
                                                    <Text
                                                        variant="body-m"
                                                        fontWeight="medium"
                                                    >
                                                        {label}
                                                    </Text>
                                                    <Text variant="body-m">
                                                        {value}
                                                    </Text>
                                                </InlineStack>
                                            );
                                        },
                                    )}
                                </BlockStack>
                            </>
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

export default MVRFinesCheckResults;
