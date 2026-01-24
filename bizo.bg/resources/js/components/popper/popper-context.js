/**
 * External dependencies
 */
import { createContext, useContext } from "react";

export const PopperContext = createContext(null);

export const usePopperContext = () => {
    const context = useContext(PopperContext);

    if (context == null) {
        throw new Error("Popper components must be wrapped in <Popper />");
    }

    return context;
};
