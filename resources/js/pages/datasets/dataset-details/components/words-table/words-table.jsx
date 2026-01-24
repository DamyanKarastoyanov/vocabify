import Box from '@/components/box/box';
import Text from '@/components/text/text';
import Icon from '@/components/icon/icon';
import IconMore from '@/components/icons/more';
import IconChevronDown from '@/components/icons/chevron-down';
import InlineStack from '@/components/inline-stack/inline-stack';
import BlockStack from '@/components/block-stack/block-stack';

const WordsTable = (props) => {
    const { words = [], onWordClick, onWordMenuClick } = props;

    const renderStrength = (strength = 0, maxStrength = 6) => {
        const dots = [];
        for (let i = 0; i < maxStrength; i++) {
            dots.push(
                <Box
                    key={i}
                    className={`words-table__strength-dot ${i < strength ? 'words-table__strength-dot--filled' : ''}`}
                />
            );
        }
        return <InlineStack gap="50">{dots}</InlineStack>;
    };

    const renderTags = (tags = []) => {
        if (!tags || tags.length === 0) return null;
        return (
            <InlineStack gap="100" wrap>
                {tags.map((tag, index) => (
                    <Box key={index} className="words-table__tag">
                        <Text variant="body-s" color="text-secondary">
                            {tag}
                        </Text>
                    </Box>
                ))}
            </InlineStack>
        );
    };

    return (
        <Box className="words-table">
            <Box className="words-table__wrapper">
                <table className="words-table__table">
                    <thead>
                        <tr>
                            <th>
                                <Box as="input" type="checkbox" className="words-table__checkbox" />
                            </th>
                            <th>
                                <InlineStack gap="100" blockAlign="center">
                                    <Text variant="body-s" fontWeight="medium">Word</Text>
                                    <Icon size="300" icon={IconChevronDown} />
                                </InlineStack>
                            </th>
                            <th>
                                <Text variant="body-s" fontWeight="medium">Romanization</Text>
                            </th>
                            <th>
                                <Text variant="body-s" fontWeight="medium">Native meaning</Text>
                            </th>
                            <th>
                                <Text variant="body-s" fontWeight="medium">Middle language</Text>
                            </th>
                            <th>
                                <Text variant="body-s" fontWeight="medium">Tags</Text>
                            </th>
                            <th>
                                <Text variant="body-s" fontWeight="medium">Strength</Text>
                            </th>
                            <th>
                                <InlineStack gap="100" blockAlign="center">
                                    <Text variant="body-s" fontWeight="medium">Last practiced</Text>
                                    <Icon size="300" icon={IconChevronDown} />
                                </InlineStack>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {words.length === 0 ? (
                            <tr>
                                <td colSpan="9">
                                    <Box paddingBlockStart="400" paddingBlockEnd="400">
                                        <Text align="center" color="text-secondary">
                                            No words found
                                        </Text>
                                    </Box>
                                </td>
                            </tr>
                        ) : (
                            words.map((word, index) => (
                                <tr key={word.id || index} className="words-table__row">
                                    <td>
                                        <Box as="input" type="checkbox" className="words-table__checkbox" />
                                    </td>
                                    <td>
                                        <BlockStack gap="50">
                                            <Text variant="body-m" fontWeight="medium">
                                                {word.primary_reading} {word.alternative_writing && word.alternative_writing}
                                            </Text>
                                            {word.romanization && (
                                                <Text variant="body-s" color="text-secondary">
                                                    ({word.romanization})
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </td>
                                    <td>
                                        <Text variant="body-m">{word.romanization || '—'}</Text>
                                    </td>
                                    <td>
                                        <BlockStack gap="50">
                                            <Text variant="body-m">
                                                {word.native_meaning || '—'}
                                            </Text>
                                            {word.native_meaning_alt && (
                                                <Text variant="body-s" color="text-secondary">
                                                    {word.native_meaning_alt}
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </td>
                                    <td>
                                        {word.middle_language ? (
                                            <Box className="words-table__tag">
                                                <Text variant="body-s" color="text-secondary">
                                                    {word.middle_language}
                                                </Text>
                                            </Box>
                                        ) : (
                                            <Text variant="body-m">—</Text>
                                        )}
                                    </td>
                                    <td>
                                        {renderTags(word.tags)}
                                    </td>
                                    <td>
                                        {renderStrength(word.strength, 6)}
                                    </td>
                                    <td>
                                        <Text variant="body-m" color="text-secondary">
                                            {word.last_practiced || '—'}
                                        </Text>
                                    </td>
                                    <td>
                                        <Box
                                            className="words-table__menu-button"
                                            onClick={() => onWordMenuClick && onWordMenuClick(word)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <Icon size="400" icon={IconMore} />
                                        </Box>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default WordsTable;
