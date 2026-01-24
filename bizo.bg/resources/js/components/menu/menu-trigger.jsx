/**
 * External dependencies
 */
import { cloneElement, useContext, Children } from "react";

/**
 * Internal dependencies
 */
import { MenuContext } from "@/components/menu/menu.context";

const MenuTrigger = (props) => {
    const { children } = props;
    const { refs, getReferenceProps } = useContext(MenuContext);

    return cloneElement(Children.only(children), {
        ref: refs.setReference,
        ...getReferenceProps(),
    });
};

export default MenuTrigger;
