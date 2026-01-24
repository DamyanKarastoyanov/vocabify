/**
 * External dependencies
 */
import { useEffect, useState } from "react";

/**
 * Internal dependencies
 */
import useGetPoliciesDetailsQuery from "@/pages/policies/data/use-get-policies-details-query";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import IconDocument from "@/components/icons/document";
import IconPropertyInsurance from "@/components/icons/property-insurance";
import IconMTPLInsurance from "@/components/icons/mtpl-insurance";
import IconNonResidentInsurance from "@/components/icons/non-resident-insurance";
import IconLifeInsurance from "@/components/icons/life-insurance";
import Icon from "@/components/icon/icon";
import IconButton from "@/components/icon-button/icon-button";
import { formatDate } from "@/utils/formatting";
import Spinner from "@/components/spinner/spinner";
import IconDownload from "@/components/icons/download";

const PolicySingleView = (props) => {
    const { policyId, onClose } = props;
    const {
        isLoading: isLoadingDetails,
        isError,
        data: policyDetails,
    } = useGetPoliciesDetailsQuery(policyId);

    const handleDownloadPolicy = () => {
        if (policyDetails) {
            window.open(policyDetails.download_url);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Активна":
                return "bz-text-active";
            case "Отказана":
            case "Отменена":
            case "Изтекла":
                return "bz-text-declined";
            case "Ти си на ход":
            case "Одобрението пътува":
            case "Очаква плащане":
            case "Колегата го гледа":
                return "bz-text-pending";
        }
    };

    const getInsuranceIcon = (insuranceName) => {
        if (!insuranceName) return IconPropertyInsurance;

        switch (insuranceName) {
            case "Застраховка при пътуване в чужбина":
                return IconLifeInsurance;
            case "Застраховка имущество":
                return IconPropertyInsurance;
            case "Гражданска отговорност":
                return IconMTPLInsurance;
            case "Медицинска застраховка за чужденци":
                return IconNonResidentInsurance;
            default:
                return IconPropertyInsurance;
        }
    };

    const getInsuranceTypeLabel = (insuranceName) => {
        if (!insuranceName)
            return { first: "Застраховка", second: "имущество" };

        const middle = Math.floor(insuranceName.length / 2);

        // Find the nearest whitespace to the middle
        let splitIndex = middle;

        // Search for whitespace starting from middle, expanding outward
        for (let offset = 0; offset < middle; offset++) {
            const leftPos = middle - offset;
            const rightPos = middle + offset;

            // Check left side first (prefer earlier split)
            if (leftPos >= 0 && insuranceName[leftPos] === " ") {
                splitIndex = leftPos;
                break;
            }

            // Then check right side
            if (
                rightPos < insuranceName.length &&
                insuranceName[rightPos] === " "
            ) {
                splitIndex = rightPos;
                break;
            }
        }

        const first = insuranceName.substring(0, splitIndex).trim();
        const second = insuranceName.substring(splitIndex).trim();

        return { first, second };
    };

    const renderPolicyCard = () => {
        const insuranceIcon = getInsuranceIcon(policyDetails?.insurance_name);
        const insuranceLabel = getInsuranceTypeLabel(
            policyDetails?.insurance_name,
        );
        const statusClass = getStatusClass(policyDetails?.status);

        return (
            <div className="bz-policy-single-view-card">
                <div className="bz-policy-single-view-card__left">
                    <BlockStack gap="800">
                        <InlineStack gap="400">
                            <Icon icon={insuranceIcon} size="1400" />
                            <BlockStack gap="0">
                                <Text variant="body-s" color="text-secondary">
                                    {insuranceLabel.first}
                                </Text>
                                <Text variant="body-s" color="text-secondary">
                                    {insuranceLabel.second}
                                </Text>
                            </BlockStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            {policyDetails?.status && (
                                <div
                                    className={`bz-policy-status-badge ${statusClass}`}
                                >
                                    <Text variant="body-s" color="inherit">
                                        {policyDetails.status}
                                    </Text>
                                </div>
                            )}

                            <Text variant="heading-l" fontWeight="bold">
                                {policyDetails?.title || "N/A"}
                            </Text>
                        </BlockStack>
                    </BlockStack>
                </div>

                <div className="bz-policy-single-view-card__right">
                    <BlockStack gap="400">
                        <InlineStack
                            gap="400"
                            align="space-between"
                            className="bz-policy-details-header"
                            blockAlign="center"
                        >
                            <InlineStack gap="400">
                                <Icon icon={IconDocument} size="600" />
                                <Text variant="heading-s" fontWeight="semibold">
                                    Детайли
                                </Text>
                            </InlineStack>

                            {policyDetails?.download_url && (
                                <Button
                                    variant="plain"
                                    onClick={handleDownloadPolicy}
                                >
                                    <InlineStack
                                        gap="200"
                                        wrap={false}
                                        blockAlign="center"
                                    >
                                        <Icon
                                            icon={IconDownload}
                                            size="600"
                                            color="brand-500"
                                        />

                                        <Text
                                            variant="body-s"
                                            color="brand-500"
                                        >
                                            Изтегли полица
                                        </Text>
                                    </InlineStack>
                                </Button>
                            )}
                        </InlineStack>

                        <BlockStack gap="400">
                            <div className="bz-policy-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Номер на полица:
                                </Text>
                                <div className="bz-policy-detail-separator" />
                                <Text variant="body-s">
                                    {policyDetails?.policy_number ||
                                        policyDetails?.payment_reference ||
                                        "N/A"}
                                </Text>
                            </div>

                            <div className="bz-policy-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Валидност:
                                </Text>
                                <div className="bz-policy-detail-separator" />
                                <Text variant="body-s">
                                    {policyDetails?.start_date
                                        ? formatDate(
                                              policyDetails?.start_date,
                                              "dd.MM.yyyy",
                                          )
                                        : "N/A"}{" "}
                                    -{" "}
                                    {policyDetails?.end_date
                                        ? formatDate(
                                              policyDetails?.end_date,
                                              "dd.MM.yyyy",
                                          )
                                        : "N/A"}
                                </Text>
                            </div>

                            <div className="bz-policy-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Цена:
                                </Text>
                                <div className="bz-policy-detail-separator" />
                                <Text variant="body-s">
                                    {policyDetails?.price || "N/A"}
                                </Text>
                            </div>

                            <div className="bz-policy-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Тип плащане:
                                </Text>
                                <div className="bz-policy-detail-separator" />
                                <Text variant="body-s">
                                    {policyDetails?.payment_type || "N/A"}
                                </Text>
                            </div>

                            <div className="bz-policy-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Статус:
                                </Text>
                                <div className="bz-policy-detail-separator" />
                                <Text variant="body-s">
                                    {policyDetails?.status_description || "N/A"}
                                </Text>
                            </div>
                        </BlockStack>
                    </BlockStack>
                </div>
            </div>
        );
    };

    return (
        <BlockStack className="bz-policy-single-view" gap="800">
            {isLoadingDetails && (
                <Box>
                    <Spinner />
                </Box>
            )}

            {!isLoadingDetails && policyDetails && renderPolicyCard()}
        </BlockStack>
    );
};

export default PolicySingleView;
