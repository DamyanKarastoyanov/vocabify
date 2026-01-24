/**
 * Internal Dependencies
 */
import usePopper from "@/components/popper/use-popper";
import { PopperContext } from "@/components/popper/popper-context";
import PopperTrigger from "@/components/popper/popper-trigger";
import PopperContent from "@/components/popper/popper-content";

const Popper = (props) => {
    const {
        options,
        children,
        variant = "default",
        offset = 8,
        open,
        onOpenChange,
        trigger = "click",
        width = "auto",
        ...restProps
    } = props;

    const popper = usePopper({
        ...options,
        offset,
        open,
        onOpenChange,
        trigger,
        ...restProps,
    });

    return (
        <PopperContext.Provider value={{ ...popper, variant, width }}>
            <>{children}</>
        </PopperContext.Provider>
    );
};

Popper.Trigger = PopperTrigger;
Popper.Content = PopperContent;

export default Popper;
