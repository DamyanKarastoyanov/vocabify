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
        ...restProps
    } = props;

    const Component = as || "p";

    const style = sanitizeCssProperties({
        ...getCssProps("text", [
            ["color", color, (value) => `var(--bz-color-${value})`],
        ]),
        ...(align && { textAlign: align }),
    });

    return (
        <Component
            className={classNames(
                "bz-text",
                variant && `bz-text--variant-${variant}`,
                align && `bz-text--align-${align}`,
                fontWeight && `bz-text--font-weight-${fontWeight}`,
                textTransform && `bz-text--transform-${textTransform}`,
                truncate && "bz-text--truncate",
                !wrap && "bz-text--nowrap",
            )}
            style={style}
            {...restProps}
        />
    );
};

export default Text;
