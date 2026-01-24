/**
 * External dependencies
 */
import { useState, useRef } from "react";
import {
    useFloating,
    useClick,
    useFocus,
    useHover,
    useDismiss,
    useRole,
    useListNavigation,
    useInteractions,
    offset,
    flip,
    shift,
    size,
    autoUpdate,
    safePolygon,
} from "@floating-ui/react";

/**
 * Internal dependencies
 */
import MenuPopover from "@/components/menu/menu-popover";
import MenuList from "@/components/menu/menu-list";
import MenuItem from "@/components/menu/menu-item";
import MenuTrigger from "@/components/menu/menu-trigger";
import MenuButton from "@/components/menu/menu-button";
import { MenuContext } from "@/components/menu/menu.context";

const Menu = (props) => {
    const {
        children,
        placement = "bottom-start",
        referenceElement = null,
        positionOffset = 4,
        shouldUseVirtualFocus = false,
        triggerEventType = "click",
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const [activeIndex, setActiveIndex] = useState(null);
    const { refs, floatingStyles, context } = useFloating({
        placement,
        elements: {
            reference: referenceElement,
        },
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(positionOffset),
            flip({ padding: 12 }),
            shift({ padding: 12 }),
            size({
                apply({ rects, elements, availableHeight, availableWidth }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${availableHeight}px`,
                        maxWidth: `${availableWidth}px`,
                        minWidth: `${Math.min(rects.reference.width, availableWidth)}px`,
                        overflow: "auto",
                    });
                },
                padding: 10,
            }),
        ],
    });

    const getInterationEvent = (eventType) => {
        switch (eventType) {
            case "focus":
                return useFocus(context);
            case "hover":
                return useHover(context, {
                    handleClose: safePolygon(),
                });
            case "click":
            default:
                return useClick(context, { event: "mousedown" });
        }
    };

    const listRef = useRef([]);
    const interactionEvent = getInterationEvent(triggerEventType);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: shouldUseVirtualFocus,
        loop: true,
    });
    const { getReferenceProps, getFloatingProps, getItemProps } =
        useInteractions([dismiss, role, listNav, interactionEvent]);

    return (
        <MenuContext.Provider
            value={{
                getReferenceProps,
                getFloatingProps,
                getItemProps,
                setIsOpen,
                context,
                refs,
                floatingStyles,
                isOpen,
                listRef,
                activeIndex,
            }}
        >
            <div className="bz-menu">{children}</div>
        </MenuContext.Provider>
    );
};

Menu.Trigger = MenuTrigger;
Menu.Popover = MenuPopover;
Menu.List = MenuList;
Menu.Item = MenuItem;
Menu.Button = MenuButton;

export default Menu;
