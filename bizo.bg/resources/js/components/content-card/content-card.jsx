/**
 * External dependencies
 */
import classNames from "classnames";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";

const ContentCard = (props) => {
    const { children } = props;

    return (
        <div className={classNames("bz-content-card")}>
            <BlockStack gap="300" inlineAlign="center" align="center">
                {children}
            </BlockStack>
        </div>
    );
};

export default ContentCard;
