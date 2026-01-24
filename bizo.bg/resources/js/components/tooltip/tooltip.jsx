/**
 * Internal Dependencies
 */
import useTooltip from "@/components/tooltip/use-tooltip";
import { TooltipContext } from "@/components/tooltip/tooltip-context";
import TooltipTrigger from "@/components/tooltip/tooltip-trigger";
import TooltipContent from "@/components/tooltip/tooltip-content";

const Tooltip = (props) => {
    const {
        placement = "bottom",
        options,
        children,
        variant = "default",
        delay,
        offset,
    } = props;

    const tooltip = useTooltip({
        ...options,
        placement,
        delay,
        offsetValue: offset,
    });

    return (
        <TooltipContext.Provider value={{ ...tooltip, variant }}>
            <>{children}</>
        </TooltipContext.Provider>
    );
};

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
export default Tooltip;
