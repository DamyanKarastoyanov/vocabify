/**
 * External dependencies
 */
import { useState, useCallback, useRef } from "react";

/**
 * A hook that allows controlled/uncontrolled behaviour of state.
 *
 * @param {*} controlledValue
 * @param {*} defaultValue
 * @return {[*, Function]}
 */
export default function useControlledState(controlledValue, defaultValue) {
    let wasControlled = controlledValue !== undefined;
    let isControlledRef = useRef(wasControlled);

    const [value, setValue] = useState(
        isControlledRef.current ? controlledValue : defaultValue,
    );

    const set = useCallback((value) => {
        if (!isControlledRef.current) {
            setValue(value);
        }
    }, []);

    return [isControlledRef.current ? controlledValue : value, set];
}
