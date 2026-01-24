/**
 * External dependencies
 */
import Box from "@/components/box/box";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import Spinner from "@/components/spinner/spinner";
import IconCaretDown from "@/components/icons/caret-down";
import IconCaretUp from "@/components/icons/caret-up";

/**
 * Shared component for rendering offer details content
 * Used by both desktop and mobile versions
 */
export const OfferDetailsContent = ({
    offerDetails,
    isError,
    isExpanded,
    onToggleExpand,
    showMobileCaret = false,
}) => {
    if (isError) {
        return (
            <BlockStack gap="400">
                <Box className="bz-insurance-data-holder">
                    <InlineStack align="center" blockAlign="center">
                        <Text variant="body-l">
                            Грешка при изчисляване на цената. Моля, провери
                            въведените данни.
                        </Text>
                    </InlineStack>
                </Box>
            </BlockStack>
        );
    }

    if (!offerDetails) {
        return (
            <BlockStack gap="400">
                <Box className="bz-insurance-data-holder">
                    <InlineStack align="center" blockAlign="center">
                        <Spinner />
                    </InlineStack>
                </Box>
            </BlockStack>
        );
    }

    const withOfferDetails =
        offerDetails &&
        offerDetails?.length > 0 &&
        offerDetails[0]?.items?.length > 0;

    if (!withOfferDetails) {
        return null;
    }

    return (
        <BlockStack gap="400">
            <Box
                className={`bz-insurance-data-holder ${isExpanded ? "expanded" : ""}`}
                onClick={showMobileCaret ? onToggleExpand : undefined}
            >
                {showMobileCaret && (
                    <div className="mobile-caret">
                        <Icon
                            icon={isExpanded ? IconCaretDown : IconCaretUp}
                            size="500"
                            color="brand-600"
                        />
                    </div>
                )}

                <BlockStack gap="400">
                    {offerDetails.map((section, sectionIndex) => (
                        <BlockStack
                            className={
                                !isExpanded &&
                                sectionIndex !== offerDetails.length - 1
                                    ? "bz-insurance-data-holder-mobile-item--hidden"
                                    : ""
                            }
                            key={`section-${sectionIndex}`}
                            gap="400"
                        >
                            {section.items.map((item, itemIndex) => {
                                const isOverallLastItem =
                                    sectionIndex === offerDetails.length - 1 &&
                                    itemIndex === section.items.length - 1;

                                // Skip rendering the last item here - it will be rendered separately
                                if (isOverallLastItem) {
                                    return null;
                                }

                                return (
                                    <InlineStack
                                        key={`item-${sectionIndex}-${itemIndex}`}
                                        className={
                                            !isExpanded &&
                                            itemIndex !==
                                                section.items.length - 1
                                                ? "bz-insurance-data-holder-mobile-item--hidden"
                                                : ""
                                        }
                                        align="space-between"
                                        blockAlign="center"
                                        wrap={false}
                                        gap="500"
                                    >
                                        <Text variant="body-m">
                                            {item.label}
                                        </Text>
                                        <BlockStack gap="050" inlineAlign="end">
                                            <Text
                                                variant="heading-s"
                                                wrap={false}
                                            >
                                                {item.value}
                                                {item.suffix
                                                    ? ` ${item.suffix}`
                                                    : ""}
                                            </Text>
                                            {item.subValue && (
                                                <Text
                                                    variant="body-s"
                                                    color="brand-500"
                                                >
                                                    {item.subValue}
                                                    {item.subSuffix
                                                        ? ` ${item.subSuffix}`
                                                        : ""}
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </InlineStack>
                                );
                            })}
                        </BlockStack>
                    ))}
                </BlockStack>
            </Box>
        </BlockStack>
    );
};
