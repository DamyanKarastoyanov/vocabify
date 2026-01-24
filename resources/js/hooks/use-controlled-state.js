/**
 * External dependencies
 */
import { useState, useCallback, useRef } from "react";

/**
 * A hook that allows controlled/uncontrolled behaviour of state.
 *
 * @param {*} controlledValue
 * @param {*} defaultValue
 * @param {Function} setControlledValue
 * @return {[*, Function]}
 */
export default function useControlledState(controlledValue, defaultValue, setControlledValue) {
    let wasControlled = controlledValue !== undefined;
    let isControlledRef = useRef(wasControlled);

    const [value, setValue] = useState(
        isControlledRef.current ? controlledValue : defaultValue,
    );

    const set = useCallback((value) => {
        if (!isControlledRef.current) {
            setValue(value);
        } else if (setControlledValue) {
            setControlledValue(value);
        }
    }, [setControlledValue]);

    return [isControlledRef.current ? controlledValue : value, set];
}
