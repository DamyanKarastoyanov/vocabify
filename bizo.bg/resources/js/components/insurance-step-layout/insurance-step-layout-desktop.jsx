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
import CaptainBizoThinking from "@assets/CaptainBizoThinking.png";
import "./insurance-step-layout-desktop.scss";

const InsuranceStepLayoutDesktop = (props) => {
    const {
        form,
        offerDetails,
        button,
        isError = false,
        showDivider = true,
        bubbleText = null,
        showOfferDetails = true,
        mascotImage = null,
    } = props;

    const { isExpanded, handleCalculationHolderClick, withOfferDetails } =
        useOfferDetails(offerDetails);

    return (
        <InlineStack className="bz-step-holder bz-step-holder--desktop">
            <Box className="bz-insurance-form-holder">{form}</Box>

            <BlockStack
                gap="600"
                className="bz-insurance-offer-holder-container bz-insurance-offer-holder-container--desktop"
            >
                {showOfferDetails && (
                    <Box
                        className="bz-insurance-offer-holder-surface bz-insurance-offer-holder-surface--desktop"
                        paddingBlockStart="800"
                    >
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
                                            showMobileCaret={false}
                                        />
                                    </Box>
                                </Box>

                                {showDivider && <DotsSeparator />}
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
                                                    lastSection.items.length - 1
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
                                            <Text as="span">{button.text}</Text>
                                        </InlineStack>
                                    </Button>
                                )}
                            </BlockStack>
                        </Box>
                    </Box>
                )}

                {mascotImage ? (
                    <div className="bz-insurance-mascot-image-container">
                        <img src={mascotImage} />
                    </div>
                ) : (
                    bubbleText && (
                        <div className="bz-insurance-info-card-container">
                            <div className="bz-insurance-info-card">
                                <Text variant="body-m">{bubbleText}</Text>
                            </div>
                            <div className="bz-insurance-info-card-image">
                                <img src={CaptainBizoThinking} />
                            </div>
                        </div>
                    )
                )}
            </BlockStack>
        </InlineStack>
    );
};

export default InsuranceStepLayoutDesktop;
