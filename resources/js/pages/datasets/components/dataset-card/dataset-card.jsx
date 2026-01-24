import Box from '@/components/box/box';
import Text from '@/components/text/text';
import Button from '@/components/button/button';
import InlineStack from '@/components/inline-stack/inline-stack';
import BlockStack from '@/components/block-stack/block-stack';
import Icon from '@/components/icon/icon';
import IconMore from '@/components/icons/more';
import IconFolder from '@/components/icons/folder';

const DatasetCard = (props) => {
    const { dataset, onOpen, onPreview, onMenuClick } = props;

    const getLanguageTagColor = (code) => {
        const colors = {
            'ja': 'yellow',
            'jp': 'grey',
            'ko': 'blue',
            'es': 'red',
        };
        return colors[code] || 'grey';
    };

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    return (
        <Box className="dataset-card">
            <Box className="dataset-card__header">
                <InlineStack align="space-between" blockAlign="center" gap="300">
                    <InlineStack gap="200" blockAlign="center">
                        <Text as="h3" variant="heading-m" fontWeight="semibold" className="dataset-card__title">
                            {dataset.name}
                        </Text>
                        <Box className={`dataset-card__language-tag dataset-card__language-tag--${getLanguageTagColor(dataset.target_language_code)}`}>
                            <Text variant="body-s" fontWeight="medium">
                                {dataset.target_language_code}
                            </Text>
                        </Box>
                    </InlineStack>
                    <Box 
                        className="dataset-card__menu-button"
                        onClick={onMenuClick}
                        role="button"
                        tabIndex={0}
                    >
                        <Icon size="500" icon={IconMore} />
                    </Box>
                </InlineStack>
            </Box>

            <BlockStack gap="100" className="dataset-card__content">
                <Text variant="body-m" color="text-secondary">
                    Words: {formatNumber(dataset.words_count)}
                </Text>
                <Text variant="body-m" color="text-secondary">
                    Added: {dataset.created_at}
                </Text>
                {dataset.last_practiced_at && (
                    <Text variant="body-m" color="text-secondary">
                        Last practiced: {dataset.last_practiced_at}
                    </Text>
                )}
            </BlockStack>

            {dataset.progress && (
                <Box className="dataset-card__progress">
                    <InlineStack gap="200" className="dataset-card__progress-labels">
                        <Text variant="body-s" className="dataset-card__progress-label dataset-card__progress-label--known">
                            Known: {dataset.progress.known.percent}%
                        </Text>
                        <Text variant="body-s" className="dataset-card__progress-label dataset-card__progress-label--learning">
                            Learning: {dataset.progress.learning.percent}%
                        </Text>
                        <Text variant="body-s" className="dataset-card__progress-label dataset-card__progress-label--new">
                            New: {dataset.progress.new.percent}%
                        </Text>
                    </InlineStack>
                    <Box className="dataset-card__progress-bar">
                        <Box 
                            className="dataset-card__progress-segment dataset-card__progress-segment--known"
                            style={{ width: `${dataset.progress.known.percent}%` }}
                        />
                        <Box 
                            className="dataset-card__progress-segment dataset-card__progress-segment--learning"
                            style={{ width: `${dataset.progress.learning.percent}%` }}
                        />
                        <Box 
                            className="dataset-card__progress-segment dataset-card__progress-segment--new"
                            style={{ width: `${dataset.progress.new.percent}%` }}
                        />
                    </Box>
                </Box>
            )}

            {dataset.tags && dataset.tags.length > 0 && (
                <InlineStack gap="100" wrap className="dataset-card__tags">
                    {dataset.tags.map((tag, index) => (
                        <Box key={index} className="dataset-card__tag">
                            {index === 0 && (
                                <Icon
                                    size="350"
                                    icon={IconFolder}
                                    className="dataset-card__tag-icon"
                                />
                            )}
                            <Text variant="body-s" color="text-secondary">
                                {tag}
                            </Text>
                        </Box>
                    ))}
                </InlineStack>
            )}
        </Box>
    );
};

export default DatasetCard;
