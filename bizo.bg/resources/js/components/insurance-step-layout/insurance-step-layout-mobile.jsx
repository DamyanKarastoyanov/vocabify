/**
 * External dependencies
 */
import Box from "@/components/box/box";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import DotsSeparator from "@/components/insurance-step-layout/dots-separator";
import { useOfferDetails } from "./shared/use-offer-details";
import { OfferDetailsContent } from "./shared/offer-details-content";
import CustomBubbleTooltip from "./shared/custom-bubble-tooltip";
import BizoBubbleMobile from "@assets/BizoBubbleMobile.png";

const InsuranceStepLayoutMobile = (props) => {
    const {
        form,
        offerDetails,
        button,
        isError = false,
        showDivider = true,
        showOfferDetails = true,
        bubbleText = null,
    } = props;

    const { isExpanded, handleCalculationHolderClick, withOfferDetails } =
        useOfferDetails(offerDetails);
    return (
        <>
            <InlineStack className="bz-step-holder bz-step-holder--mobile">
                <Box className="bz-insurance-form-holder">{form}</Box>
            </InlineStack>

            {(showOfferDetails || bubbleText) && (
                <BlockStack className="bz-insurance-offer-holder-container bz-insurance-offer-holder-container--mobile">
                    {bubbleText && (
                        <InlineStack
                            align="end"
                            className="bz-insurance-bubble-icon-container"
                        >
                            <CustomBubbleTooltip
                                content={bubbleText}
                                placement="top-start"
                                maxWidth={250}
                            >
                                <button
                                    type="button"
                                    className="bz-insurance-bubble-icon-button"
                                    aria-label="Info"
                                >
                                    <img
                                        width="70px"
                                        src={BizoBubbleMobile}
                                        alt="Bizo Bubble"
                                    />
                                </button>
                            </CustomBubbleTooltip>
                        </InlineStack>
                    )}

                    {(withOfferDetails || button) && (
                        <Box className="bz-insurance-offer-holder-surface bz-insurance-offer-holder-surface--mobile">
                            {withOfferDetails && (
                                <>
                                    <Box className="bz-insurance-offer-holder">
                                        <Box
                                            paddingBlockEnd="400"
                                            paddingInline="400"
                                        >
                                            <OfferDetailsContent
                                                offerDetails={offerDetails}
                                                isError={isError}
                                                isExpanded={isExpanded}
                                                onToggleExpand={
                                                    handleCalculationHolderClick
                                                }
                                                showMobileCaret={true}
                                            />
                                        </Box>
                                    </Box>

                                    {showDivider && isExpanded && (
                                        <DotsSeparator />
                                    )}
                                </>
                            )}

                            <Box paddingBlockEnd="800" paddingInline="800">
                                <BlockStack gap="400">
                                    {withOfferDetails && (
                                        <>
                                            {(() => {
                                                const lastSection =
                                                    offerDetails[
                                                        offerDetails.length - 1
                                                    ];
                                                const lastItem =
                                                    lastSection?.items[
                                                        lastSection.items
                                                            .length - 1
                                                    ];

                                                if (!lastItem) return null;

                                                return (
                                                    <InlineStack
                                                        align="space-between"
                                                        blockAlign="center"
                                                        wrap={false}
                                                    >
                                                        <Text variant="body-m">
                                                            {lastItem.label}
                                                        </Text>
                                                        <BlockStack
                                                            gap="050"
                                                            inlineAlign="end"
                                                        >
                                                            <Text
                                                                variant="heading-m"
                                                                wrap={false}
                                                            >
                                                                {lastItem.value}
                                                                {lastItem.suffix
                                                                    ? ` ${lastItem.suffix}`
                                                                    : ""}
                                                            </Text>
                                                            {lastItem.subValue && (
                                                                <Text
                                                                    variant="body-s"
                                                                    color="brand-500"
                                                                >
                                                                    {
                                                                        lastItem.subValue
                                                                    }
                                                                    {lastItem.subSuffix
                                                                        ? ` ${lastItem.subSuffix}`
                                                                        : ""}
                                                                </Text>
                                                            )}
                                                        </BlockStack>
                                                    </InlineStack>
                                                );
                                            })()}
                                        </>
                                    )}

                                    {button && (
                                        <Button
                                            variant="primary"
                                            onClick={button.onClick}
                                            disabled={button.disabled}
                                            loading={button.loading}
                                            width="100%"
                                        >
                                            <InlineStack gap="200">
                                                <Text as="span">
                                                    {button.text}
                                                </Text>
                                            </InlineStack>
                                        </Button>
                                    )}
                                </BlockStack>
                            </Box>
                        </Box>
                    )}
                </BlockStack>
            )}
        </>
    );
};

export default InsuranceStepLayoutMobile;
