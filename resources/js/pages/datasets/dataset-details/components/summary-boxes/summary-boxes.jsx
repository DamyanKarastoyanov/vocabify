import Box from '@/components/box/box';
import Text from '@/components/text/text';
import BlockStack from '@/components/block-stack/block-stack';

const SummaryBoxes = (props) => {
    const { dueToday, mastered, newWords } = props;

    return (
        <Box className="summary-boxes">
            <Box className="summary-boxes__box">
                <BlockStack gap="100">
                    <Text variant="body-s" color="text-secondary">
                        Due today
                    </Text>
                    <Text variant="heading-l" fontWeight="bold" color="text-primary">
                        {dueToday || 0}
                    </Text>
                </BlockStack>
            </Box>
            <Box className="summary-boxes__box">
                <BlockStack gap="100">
                    <Text variant="body-s" color="text-secondary">
                        Mastered
                    </Text>
                    <Text variant="heading-l" fontWeight="bold" color="text-primary">
                        {mastered || 0}
                    </Text>
                </BlockStack>
            </Box>
            <Box className="summary-boxes__box">
                <BlockStack gap="100">
                    <Text variant="body-s" color="text-secondary">
                        New
                    </Text>
                    <Text variant="heading-l" fontWeight="bold" color="text-primary">
                        {newWords || 0}
                    </Text>
                </BlockStack>
            </Box>
        </Box>
    );
};

export default SummaryBoxes;
