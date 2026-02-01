import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Popper from '@/components/popper/popper';
import Button from '@/components/button/button';
import Text from '@/components/text/text';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';
import Box from '@/components/box/box';
import FormLabel from '@/components/form-label/form-label';

const DEFAULT_ITEMS_PER_SESSION = 10;
const ITEMS_PER_SESSION_OPTIONS = [10, 20, 30, 50];
const RECALL_DIRECTION_OPTIONS = [
    { value: 'target-to-native', label: 'Target → Native' },
    { value: 'native-to-target', label: 'Native → Target' },
    { value: 'mixed', label: 'Mixed (Random)' },
];
const MODE_OPTIONS = [
    { value: 'paper', label: 'Paper (write yourself)' },
    { value: 'typing', label: 'Typing (type answers)' },
];

const PracticeButtonWithPopper = (props) => {
    const { datasetId, initialConfig, onConfigChange } = props;
    
    const [localConfig, setLocalConfig] = useState(
        initialConfig || { 
            itemsPerSession: DEFAULT_ITEMS_PER_SESSION,
            recallDirection: 'mixed',
            mode: 'paper',
            enableHints: true
        }
    );
    const [isOpen, setIsOpen] = useState(false);
    
    const currentConfig = initialConfig || localConfig;
    const currentItemsPerSession = currentConfig?.itemsPerSession || DEFAULT_ITEMS_PER_SESSION;
    const currentRecallDirection = currentConfig?.recallDirection || 'mixed';
    const currentMode = currentConfig?.mode || 'paper';
    const currentEnableHints = currentConfig?.enableHints !== undefined ? currentConfig.enableHints : true;
    const [selectedItems, setSelectedItems] = useState(currentItemsPerSession);
    const [selectedDirection, setSelectedDirection] = useState(currentRecallDirection);
    const [selectedMode, setSelectedMode] = useState(currentMode);
    const [enableHints, setEnableHints] = useState(currentEnableHints);
    
    // Update selectedItems, selectedDirection, selectedMode, and enableHints when initialConfig changes
    useEffect(() => {
        if (initialConfig?.itemsPerSession) {
            setSelectedItems(initialConfig.itemsPerSession);
        }
        if (initialConfig?.recallDirection) {
            setSelectedDirection(initialConfig.recallDirection);
        }
        if (initialConfig?.mode) {
            setSelectedMode(initialConfig.mode);
        }
        if (initialConfig?.enableHints !== undefined) {
            setEnableHints(initialConfig.enableHints);
        }
    }, [initialConfig?.itemsPerSession, initialConfig?.recallDirection, initialConfig?.mode, initialConfig?.enableHints]);

    const hasPracticeConfig = initialConfig !== undefined && initialConfig !== null;

    const handleSave = () => {
        const newConfig = { 
            itemsPerSession: selectedItems,
            recallDirection: selectedDirection,
            mode: selectedMode,
            enableHints: enableHints
        };
        setLocalConfig(newConfig);
        
        if (onConfigChange) {
            onConfigChange(newConfig);
        }
        
        setIsOpen(false);
        
        router.post(`/datasets/${datasetId}/practice-sessions`, {
            itemsPerSession: selectedItems,
            recallDirection: selectedDirection,
            mode: selectedMode,
            enableHints: enableHints
        });
    };

    const handleSaveOnly = () => {
        const newConfig = { 
            itemsPerSession: selectedItems,
            recallDirection: selectedDirection,
            mode: selectedMode,
            enableHints: enableHints
        };
        setLocalConfig(newConfig);
        
        if (onConfigChange) {
            onConfigChange(newConfig);
        }
        
        setIsOpen(false);
    };

    const buttonLabel = hasPracticeConfig ? 'Practice' : 'Practice this dataset';

    return (
        <Popper open={isOpen} onOpenChange={setIsOpen}>
            <Popper.Trigger asChild>
                <Button variant="primary">
                    {buttonLabel}
                </Button>
            </Popper.Trigger>
            <Popper.Content>
                <Box className="practice-config-popper">
                    <InlineStack align="space-between" blockAlign="start" className="practice-config-popper__header">
                        <BlockStack gap="200">
                            <Text variant="heading-s" fontWeight="bold">
                                Practice options
                            </Text>
                            <Text variant="body-m" color="text-secondary">
                                Choose how many items to include in a practice session.
                            </Text>
                        </BlockStack>
                        <Button
                            variant="plain"
                            onClick={() => setIsOpen(false)}
                            className="practice-config-popper__close"
                        >
                            ×
                        </Button>
                    </InlineStack>

                    <BlockStack gap="400" className="practice-config-popper__content">
                        <BlockStack gap="200">
                            <FormLabel>Items per session</FormLabel>
                            <Box
                                as="select"
                                value={selectedItems}
                                onChange={(e) => setSelectedItems(Number(e.target.value))}
                                className="practice-config-popper__select"
                            >
                                {ITEMS_PER_SESSION_OPTIONS.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </Box>
                        </BlockStack>

                        <BlockStack gap="200">
                            <FormLabel>Recall direction</FormLabel>
                            <Box
                                as="select"
                                value={selectedDirection}
                                onChange={(e) => setSelectedDirection(e.target.value)}
                                className="practice-config-popper__select"
                            >
                                {RECALL_DIRECTION_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Box>
                        </BlockStack>

                        <BlockStack gap="200">
                            <FormLabel>Answer mode</FormLabel>
                            <Box
                                as="select"
                                value={selectedMode}
                                onChange={(e) => setSelectedMode(e.target.value)}
                                className="practice-config-popper__select"
                            >
                                {MODE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Box>
                        </BlockStack>

                        <BlockStack gap="200">
                            <FormLabel>Hints</FormLabel>
                            <Box
                                as="select"
                                value={enableHints ? 'enabled' : 'disabled'}
                                onChange={(e) => setEnableHints(e.target.value === 'enabled')}
                                className="practice-config-popper__select"
                            >
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                            </Box>
                        </BlockStack>

                        <InlineStack align="end" gap="300">
                            <Button variant="secondary" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            {hasPracticeConfig && (
                                <Button variant="secondary" onClick={handleSaveOnly}>
                                    Save
                                </Button>
                            )}
                            <Button variant="primary" onClick={handleSave}>
                                Save & Practice
                            </Button>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Popper.Content>
        </Popper>
    );
};

export default PracticeButtonWithPopper;
