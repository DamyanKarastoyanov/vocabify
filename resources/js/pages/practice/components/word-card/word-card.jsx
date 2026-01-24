import { useState, useEffect } from 'react';
import Box from '@/components/box/box';
import Text from '@/components/text/text';
import TextInput from '@/components/text-input/text-input';
import Button from '@/components/button/button';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';

const WordCard = (props) => {
    const { word, direction, answer, onAnswerChange } = props;
    const [showAnswer, setShowAnswer] = useState(false);

    // Reset showAnswer when word changes
    useEffect(() => {
        setShowAnswer(answer === '__external__');
    }, [word.id, answer]);

    // Get native and target glosses
    const nativeGloss = word.glosses?.find((g) => g.role === 'native');
    const middleGloss = word.glosses?.find((g) => g.role === 'middle');
    const targetGloss = word.glosses?.find((g) => g.role === 'target');

    // Determine what to show based on direction
    const isTargetToNative = direction === 'target-to-native';
    const prompt = isTargetToNative ? word.primary_reading : (nativeGloss?.meaning_text || middleGloss?.meaning_text || '');
    const expectedAnswer = isTargetToNative 
        ? (nativeGloss?.meaning_text || middleGloss?.meaning_text || '')
        : word.primary_reading;

    const handleInputChange = (e) => {
        onAnswerChange(e.target.value);
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleExternalRecall = () => {
        onAnswerChange('__external__');
        setShowAnswer(true);
    };

    return (
        <Box className="word-card">
            <BlockStack gap="600">
                <Box className="word-card__prompt">
                    <BlockStack gap="200">
                        <Text variant="body-s" color="text-secondary" fontWeight="medium">
                            {isTargetToNative ? 'Target Language' : 'Native Language'}
                        </Text>
                        <Text variant="heading-xl" fontWeight="bold">
                            {prompt}
                        </Text>
                        {word.alternative_writing && isTargetToNative && (
                            <Text variant="body-l" color="text-secondary">
                                {word.alternative_writing}
                            </Text>
                        )}
                        {word.romanization && isTargetToNative && (
                            <Text variant="body-m" color="text-secondary">
                                {word.romanization}
                            </Text>
                        )}
                    </BlockStack>
                </Box>

                <Box className="word-card__answer-section">
                    <BlockStack gap="300">
                        <Text variant="body-s" color="text-secondary" fontWeight="medium">
                            {isTargetToNative ? 'Native Language' : 'Target Language'}
                        </Text>
                        {!showAnswer && answer !== '__external__' && (
                            <TextInput
                                value={answer}
                                onChange={handleInputChange}
                                placeholder="Type your answer..."
                                autoFocus
                            />
                        )}
                        {(showAnswer || answer === '__external__') && (
                            <Box className="word-card__answer">
                                <Text variant="body-l" fontWeight="medium">
                                    {expectedAnswer}
                                </Text>
                                {answer && answer !== '__external__' && (
                                    <Text variant="body-m" color="text-secondary">
                                        Your answer: {answer}
                                    </Text>
                                )}
                                {answer === '__external__' && (
                                    <Text variant="body-m" color="text-secondary">
                                        External recall (paper/mental)
                                    </Text>
                                )}
                            </Box>
                        )}
                    </BlockStack>
                </Box>

                {!showAnswer && answer !== '__external__' && (
                    <InlineStack gap="300">
                        <Button variant="secondary" onClick={handleShowAnswer}>
                            Show Answer
                        </Button>
                        <Button variant="plain" onClick={handleExternalRecall}>
                            External Recall
                        </Button>
                    </InlineStack>
                )}
            </BlockStack>
        </Box>
    );
};

export default WordCard;
