/**
 * External dependencies
 */
import classNames from "classnames";

/**
 * Internal dependencies
 */
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";

const MainNavPopper = (props) => {
    const { children, ...restProps } = props;

    return (
        <div className={classNames("bz-main-nav__popper")} {...restProps}>
            <Box paddingBlockStart="100">
                <Surface>
                    <Box paddingBlock="300">{children}</Box>
                </Surface>
            </Box>
        </div>
    );
};

export default MainNavPopper;
