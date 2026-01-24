/**
 * External dependencies
 */
import { useContext } from "react";
import { useListItem } from "@floating-ui/react";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import { MenuContext } from "@/components/menu/menu.context";

const MenuItem = (props) => {
    const { children, onClick, isActive, hasSubChildren = false } = props;
    const { activeIndex, getItemProps, setIsOpen } = useContext(MenuContext);
    const { ref, index } = useListItem();

    return (
        <div
            ref={ref}
            role="menuitem"
            className={classNames(
                "bz-menu__item",
                (index === activeIndex || isActive) && "bz-menu__item--active",
            )}
            tabIndex={index === activeIndex ? 0 : -1}
            {...getItemProps({
                onClick(event) {
                    onClick?.(event);
                    if (!hasSubChildren) {
                        setIsOpen(false);
                    }
                },
                onKeyDown(event) {
                    if (event.key === "Enter") {
                        onClick?.(event);
                        if (!hasSubChildren) {
                            setIsOpen(false);
                        }
                    }
                },
            })}
        >
            {children}
        </div>
    );
};

export default MenuItem;
