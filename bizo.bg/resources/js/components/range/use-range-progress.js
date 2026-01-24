/**
 * External dependencies
 */
import { useEffect, useState } from "react";

const useRangeProgress = (value, inputRef) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (inputRef?.current && value !== undefined) {
            const min = parseFloat(inputRef.current.min) || 0;
            const max = parseFloat(inputRef.current.max) || 100;

            const progressValue = ((value - min) / (max - min)) * 100;
            setProgress(Math.max(0, Math.min(100, progressValue)));
        }
    }, [value, inputRef]);

    return progress;
};

export default useRangeProgress;
