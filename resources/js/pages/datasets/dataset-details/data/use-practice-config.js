import { useState, useEffect } from 'react';

const STORAGE_KEY_PREFIX = 'vocabify_practice_config_';

const usePracticeConfig = (datasetId) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${datasetId}`;

    const [config, setConfig] = useState(() => {
        if (typeof window === 'undefined') return null;
        
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading practice config from localStorage:', error);
            return null;
        }
    });

    useEffect(() => {
        if (config && typeof window !== 'undefined') {
            try {
                localStorage.setItem(storageKey, JSON.stringify(config));
            } catch (error) {
                console.error('Error saving practice config to localStorage:', error);
            }
        }
    }, [config, storageKey]);

    const updateConfig = (newConfig) => {
        setConfig(newConfig);
    };

    return {
        config,
        updateConfig,
        hasConfig: config !== null && config !== undefined,
    };
};

export default usePracticeConfig;
