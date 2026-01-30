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
import IconUpload from '@/components/icons/upload';
import IconList from '@/components/icons/list';
import IconGrid from '@/components/icons/grid';
import IconCompact from '@/components/icons/compact';
import DatasetCard from './components/dataset-card/dataset-card';
import NewDatasetCard from './components/new-dataset-card/new-dataset-card';

const Datasets = () => {
    const props = usePage().props;
    const datasets = props.datasets?.data || props.datasets || [];
    
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'compact'
    const [languageFilter, setLanguageFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recently-updated');

    const filteredDatasets = datasets.filter((dataset) => {
        if (searchQuery && !dataset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (languageFilter !== 'all' && dataset.target_language_code !== languageFilter) {
            return false;
        }
        return true;
    });

    const handleNewDataset = () => {
        router.visit('/datasets/create');
    };

    const handleImportDataset = () => {
        router.visit('/datasets/create');
    };

    const handleOpenDataset = (dataset) => {
        router.visit(`/datasets/${dataset.id}`);
    };

    const handlePreviewDataset = (dataset) => {
        // TODO: Implement preview
        console.log('Preview dataset', dataset.id);
    };

    const handleMenuClick = (dataset) => {
        // TODO: Implement menu
        console.log('Menu for dataset', dataset.id);
    };

    const uniqueLanguages = [...new Set(datasets.map(d => d.target_language_code))];

    return (
        <Box className="datasets-page" paddingBlockStart="800" paddingBlockEnd="800" paddingInlineStart="800" paddingInlineEnd="800">
            <Box maxWidth="1280px" width="100%" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                <BlockStack gap="600">
                    {/* Header */}
                    <BlockStack gap="200">
                        <Text as="h1" variant="heading-xl" fontWeight="bold" color="text-primary">
                            Datasets
                        </Text>
                        <Text variant="body-l" color="text-secondary">
                            Curate the words and sentences you'll actually use. Organize by language, topic, or learner.
                        </Text>
                    </BlockStack>

                    {/* Action Buttons */}
                    <InlineStack align="end" gap="300">
                        <Button 
                            variant="secondary" 
                            onClick={handleImportDataset}
                            prefix={<Icon size="400" icon={IconUpload} />}
                        >
                            Import dataset
                        </Button>
                        <Button variant="primary" onClick={handleNewDataset}>
                            + New dataset
                        </Button>
                    </InlineStack>

                    {/* Search and Filters */}
                    <BlockStack gap="400">
                        <TextInput
                            type="text"
                            placeholder="Search datasets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="datasets-page__search"
                        />
                        <InlineStack align="space-between" blockAlign="center" gap="400">
                            <InlineStack gap="300">
                                <Box as="select" 
                                    className="datasets-page__filter"
                                    value={languageFilter}
                                    onChange={(e) => setLanguageFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    {uniqueLanguages.map(lang => (
                                        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                    ))}
                                </Box>
                                <Box as="select" 
                                    className="datasets-page__filter"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="recently-updated">Recently updated</option>
                                    <option value="name">Name</option>
                                    <option value="words-count">Words count</option>
                                </Box>
                            </InlineStack>
                            <InlineStack gap="100">
                                <Box 
                                    className={`datasets-page__view-toggle ${viewMode === 'list' ? 'datasets-page__view-toggle--active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <Icon size="500" icon={IconList} />
                                </Box>
                                <Box 
                                    className={`datasets-page__view-toggle ${viewMode === 'grid' ? 'datasets-page__view-toggle--active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <Icon size="500" icon={IconGrid} />
                                </Box>
                                <Box 
                                    className={`datasets-page__view-toggle ${viewMode === 'compact' ? 'datasets-page__view-toggle--active' : ''}`}
                                    onClick={() => setViewMode('compact')}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <Icon size="500" icon={IconCompact} />
                                </Box>
                            </InlineStack>
                        </InlineStack>
                    </BlockStack>

                    {/* Datasets Grid */}
                    {filteredDatasets.length > 0 ? (
                        <Box className={`datasets-page__grid datasets-page__grid--${viewMode}`}>
                            {filteredDatasets.map((dataset) => (
                                <DatasetCard
                                    key={dataset.id}
                                    dataset={dataset}
                                    onOpen={handleOpenDataset}
                                    onPreview={handlePreviewDataset}
                                    onMenuClick={() => handleMenuClick(dataset)}
                                />
                            ))}
                            <NewDatasetCard onClick={handleNewDataset} />
                        </Box>
                    ) : (
                        <Box className="datasets-page__empty">
                            <Text variant="body-m" color="text-secondary">
                                {searchQuery ? 'No datasets found matching your search.' : 'No datasets found. Create your first dataset to get started.'}
                            </Text>
                        </Box>
                    )}
                </BlockStack>
            </Box>
        </Box>
    );
};

export default Layout.wrap(Datasets);
