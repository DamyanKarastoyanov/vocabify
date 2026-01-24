/**
 * External Dependencies
 */
import { useCallback, useEffect, useRef } from "react";

const useDebouncedFunction = (func, wait) => {
    const timeoutRef = useRef();

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return useCallback(
        (...args) => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                func(...args);
            }, wait);
        },
        [func, wait],
    );
};

export default useDebouncedFunction;
