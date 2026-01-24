/**
 * External dependencies
 */
import { useState, cloneElement, isValidElement } from "react";
import {
    useFloating,
    useHover,
    useFocus,
    useClick,
    useDismiss,
    useInteractions,
    offset,
    shift,
    flip,
    autoUpdate,
    FloatingPortal,
    useTransitionStyles,
    useMergeRefs,
} from "@floating-ui/react";
import classNames from "classnames";

/**
 * CustomBubbleTooltip - A custom tooltip component for the bubble icon
 * Matches the Figma design with warning-100 background
 */
const CustomBubbleTooltip = ({
    children,
    content,
    placement = "top",
    maxWidth = 250,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset({ mainAxis: -25, crossAxis: -40 }),
            flip({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "start",
                padding: 8,
            }),
            shift({ padding: 8 }),
        ],
    });

    const hover = useHover(context, {
        move: false,
        delay: { open: 500, close: 0 },
        restMs: 40,
    });

    const focus = useFocus(context);
    const click = useClick(context, { toggle: true });
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        click,
        dismiss,
    ]);

    const { isMounted, styles: transitionStyles } = useTransitionStyles(
        context,
        {
            duration: 250,
            initial: {
                opacity: 0,
                transform: "scale(0.95)",
            },
            open: {
                opacity: 1,
                transform: "scale(1)",
            },
            close: {
                opacity: 0,
                transform: "scale(0.95)",
            },
        },
    );

    // Clone children and add ref and props
    const childrenRef = isValidElement(children) ? children.ref : null;
    const ref = useMergeRefs([refs.setReference, childrenRef]);

    const triggerElement = isValidElement(children)
        ? cloneElement(
              children,
              getReferenceProps({
                  ref,
                  ...children.props,
                  "data-tooltip-open": isOpen ? "" : undefined,
                  className: classNames(
                      children.props.className,
                      isOpen && "bz-tooltip-trigger--open",
                  ),
              }),
          )
        : children;

    return (
        <>
            {triggerElement}
            {isOpen && content && isMounted && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        className={classNames(
                            "bz-custom-bubble-tooltip",
                            `bz-custom-bubble-tooltip--${placement}`,
                        )}
                        style={{
                            ...transitionStyles,
                            ...floatingStyles,
                            ...(maxWidth && { maxWidth: `${maxWidth}px` }),
                        }}
                        {...getFloatingProps()}
                    >
                        {content}
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default CustomBubbleTooltip;
