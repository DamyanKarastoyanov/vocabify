/**
 * External dependencies
 */
import { components } from "react-select";

/**
 * Internal dependencies
 */
import Icon from "@/components/icon/icon";
import IconCaretDown from "@/components/icons/caret-down";

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <Icon size="500" icon={IconCaretDown} color="brand-500" />
        </components.DropdownIndicator>
    );
};

export default DropdownIndicator;
