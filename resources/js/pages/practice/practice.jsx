import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import httpClient from '@/data/http-client';
import Layout from '@/layouts/layout/layout';
import Box from '@/components/box/box';
import Button from '@/components/button/button';
import Text from '@/components/text/text';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';
import WordRow from './components/word-row/word-row';
import './practice.scss';

const Practice = (props) => {
    const props_data = usePage().props;
    const dataset = props_data.dataset?.data || props_data.dataset;
    const practiceSession = props_data.practiceSession?.data || props_data.practiceSession;
    const recallDirectionConfig = props_data.recallDirection || 'mixed';
    const modeConfig = props_data.mode || 'paper';
    
    const words = practiceSession?.words || [];
    const [answers, setAnswers] = useState({});
    const [revealed, setRevealed] = useState({});
    const route = useRoute();
    const [recallDirections] = useState(() => {
        if (recallDirectionConfig === 'mixed') {
            return words.map(() => Math.random() < 0.5 ? 'target-to-native' : 'native-to-target');
        }
        // All words use the same direction
        return words.map(() => recallDirectionConfig);
    });

    const totalWords = words.length;
    const revealedCount = Object.keys(revealed).filter(key => revealed[key]).length;
    const allRevealed = totalWords > 0 && revealedCount === totalWords;
    const enableHints = props_data.enableHints !== undefined ? props_data.enableHints : true;

    const handleAnswerChange = (wordId, answer) => {
        setAnswers((prev) => ({
            ...prev,
            [wordId]: answer,
        }));
    };

    const handleReveal = (wordId, practiceSessionItemId) => {
        const newRevealedState = !revealed[wordId];
        setRevealed((prev) => ({
            ...prev,
            [wordId]: newRevealedState,
        }));

        // When revealing (marking as answered), save to database
        if (newRevealedState && practiceSessionItemId) {
            httpClient.post(`/practice-session-items/${practiceSessionItemId}/answer`, {
                result: 'skipped'
            }).catch((error) => {
                console.error('Failed to save answer:', error);
            });
        }
    };

    const handleBack = () => {
        router.visit('/practices');
    };

    const handleToggleRevealAll = () => {
        if (allRevealed) {
            setRevealed({});
            return;
        }
        const nextRevealed = {};
        words.forEach((wordData) => {
            const wordId = wordData.word.id;
            const practiceSessionItemId = wordData.practice_session_item_id;
            nextRevealed[wordId] = true;
            if (practiceSessionItemId) {
                httpClient.post(`/practice-session-items/${practiceSessionItemId}/answer`, {
                    result: 'skipped'
                }).catch((error) => {
                    console.error('Failed to save answer:', error);
                });
            }
        });
        setRevealed(nextRevealed);
    };

    const handleNewSession = () => {
        router.post(`/datasets/${dataset.id}/practice-sessions`, {
            itemsPerSession: totalWords,
            recallDirection: recallDirectionConfig,
            mode: modeConfig,
            enableHints,
        });
    };

    const handleFinishSession = async () => {
        // Mark session as completed
        try {
            await httpClient.post(`/practice-sessions/${practiceSession.id}/complete`);
        } catch (error) {
            console.error('Failed to complete session:', error);
        }
        
        // Navigate to practices list
        router.visit('/practices');
    };

    if (!practiceSession || words.length === 0) {
        return (
            <Layout>
                <Box padding="800" maxWidth="1280px" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                    <BlockStack gap="400">
                        <Text variant="heading-l">No practice session</Text>
                        <Text variant="body-m" color="text-secondary">
                            No words available for practice.
                        </Text>
                        <Button variant="secondary" onClick={handleBack}>
                            Back to Practices
                        </Button>
                    </BlockStack>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box className="practice" padding="800">
                <BlockStack gap="600">
                    <Box className="practice__header-wrapper" maxWidth="1280px" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                        <BlockStack gap="200" className="practice__header">
                            <Button variant="plain" onClick={handleBack}>
                                ← Back to Practices
                            </Button>
                            <Text variant="heading-l" fontWeight="bold">{dataset.name}</Text>
                            <Text variant="body-s" color="text-secondary">
                                Session • {totalWords} words • Mode: {modeConfig === 'typing' ? 'Typing' : 'Paper'}
                            </Text>
                        </BlockStack>
                    </Box>

                    <Box className="practice__body">
                        <Box className="practice__list-header">
                            <InlineStack gap="200" blockAlign="center">
                                <Button
                                    variant="primary"
                                    className="practice__download-button"
                                    onClick={() => { window.location.href = route('practice.pdf', { practiceSession: practiceSession.id }); }}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="primary"
                                    className="practice__reveal-all-button"
                                    onClick={handleToggleRevealAll}
                                >
                                    {allRevealed ? 'Hide all' : 'Reveal all'}
                                </Button>
                                <Button
                                    variant="primary"
                                    className="practice__new-session-button"
                                    onClick={handleNewSession}
                                >
                                    New session
                                </Button>
                            </InlineStack>
                        </Box>
                        <Box className="practice__word-list">
                            {words.map((wordData, index) => {
                                const wordId = wordData.word.id;
                                const practiceSessionItemId = wordData.practice_session_item_id;
                                return (
                                    <WordRow
                                        key={practiceSessionItemId || index}
                                        wordData={wordData}
                                        direction={recallDirections[index]}
                                        mode={modeConfig}
                                        answer={answers[wordId] || ''}
                                        isRevealed={revealed[wordId] || false}
                                        onAnswerChange={(answer) => handleAnswerChange(wordId, answer)}
                                        onReveal={() => handleReveal(wordId, practiceSessionItemId)}
                                    />
                                );
                            })}
                        </Box>
                    </Box>

                    <Box className="practice__footer">
                        <InlineStack align="space-between" blockAlign="center" gap="400">
                            <Text variant="body-m" color="text-secondary">
                                Summary: {revealedCount} / {totalWords} revealed
                            </Text>
                            <InlineStack gap="200" blockAlign="center">
                                <Button
                                    variant="primary"
                                    onClick={handleFinishSession}
                                    className="practice__finish-button"
                                >
                                    Finish Session
                                </Button>
                            </InlineStack>
                        </InlineStack>
                    </Box>
                </BlockStack>
            </Box>
        </Layout>
    );
};

export default Practice;
