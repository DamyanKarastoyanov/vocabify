import Box from '@/components/box/box';
import Text from '@/components/text/text';
import BlockStack from '@/components/block-stack/block-stack';
import Icon from '@/components/icon/icon';
import IconPlus from '@/components/icons/plus';

const NewDatasetCard = (props) => {
    const { onClick } = props;

    return (
        <Box 
            className="new-dataset-card"
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <BlockStack gap="300" blockAlign="center">
                <Box className="new-dataset-card__icon">
                    <Icon size="1200" icon={IconPlus} />
                </Box>
                <Text variant="body-m" fontWeight="medium">
                    New dataset
                </Text>
            </BlockStack>
        </Box>
    );
};

export default NewDatasetCard;
