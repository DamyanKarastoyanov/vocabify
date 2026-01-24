/**
 * Internal dependencies
 */
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";

const OfferCardSkeleton = () => {
    return (
        <Surface>
            <Box paddingBlock="500" paddingInline="500">
                <BlockStack gap="400">
                    <div className="mtpl-insurance__offer-card-skeleton mtpl-insurance__offer-card-skeleton--price" />
                </BlockStack>
            </Box>
        </Surface>
    );
};

export default OfferCardSkeleton;
