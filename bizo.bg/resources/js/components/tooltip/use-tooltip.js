/**
 * External Dependencies
 */
import { useMemo } from "react";
import {
    useFloating,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    offset,
    shift,
    flip,
    autoUpdate,
} from "@floating-ui/react";

/**
 * Internal Dependencies
 */
import useControlledState from "@/hooks/use-controlled-state";

const useTooltip = (options) => {
    const {
        initialOpen = false,
        placement = "bottom",
        isOpen: controlledOpen,
        delay = { open: 500, close: 0 },
        offsetValue = 8,
    } = options;

    const [isOpen, setIsOpen] = useControlledState(controlledOpen, initialOpen);

    const data = useFloating({
        placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(offsetValue),
            flip({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "start",
                padding: 8,
            }),
            shift({ padding: 8 }),
        ],
    });

    const context = data.context;

    const hover = useHover(context, {
        move: false,
        enabled: controlledOpen == null,
        delay: delay,
        restMs: 40,
    });

    const focus = useFocus(context, {
        enabled: controlledOpen == null,
    });

    const dismiss = useDismiss(context);

    const role = useRole(context, { role: "tooltip" });

    const interactions = useInteractions([hover, focus, dismiss, role]);

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

export default useTooltip;
