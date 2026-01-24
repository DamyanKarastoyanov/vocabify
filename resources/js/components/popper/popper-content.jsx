/**
 * External dependencies
 */
import { forwardRef } from "react";
import classNames from "classnames";
import {
    useMergeRefs,
    FloatingPortal,
    useTransitionStyles,
} from "@floating-ui/react";

/**
 * Internal dependencies
 */
import { usePopperContext } from "@/components/popper/popper-context";

const PopperContent = forwardRef(
    ({ style, maxWidth, className, children, ...restProps }, propRef) => {
        const context = usePopperContext();
        const ref = useMergeRefs([context.refs.setFloating, propRef]);

        const { isMounted, styles: transitionStyles } = useTransitionStyles(
            context,
            {
                duration: 200,
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
                        "bz-popper",
                        context.variant && `bz-popper--${context.variant}`,
                        className,
                    )}
                    data-state={context.open ? "open" : "closed"}
                    style={{
                        ...transitionStyles,
                        ...style,
                        ...(maxWidth && { "--bz-popper-width": maxWidth }),
                        ...(context.width &&
                            context.width !== "auto" && {
                                "--bz-popper-width": context.width,
                            }),
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                    }}
                    {...context.getFloatingProps(restProps)}
                >
                    {children}
                </div>
            </FloatingPortal>
        );
    },
);

PopperContent.displayName = "PopperContent";

export default PopperContent;
