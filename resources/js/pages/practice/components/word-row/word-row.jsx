import { useState, useRef, useEffect } from 'react';
import Box from '@/components/box/box';
import Text from '@/components/text/text';
import TextInput from '@/components/text-input/text-input';
import Button from '@/components/button/button';
import BlockStack from '@/components/block-stack/block-stack';

const WordRow = (props) => {
    const { wordData, direction, mode, answer, onAnswerChange, onReveal, isRevealed = false } = props;
    const [showAlternatePopup, setShowAlternatePopup] = useState(false);
    const alternateTriggerRef = useRef(null);

    useEffect(() => {
        if (!showAlternatePopup) return;
        const handleClickOutside = (e) => {
            if (alternateTriggerRef.current && !alternateTriggerRef.current.contains(e.target)) {
                setShowAlternatePopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showAlternatePopup]);

    const word = wordData.word;
    const nativeGloss = word.glosses?.find((g) => g.role === 'native');
    const middleGloss = word.glosses?.find((g) => g.role === 'middle');
    
    const isTargetToNative = direction === 'target-to-native';
    const shownText = isTargetToNative ? word.primary_reading : (nativeGloss?.meaning_text || middleGloss?.meaning_text || '');
    const shownLanguageCode = isTargetToNative ? word.target_language_code : (nativeGloss?.language_code || middleGloss?.language_code || '');
    const rightAnswerText = isTargetToNative 
        ? (nativeGloss?.meaning_text || middleGloss?.meaning_text || '')
        : word.primary_reading;
    const rightAnswerLanguageCode = isTargetToNative 
        ? (nativeGloss?.language_code || middleGloss?.language_code || '')
        : word.target_language_code;
    
    const handleReveal = () => {
        if (onReveal) {
            onReveal();
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
            <BlockStack className="word-row__content" gap="400">
                <BlockStack
                    gap="200"
                    inlineAlign="center"
                    style={{ textAlign: 'center' }}
                >
                    <Box
                        paddingBlock="100"
                        paddingInline="200"
                        backgroundColor="surface-100"
                        borderRadius="full"
                    >
                        <Text variant="body-s" fontWeight="medium">
                            {shownLanguageCode.toUpperCase()}
                        </Text>
                    </Box>
                    <Text variant="body-l" fontWeight="bold" align="center">
                        {shownText}
                    </Text>
                    <Box
                        className="word-row__kanji-row"
                        style={{
                            minHeight: 88,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <Box
                            paddingBlock="100"
                            paddingInline="200"
                            backgroundColor="surface-100"
                            borderRadius="full"
                        >
                            <Text variant="body-s" fontWeight="medium">
                                ALTERNATIVE
                            </Text>
                        </Box>
                        <Box
                            ref={alternateTriggerRef}
                            className="word-row__alternate-trigger"
                            opacity={0.85}
                            onClick={() => setShowAlternatePopup(true)}
                        >
                            <Text variant="body-l" fontWeight="bold" align="center">
                                {word.alternative_writing || word.primary_reading}
                            </Text>
                            {showAlternatePopup && (
                                <span className="word-row__alternate-tooltip" role="tooltip">
                                    {word.alternative_writing || word.primary_reading}
                                </span>
                            )}
                        </Box>
                    </Box>
                </BlockStack>

                <Box className="word-row__button-group">
                    <Button variant="primary" onClick={handleReveal}>
                        Reveal
                    </Button>
                </Box>

                <Box
                    className={`word-row__right-answer ${!isRevealed ? 'word-row__right-answer--hidden' : ''}`}
                    aria-hidden={!isRevealed}
                >
                    <BlockStack gap="200" inlineAlign="center" style={{ textAlign: 'center' }}>
                        <Box
                            paddingBlock="100"
                            paddingInline="200"
                            backgroundColor="surface-100"
                            borderRadius="full"
                        >
                            <Text variant="body-s" fontWeight="medium">
                                {rightAnswerLanguageCode.toUpperCase()}
                            </Text>
                        </Box>
                        <Text
                            variant="body-l"
                            fontWeight="bold"
                            align="center"
                            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                        >
                            {rightAnswerText}
                        </Text>
                    </BlockStack>
                </Box>

                <Box className="word-row__footer-spacer" />

                {isTypingMode && (
                    <Box paddingBlockStart="300" style={{ width: '100%' }}>
                        <TextInput
                            value={answer || ''}
                            onChange={handleAnswerChange}
                            placeholder="Type your answer..."
                        />
                    </Box>
                )}

                {!isTypingMode && (
                    <Box paddingBlockStart="300">
                        <Text variant="body-s" color="text-secondary" align="center">
                            Paper mode – no typing
                        </Text>
                    </Box>
                )}
            </BlockStack>
        </Box>
    );
};

export default WordRow;
