/**
 * External dependencies
 */
import classNames from "classnames";

/**
 * Internal dependencies
 */
import DividerOrientationEnum from "@/components/divider/divider-orientation-enum";
import sanitizeCssProperties from "@/utils/sanitize-css-props";
import getCssProps from "@/utils/get-css-props";

const Divider = (props) => {
    const {
        orientation = DividerOrientationEnum.HORIZONTAL,
        color,
        ...restProps
    } = props;

    const style = sanitizeCssProperties({
        ...getCssProps("divider", [
            ["color", color, (value) => `var(--bz-color-${value})`],
        ]),
    });

    return (
        <hr
            className={classNames(
                "bz-divider",
                `bz-divider--orientation-${orientation}`,
            )}
            style={style}
            {...restProps}
        />
    );
};

export default Divider;
