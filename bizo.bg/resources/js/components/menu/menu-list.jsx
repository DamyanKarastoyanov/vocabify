/**
 * External dependencies
 */
import { useContext } from "react";
import { FloatingList } from "@floating-ui/react";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import { MenuContext } from "@/components/menu/menu.context";

const MenuList = (props) => {
    const { children, scrollable } = props;
    const { listRef } = useContext(MenuContext);

    return (
        <div
            className={classNames(
                "bz-menu__list",
                scrollable && "bz-menu__list--scrollable",
            )}
        >
            <FloatingList elementsRef={listRef}>{children}</FloatingList>
        </div>
    );
};

export default MenuList;
