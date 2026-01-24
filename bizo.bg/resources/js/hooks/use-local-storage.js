/**
 * External dependencies
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";

const dispatchStorageEvent = (key, newValue) => {
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
};

const setLocalStorageItem = (key, value) => {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key) => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key) => {
    return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
};

const parse = (json) => {
    try {
        return JSON.parse(json);
    } catch (e) {
        console.error(e);

        return null;
    }
};

export function useLocalStorage(key, initialValue) {
    const getSnapshot = () => getLocalStorageItem(key);

    const store = useSyncExternalStore(useLocalStorageSubscribe, getSnapshot);

    const setState = useCallback(
        (newState) => {
            try {
                const nextState =
                    typeof newState === "function"
                        ? newState(parse(store))
                        : newState;

                if (nextState === undefined || nextState === null) {
                    removeLocalStorageItem(key);
                } else {
                    setLocalStorageItem(key, nextState);
                }
            } catch (e) {
                console.warn(e);
            }
        },
        [key, store],
    );

    useEffect(() => {
        if (
            getLocalStorageItem(key) === null &&
            typeof initialValue !== "undefined"
        ) {
            setLocalStorageItem(key, initialValue);
        }
    }, [key, initialValue]);

    return [store ? parse(store) : initialValue, setState];
}
