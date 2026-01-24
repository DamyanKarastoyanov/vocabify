import Box from '@/components/box/box';
import Text from '@/components/text/text';
import TextInput from '@/components/text-input/text-input';
import Button from '@/components/button/button';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';

const WordRow = (props) => {
    const { wordData, direction, mode, answer, onAnswerChange, onReveal, onHint, isRevealed = false, isHintShown = false, enableHints = true } = props;
    
    const word = wordData.word;
    const nativeGloss = word.glosses?.find((g) => g.role === 'native');
    const middleGloss = word.glosses?.find((g) => g.role === 'middle');
    const targetGloss = word.glosses?.find((g) => g.role === 'target');
    
    const isTargetToNative = direction === 'target-to-native';
    const shownText = isTargetToNative ? word.primary_reading : (nativeGloss?.meaning_text || middleGloss?.meaning_text || '');
    const shownLanguageCode = isTargetToNative ? word.target_language_code : (nativeGloss?.language_code || middleGloss?.language_code || '');
    const hiddenText = isTargetToNative 
        ? (nativeGloss?.meaning_text || middleGloss?.meaning_text || '')
        : word.primary_reading;
    const hiddenLanguageCode = isTargetToNative 
        ? (nativeGloss?.language_code || middleGloss?.language_code || '')
        : word.target_language_code;
    
    const hasMiddleGloss = !!middleGloss;
    
    const handleReveal = () => {
        if (onReveal) {
            onReveal();
        }
    };
    
    const handleHint = () => {
        if (onHint) {
            onHint();
        }
    };
    
    const handleAnswerChange = (e) => {
        if (onAnswerChange) {
            onAnswerChange(e.target.value);
        }
    };
    
    const isTypingMode = mode === 'typing';
    
    return (
        <Box className="word-row">
            {/* Prompt Row */}
            <Box className="word-row__prompt-row">
                <InlineStack align="space-between" blockAlign="center" gap="400">
                    <InlineStack gap="200" blockAlign="center">
                        <Box className="word-row__language-badge">
                            <Text variant="body-s" fontWeight="medium">
                                {shownLanguageCode.toUpperCase()}
                            </Text>
                        </Box>
                        <Text variant="body-l" fontWeight="bold" className="word-row__shown-word">
                            {shownText}
                        </Text>
                    </InlineStack>
                    
                    <Box className="word-row__hidden-section">
                        {!isRevealed ? (
                            <Text variant="body-m" color="text-secondary" className="word-row__hidden-dots">
                                • • • • • •
                            </Text>
                        ) : (
                            <InlineStack gap="200" blockAlign="center">
                                <Box className="word-row__language-badge">
                                    <Text variant="body-s" fontWeight="medium">
                                        {hiddenLanguageCode.toUpperCase()}
                                    </Text>
                                </Box>
                                <Text variant="body-l" fontWeight="bold" className="word-row__hidden-word">
                                    {hiddenText}
                                </Text>
                            </InlineStack>
                        )}
                    </Box>
                    
                    <InlineStack gap="200" blockAlign="center">
                        {hasMiddleGloss && enableHints && (
                            <Button 
                                variant="secondary" 
                                onClick={handleHint}
                                className={isHintShown ? "word-row__hide-hint-button" : "word-row__show-hint-button"}
                            >
                                {isHintShown ? 'Hide hint' : 'Show hint'}
                            </Button>
                        )}
                        <Button 
                            variant="primary" 
                            onClick={handleReveal}
                            className="word-row__reveal-button"
                        >
                            {isRevealed ? 'Hide' : 'Reveal'}
                        </Button>
                    </InlineStack>
                </InlineStack>
            </Box>
            
            {/* Hint Row */}
            {isHintShown && hasMiddleGloss && enableHints && (
                <Box className="word-row__hint-row">
                    <InlineStack gap="200" blockAlign="center">
                        <Box className="word-row__hint-accent" />
                        <Box className="word-row__language-badge word-row__language-badge--hint">
                            <Text variant="body-s" fontWeight="medium">
                                {middleGloss.language_code.toUpperCase()}
                            </Text>
                        </Box>
                        <Text variant="body-s" color="text-secondary" className="word-row__hint-text">
                            {middleGloss.meaning_text}
                        </Text>
                    </InlineStack>
                </Box>
            )}
            
            {/* Answer Row */}
            {isTypingMode && (
                <Box className="word-row__answer-row">
                    <TextInput
                        value={answer || ''}
                        onChange={handleAnswerChange}
                        placeholder="Type your answer..."
                        className="word-row__answer-input"
                    />
                </Box>
            )}
            
            {!isTypingMode && (
                <Box className="word-row__paper-mode">
                    <Text variant="body-s" color="text-secondary">
                        Paper mode – no typing
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default WordRow;
