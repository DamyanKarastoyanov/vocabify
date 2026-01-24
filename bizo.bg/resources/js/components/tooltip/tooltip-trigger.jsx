/**
 * External dependencies
 */
import { useMergeRefs } from "@floating-ui/react";
import classNames from "classnames";
import { forwardRef } from "react";

/**
 * Internal dependencies
 */
import { useTooltipContext } from "@/components/tooltip/tooltip-context";

const TooltipTrigger = forwardRef((props, propRef) => {
    const { children, width, align, asChild = false, ...restProps } = props;

    const context = useTooltipContext();
    const childrenRef = children.ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    if (asChild && children) {
        return children.type ? (
            <children.type
                ref={ref}
                {...context.getReferenceProps({
                    ...children.props,
                    ...restProps,
                })}
            />
        ) : (
            children
        );
    }

    return (
        <div
            className={classNames(
                "bz-tooltip__trigger",
                `bz-tooltip__trigger--placement-${context.placement}`,
            )}
            style={{
                ...(width && { "--bz-tooltip__trigger-width": `${width}` }),
                ...(align && { "--bz-tooltip__trigger-align": `${align}` }),
            }}
            ref={ref}
            tabIndex={0}
            {...context.getReferenceProps(restProps)}
        >
            {children}
        </div>
    );
});

TooltipTrigger.displayName = "TooltipTrigger";

export default TooltipTrigger;
