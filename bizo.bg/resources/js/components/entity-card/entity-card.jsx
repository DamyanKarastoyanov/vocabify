/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import Box from "@/components/box/box";
import IconRightArrowPlain from "@/components/icons/right-arrow-plain";

const EntityCard = (props) => {
    const {
        id,
        clickHandler,
        headerInfo,
        actionInfo,
        detailsInfo = null,
        detailsInfo2 = null,
    } = props;

    return (
        <Box
            key={id}
            className="bz-entity-card"
            onClick={() => {
                clickHandler(id);
            }}
            paddingBlock="400"
            paddingInline="600"
        >
            <InlineStack
                className="bz-entity-card__content"
                gap="600"
                align="space-between"
                blockAlign="center"
                wrap={false}
            >
                <InlineStack
                    className="bz-entity-card__content-left"
                    gap="600"
                    align="space-between"
                    blockAlign="center"
                    wrap={false}
                >
                    <BlockStack className="bz-entity-card__header-info">
                        <Box className="bz-entity-card__header">
                            <Text variant="body-m" color="text-primary">
                                {headerInfo}
                            </Text>
                        </Box>

                        {detailsInfo && (
                            <Box className="bz-entity-card__details">
                                {detailsInfo}
                            </Box>
                        )}
                    </BlockStack>

                    <BlockStack
                        className="bz-entity-card__actions"
                        gap="200"
                        inlineAlign="end"
                    >
                        <Text
                            variant="heading-s"
                            dangerouslySetInnerHTML={{ __html: actionInfo }}
                        />

                        {detailsInfo2 && (
                            <Box className="bz-entity-card__details">
                                {detailsInfo2}
                            </Box>
                        )}
                    </BlockStack>
                </InlineStack>

                <Icon
                    icon={IconRightArrowPlain}
                    color="text-secondary"
                    size="600"
                />
            </InlineStack>
        </Box>
    );
};

export default EntityCard;
