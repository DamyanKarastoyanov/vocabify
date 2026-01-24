/**
 * External dependencies
 */
import classNames from "classnames";
import { forwardRef } from "react";

const MainNavItem = forwardRef((props, ref) => {
    const { current = false, children, ...restProps } = props;

    return (
        <li
            ref={ref}
            className={classNames("bz-main-nav__item", {
                "bz-main-nav__item--current": current,
            })}
            {...restProps}
        >
            {children}
        </li>
    );
});

export default MainNavItem;
