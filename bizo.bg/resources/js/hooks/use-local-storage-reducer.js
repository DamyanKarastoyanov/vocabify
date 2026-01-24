import { useReducer, useEffect, useRef } from "react";
import { useLocalStorage } from "./use-local-storage";

export function useLocalStorageReducer(reducer, initialState, storageKey) {
    const [storedValue, setStoredValue] = useLocalStorage(
        storageKey,
        initialState,
    );
    const [state, dispatch] = useReducer(reducer, storedValue);
    const previousStateRef = useRef(state);

    useEffect(() => {
        // Only update localStorage if the state has actually changed
        if (
            JSON.stringify(previousStateRef.current) !== JSON.stringify(state)
        ) {
            previousStateRef.current = state;
            setStoredValue(state);
        }
    }, [state, setStoredValue]);

    return [state, dispatch];
}
