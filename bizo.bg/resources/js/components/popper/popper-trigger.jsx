/**
 * External dependencies
 */
import { forwardRef, cloneElement, isValidElement } from "react";
import { useMergeRefs } from "@floating-ui/react";

/**
 * Internal dependencies
 */
import { usePopperContext } from "@/components/popper/popper-context";

const PopperTrigger = forwardRef(
    ({ children, asChild = false, ...props }, propRef) => {
        const context = usePopperContext();
        const childrenRef = children.ref;
        const ref = useMergeRefs([
            context.refs.setReference,
            propRef,
            childrenRef,
        ]);

        // If asChild is true, clone the child element and add popper props
        if (asChild && isValidElement(children)) {
            return cloneElement(
                children,
                context.getReferenceProps({
                    ref,
                    ...props,
                    ...children.props,
                    "data-state": context.open ? "open" : "closed",
                }),
            );
        }

        // Otherwise, render a button wrapper
        return (
            <button
                className="bz-popper-trigger"
                ref={ref}
                type="button"
                data-state={context.open ? "open" : "closed"}
                {...context.getReferenceProps(props)}
            >
                {children}
            </button>
        );
    },
);

PopperTrigger.displayName = "PopperTrigger";

export default PopperTrigger;
