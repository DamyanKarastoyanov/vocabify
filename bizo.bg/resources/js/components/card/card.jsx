/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import CardMedia from '@/components/card/card-media';
import CardContent from '@/components/card/card-content';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';
import CardOrientationEnum from '@/components/card/card-orientation-enum';

const Card = (props) => {
    const { children, orientation = CardOrientationEnum.VERTICAL, disabled } = props;

    return (
        <div className={classNames('bz-card', disabled && 'bz-card--disabled')}>
            {orientation === CardOrientationEnum.VERTICAL ? (
                <BlockStack gap="300">{children}</BlockStack>
            ) : (
                <InlineStack gap="300" style={{ width: '100%' }}>
                    {children}
                </InlineStack>
            )}
        </div>
    );
};

Card.Media = CardMedia;
Card.Content = CardContent;

export default Card;
