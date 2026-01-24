/**
 * External dependencies
 */
import { components } from 'react-select';

const MenuList = (props) => {
    const { menuListPrefix, menuListSuffix } = props.selectProps;

    return (
        <components.MenuList {...props}>
            {menuListPrefix && <>{menuListPrefix}</>}

            {props.children}

            {menuListSuffix && <>{menuListSuffix}</>}
        </components.MenuList>
    );
};

export default MenuList;
