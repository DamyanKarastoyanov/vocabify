/**
 * External dependencies
 */
import { forwardRef } from "react";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import Spinner from "@/components/spinner/spinner";
import Icon from "@/components/icon/icon";
import sanitizeCssProperties from "@/utils/sanitize-css-props";
import getCssProps from "@/utils/get-css-props";

const IconButton = forwardRef((props, ref) => {
    const {
        variant = "primary",
        type = "button",
        href,
        icon,
        size: sizeProp,
        iconSize: iconSizeProp,
        disabled = false,
        pressed = false,
        loading = false,
        style: dangerouslySetInlineStyle,
        color,
        ...restProps
    } = props;

    const Component = !!href ? "a" : "button";
    const iconSize = iconSizeProp ?? (variant === "outline" ? "400" : sizeProp);

    const style = sanitizeCssProperties({
        ...getCssProps("icon-button", [
            ["size", sizeProp, (value) => `var(--bz-size-${value})`],
        ]),
        ...(dangerouslySetInlineStyle?.__style ?? {}),
    });

    return (
        <Component
            ref={ref}
            className={classNames(
                "bz-icon-button",
                `bz-icon-button--variant-${variant}`,
                disabled && "bz-icon-button--disabled",
                pressed && "bz-icon-button--pressed",
                loading && "bz-icon-button--loading",
            )}
            style={style}
            disabled={disabled}
            {...(!!href ? { href } : { type })}
            {...restProps}
        >
            <Icon
                className="bz-icon-button__icon"
                icon={icon}
                size={iconSize}
                color={color}
            />

            {loading && (
                <span className="bz-icon-button__spinner">
                    <Spinner size={iconSize} />
                </span>
            )}
        </Component>
    );
});

export default IconButton;
