import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/layouts/layout/layout';
import Text from '@/components/text/text';
import Box from '@/components/box/box';
import Button from '@/components/button/button';
import TextInput from '@/components/text-input/text-input';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';

const formatDate = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const Practices = () => {
    const { practiceSessions } = usePage().props;
    const sessions = practiceSessions?.data ?? practiceSessions ?? [];
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSessions = sessions.filter((session) => {
        if (!searchQuery) return true;
        const datasetName = session.dataset_name ?? '';
        return datasetName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleOpenSession = (session) => {
        router.visit(`/practice-sessions/${session.id}`);
    };

    const handleViewPdf = (e, session) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`/practice-sessions/${session.id}/pdf`, '_blank');
    };

    return (
        <Box
            backgroundColor="surface-100"
            minHeight="100%"
            paddingBlockStart="800"
            paddingBlockEnd="800"
            paddingInlineStart="800"
            paddingInlineEnd="800"
        >
            <Box maxWidth="1280px" width="100%" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                <BlockStack gap="600">
                    <BlockStack gap="200">
                        <Text as="h1" variant="heading-xl" fontWeight="bold" color="text-primary">
                            Practices
                        </Text>
                        <Text variant="body-l" color="text-secondary">
                            All practice sessions you have completed or started.
                        </Text>
                    </BlockStack>

                    <TextInput
                        type="text"
                        placeholder="Search by dataset name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="practices-page__search"
                    />

                    {filteredSessions.length > 0 ? (
                        <Box as="ul" className="practices-page__grid" role="list">
                            {filteredSessions.map((session) => (
                                <Box
                                    as="li"
                                    key={session.id}
                                    className="practices-page__card"
                                    backgroundColor="surface-0"
                                    padding="400"
                                    borderRadius="200"
                                    cursor="pointer"
                                    onClick={() => handleOpenSession(session)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleOpenSession(session);
                                        }
                                    }}
                                >
                                    <BlockStack gap="300" blockAlign="stretch" height="100%">
                                        <Text variant="body-m" fontWeight="semibold" color="text-primary" className="practices-page__card-title">
                                            {session.dataset_name ?? 'Unknown dataset'}
                                        </Text>
                                        <Box dangerouslySetInlineStyle={{ __style: { flex: 1 } }}>
                                            <BlockStack gap="100">
                                                <Text variant="body-s" color="text-secondary">
                                                    Started: {formatDate(session.started_at)}
                                                </Text>
                                                {session.completed_at && (
                                                    <Text variant="body-s" color="text-secondary">
                                                        Completed: {formatDate(session.completed_at)}
                                                    </Text>
                                                )}
                                                <Text variant="body-s" color="text-secondary">
                                                    {session.total_items} items
                                                </Text>
                                            </BlockStack>
                                        </Box>
                                        <Box paddingBlockStart="300">
                                            <InlineStack align="center" gap="200">
                                                <Button variant="secondary" onClick={(e) => handleViewPdf(e, session)}>
                                                    View PDF
                                                </Button>
                                            </InlineStack>
                                        </Box>
                                    </BlockStack>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box
                            padding="800"
                            backgroundColor="surface-0"
                            className="practices-page__empty"
                        >
                            <Text variant="body-m" color="text-secondary">
                                {searchQuery
                                    ? 'No practice sessions found matching your search.'
                                    : 'No practice sessions yet. Start a practice from a dataset to see your history here.'}
                            </Text>
                        </Box>
                    )}
                </BlockStack>
            </Box>
        </Box>
    );
};

export default Layout.wrap(Practices);
