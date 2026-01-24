/**
 * External dependencies
 */
import { FloatingPortal, FloatingFocusManager } from "@floating-ui/react";
import { useContext } from "react";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import { MenuContext } from "@/components/menu/menu.context";

const MenuPopover = (props) => {
    const { children, className } = props;
    const { getFloatingProps, context, refs, floatingStyles, isOpen } =
        useContext(MenuContext);

    if (!isOpen) {
        return null;
    }

    return (
        <FloatingPortal>
            <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={-1}
                visuallyHiddenDismiss
            >
                <div
                    ref={refs.setFloating}
                    {...getFloatingProps({
                        className: classNames("bz-menu__popover", className),
                        style: { ...floatingStyles },
                    })}
                >
                    {children}
                </div>
            </FloatingFocusManager>
        </FloatingPortal>
    );
};

export default MenuPopover;
