/**
 * External dependencies
 */
import { forwardRef } from "react";

/**
 * Internal dependencies
 */
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";
import IconCaretDown from "@/components/icons/caret-down";

const MenuButton = forwardRef((props, ref) => {
    const { icon, children, ...restProps } = props;

    return (
        <button
            type="button"
            className="bz-menu__button"
            {...restProps}
            ref={ref}
        >
            <InlineStack gap="100" blockAlign="center">
                {icon && <span className="bz-menu__button-icon">{icon}</span>}

                <span className="bz-menu__button-text">{children}</span>

                <span className="bz-menu__button-caret">
                    <Icon size="300" icon={IconCaretDown} />
                </span>
            </InlineStack>
        </button>
    );
});

export default MenuButton;
