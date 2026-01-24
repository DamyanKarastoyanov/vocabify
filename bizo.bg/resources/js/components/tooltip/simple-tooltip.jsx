/**
 * Internal dependencies
 */
import Tooltip from "@/components/tooltip/tooltip";

/**
 * SimpleTooltip - A simplified wrapper around the Tooltip component
 * for easier usage when you just need basic tooltip functionality
 */
const SimpleTooltip = ({
    children,
    content,
    placement = "top",
    variant = "default",
    delay,
    offset,
    maxWidth,
    disabled = false,
    ...props
}) => {
    if (disabled) {
        return children;
    }

    return (
        <Tooltip
            placement={placement}
            variant={variant}
            delay={delay}
            offset={offset}
            {...props}
        >
            <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
            <Tooltip.Content maxWidth={maxWidth}>{content}</Tooltip.Content>
        </Tooltip>
    );
};

export default SimpleTooltip;
