/**
 * External dependencies
 */
import { components } from "react-select";

/**
 * Internal dependencies
 */
import Icon from "@/components/icon/icon";
import IconX from "@/components/icons/x";
import Box from "@/components/box/box";

const ClearIndicator = (props) => {
    return (
        <components.ClearIndicator
            {...props}
            className="bz-select__clear-indicator"
        >
            <Box paddingInlineEnd="150">
                <Icon size="400" icon={IconX} color="brand-500" />
            </Box>
        </components.ClearIndicator>
    );
};

export default ClearIndicator;
