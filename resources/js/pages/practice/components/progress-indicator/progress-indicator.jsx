import Box from '@/components/box/box';
import Text from '@/components/text/text';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';

const ProgressIndicator = (props) => {
    const { current, total, progress } = props;

    return (
        <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
                <Text variant="body-m" color="text-secondary">
                    Word {current} of {total}
                </Text>
                <Text variant="body-s" color="text-secondary">
                    {Math.round(progress)}%
                </Text>
            </InlineStack>
            <Box className="progress-indicator">
                <Box
                    className="progress-indicator__bar"
                    dangerouslySetInlineStyle={{ __style: { width: `${progress}%` } }}
                />
            </Box>
        </BlockStack>
    );
};

export default ProgressIndicator;
