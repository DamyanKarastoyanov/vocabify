/**
 * Internal dependencies
 */
import BlockStack from '@/components/block-stack/block-stack';

const CardContent = (props) => {
    const { children } = props;

    return (
        <div className="bz-card__content">
            <BlockStack gap="100" align="center">{children}</BlockStack>
        </div>
    );
};

export default CardContent;
