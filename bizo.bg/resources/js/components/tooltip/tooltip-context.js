/**
 * External dependencies
 */
import { createContext, useContext } from "react";

const TooltipContext = createContext(null);

const useTooltipContext = () => {
    const context = useContext(TooltipContext);

    if (context == null) {
        throw new Error("Tooltip components must be wrapped in <Tooltip />");
    }

    return context;
};

export { TooltipContext, useTooltipContext };
