/**
 * External Dependencies
 */
import { useMemo } from "react";
import {
    useFloating,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    autoUpdate,
} from "@floating-ui/react";

/**
 * Internal Dependencies
 */
import useControlledState from "@/hooks/use-controlled-state";

const usePopper = (options) => {
    const {
        initialOpen = false,
        open: controlledOpen,
        onOpenChange: setControlledOpen,
        offset: offsetValue = 8,
        trigger = "click",
        ...restOptions
    } = options;

    const [isOpen, setIsOpen] = useControlledState(
        controlledOpen,
        initialOpen,
        setControlledOpen,
    );

    const data = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            // Remove placement-based middleware since we're centering
        ],
        ...restOptions,
    });

    const context = data.context;

    const click = useClick(context, {
        enabled: controlledOpen == null && trigger === "click",
    });

    const dismiss = useDismiss(context);

    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return useMemo(
        () => ({
            open: isOpen,
            setIsOpen,
            ...interactions,
            ...data,
        }),
        [isOpen, setIsOpen, interactions, data],
    );
};

export default usePopper;
