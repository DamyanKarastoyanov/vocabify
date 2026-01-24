/**
 * External dependencies
 */
import { forwardRef } from "react";
import { useTooltipContext } from "@/components/tooltip/tooltip-context";
import classNames from "classnames";
import {
    useMergeRefs,
    FloatingPortal,
    useTransitionStyles,
} from "@floating-ui/react";

const TooltipContent = forwardRef(
    ({ style, maxWidth, className, ...restProps }, propRef) => {
        const context = useTooltipContext();
        const ref = useMergeRefs([context.refs.setFloating, propRef]);

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

        if (!context.open || !isMounted) return null;

        return (
            <FloatingPortal>
                <div
                    ref={ref}
                    className={classNames(
                        "bz-tooltip",
                        context.variant && `bz-tooltip--${context.variant}`,
                        className,
                    )}
                    data-placement={context.placement}
                    style={{
                        ...transitionStyles,
                        ...context.floatingStyles,
                        ...style,
                        ...(maxWidth && { "--bz-tooltip-width": maxWidth }),
                    }}
                    {...context.getFloatingProps(restProps)}
                />
            </FloatingPortal>
        );
    },
);

TooltipContent.displayName = "TooltipContent";

export default TooltipContent;
