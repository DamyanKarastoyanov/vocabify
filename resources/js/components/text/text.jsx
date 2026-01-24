/**
 * External dependencies
 */
import classNames from "classnames";

/**
 * Internal dependencies
 */
import getCssProps from "@/utils/get-css-props";
import sanitizeCssProperties from "@/utils/sanitize-css-props";

const Text = (props) => {
    const {
        as,
        variant,
        align,
        fontWeight,
        color,
        textTransform,
        truncate = false,
        wrap = true,
        children,
        ...restProps
    } = props;

    const Component = as || "p";

    const style = sanitizeCssProperties({
        ...getCssProps("text", [
            ["color", color, (value) => `var(--vf-color-${value})`],
        ]),
        ...(align && { textAlign: align }),
    });

    return (
        <Component
            className={classNames(
                "vf-text",
                variant && `vf-text--variant-${variant}`,
                align && `vf-text--align-${align}`,
                fontWeight && `vf-text--font-weight-${fontWeight}`,
                textTransform && `vf-text--transform-${textTransform}`,
                truncate && "vf-text--truncate",
                !wrap && "vf-text--nowrap",
            )}
            style={style}
            {...restProps}
        >
            {children}
        </Component>
    );
};

export default Text;
