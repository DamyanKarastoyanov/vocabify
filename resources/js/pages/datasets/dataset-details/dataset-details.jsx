import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Layout from '@/layouts/layout/layout';
import Text from '@/components/text/text';
import Box from '@/components/box/box';
import Button from '@/components/button/button';
import TextInput from '@/components/text-input/text-input';
import InlineStack from '@/components/inline-stack/inline-stack';
import BlockStack from '@/components/block-stack/block-stack';
import Icon from '@/components/icon/icon';
import IconSearch from '@/components/icons/search';
import IconList from '@/components/icons/list';
import IconGrid from '@/components/icons/grid';
import IconCompact from '@/components/icons/compact';
import IconChevronDown from '@/components/icons/chevron-down';
import SummaryBoxes from './components/summary-boxes/summary-boxes';
import WordsTable from './components/words-table/words-table';

const DatasetDetails = () => {
    const props = usePage().props;
    const dataset = props.dataset?.data || props.dataset;
    const words = props.words?.data || props.words || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [studyMode, setStudyMode] = useState('all'); // 'all' or 'due'
    const [sortBy, setSortBy] = useState('last_practiced');
    const [lastPracticedFilter, setLastPracticedFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'compact'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const handleBack = () => {
        router.visit('/datasets');
    };

    const handlePractice = () => {
        router.visit(`/datasets/${dataset.id}/practice`);
    };

    const handleAddWord = () => {
        router.visit(`/datasets/${dataset.id}/words/create`);
    };

    const handleWordMenuClick = (word) => {
        // TODO: Implement word menu actions
        console.log('Word menu clicked:', word);
    };

    const handleWordClick = (word) => {
        // TODO: Navigate to word details or edit
        console.log('Word clicked:', word);
    };

    if (!dataset) {
        return (
            <Box className="dataset-details">
                <Text>Dataset not found</Text>
            </Box>
        );
    }

    const dueToday = dataset.progress?.due?.count || 0;
    const mastered = dataset.progress?.known?.count || 0;
    const newWords = dataset.progress?.new?.count || 0;

    const filteredWords = words.filter((word) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                word.primary_reading?.toLowerCase().includes(query) ||
                word.alternative_writing?.toLowerCase().includes(query) ||
                word.romanization?.toLowerCase().includes(query) ||
                word.native_meaning?.toLowerCase().includes(query) ||
                word.middle_language?.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }
        return true;
    });

    const paginatedWords = filteredWords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredWords.length / itemsPerPage);

    return (
        <Box className="dataset-details" paddingBlockStart="800" paddingBlockEnd="800" paddingInlineStart="800" paddingInlineEnd="800">
            <Box maxWidth="1280px" width="100%" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                <BlockStack gap="600">
                    <InlineStack align="space-between" blockAlign="center" wrap gap="400">
                        <BlockStack gap="400">
                            <Text as="h1" variant="heading-xl" fontWeight="bold" color="text-primary">
                                {dataset.name}
                            </Text>
                            <Text variant="body-l" color="text-secondary">
                                {dataset.target_language_code.toUpperCase()} • {dataset.words_count} words
                            </Text>
                            <Text variant="body-m" color="text-secondary">
                                Created: {dataset.created_at} • Last practiced: {dataset.last_practiced_at || 'Never'}
                            </Text>
                        </BlockStack>
                        <Button variant="secondary" onClick={handleBack} style={{ alignSelf: 'flex-start' }}>
                            ← Back to Datasets
                        </Button>
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="center" wrap>
                        <SummaryBoxes dueToday={dueToday} mastered={mastered} newWords={newWords} />
                        <InlineStack gap="300" blockAlign="center">
                            <Button variant="primary" onClick={handlePractice}>
                                Practice this dataset
                            </Button>
                            <Button variant="secondary" onClick={handleAddWord}>
                                Add new word
                            </Button>
                        </InlineStack>
                    </InlineStack>

                    <InlineStack gap="300" blockAlign="center">
                        <Text variant="body-m" fontWeight="medium">Study mode:</Text>
                        <InlineStack gap="0">
                            <Button
                                variant={studyMode === 'all' ? 'secondary' : 'plain'}
                                pressed={studyMode === 'all'}
                                onClick={() => setStudyMode('all')}
                            >
                                All words
                            </Button>
                            <Button
                                variant={studyMode === 'due' ? 'secondary' : 'plain'}
                                pressed={studyMode === 'due'}
                                onClick={() => setStudyMode('due')}
                            >
                                Due only
                            </Button>
                        </InlineStack>
                    </InlineStack>

                    <InlineStack align="space-between" blockAlign="center" wrap gap="400">
                        <Box className="dataset-details__search" style={{ maxWidth: '400px', width: '100%' }}>
                            <Box className="dataset-details__search-wrapper">
                                <Icon size="400" icon={IconSearch} className="dataset-details__search-icon" />
                                <TextInput
                                    type="text"
                                    placeholder="Search in this dataset..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="dataset-details__search-input"
                                />
                            </Box>
                        </Box>

                        <InlineStack gap="300" blockAlign="center" wrap>
                            <InlineStack gap="100" blockAlign="center">
                                <Text variant="body-s" color="text-secondary">Sort by</Text>
                                <Box as="select" className="dataset-details__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="word">Word</option>
                                    <option value="last_practiced">Last practiced</option>
                                    <option value="strength">Strength</option>
                                    <option value="created">Created</option>
                                </Box>
                            </InlineStack>
                            <InlineStack gap="100" blockAlign="center">
                                <Text variant="body-s" color="text-secondary">Last practiced</Text>
                                <Box as="select" className="dataset-details__select" value={lastPracticedFilter} onChange={(e) => setLastPracticedFilter(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="today">Today</option>
                                    <option value="week">This week</option>
                                    <option value="month">This month</option>
                                </Box>
                            </InlineStack>
                            <InlineStack gap="0">
                                <Button
                                    variant={viewMode === 'compact' ? 'secondary' : 'plain'}
                                    pressed={viewMode === 'compact'}
                                    onClick={() => setViewMode('compact')}
                                >
                                    <Icon size="400" icon={IconCompact} />
                                </Button>
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'plain'}
                                    pressed={viewMode === 'grid'}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Icon size="400" icon={IconGrid} />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'plain'}
                                    pressed={viewMode === 'list'}
                                    onClick={() => setViewMode('list')}
                                >
                                    <Icon size="400" icon={IconList} />
                                </Button>
                            </InlineStack>
                        </InlineStack>
                    </InlineStack>

                    <WordsTable
                        words={paginatedWords}
                        onWordClick={handleWordClick}
                        onWordMenuClick={handleWordMenuClick}
                    />

                    {totalPages > 1 && (
                        <InlineStack align="space-between" blockAlign="center">
                            <Text variant="body-m" color="text-secondary">
                                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredWords.length)} of {filteredWords.length} words
                            </Text>
                            <InlineStack gap="200" blockAlign="center">
                                <Button
                                    variant="secondary"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    &lt; Previous
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? 'primary' : 'secondary'}
                                        pressed={currentPage === page}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="secondary"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next &gt;
                                </Button>
                            </InlineStack>
                        </InlineStack>
                    )}
                </BlockStack>
            </Box>
        </Box>
    );
};

export default Layout.wrap(DatasetDetails);
