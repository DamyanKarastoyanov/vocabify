/**
 * External dependencies
 */
import ReactSelect from 'react-select';
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import DropdownIndicator from '@/components/select/select-dropdown-indicator';
import MultiValueRemove from '@/components/select/select-multi-value-remove';
import MenuList from '@/components/select/select-menu-list';
import SelectMenuVirtualList from '@/components/select/select-menu-virtual-list';
import Option from '@/components/select/select-option';
import CustomPlaceholder from '@/components/select/select-custom-placeholder';
import ClearIndicator from '@/components/select/select-clear-indicator';
import ClickableLabel from '@/components/select/select-clickable-select-label';

const Select = forwardRef((props, ref) => {
    const {
        disabled = false,
        invalid = false,
        maxMenuHeight = 400,
        minMenuHeight = 140,
        isSearchable = false,
        customPlaceholder,
        useVirtualList = false,
        onClickSelectedLabel,
        wrap = false,
        menuPortalTarget = document.body,
        ...restProps
    } = props;

    const components = {
        MenuList,
        DropdownIndicator,
        MultiValueRemove,
        IndicatorSeparator: () => null,
        ClearIndicator,
        Option,
    };

    if (useVirtualList) {
        components.MenuList = SelectMenuVirtualList;
    }

    if (customPlaceholder) {
        components.Placeholder = (placeholderProps) => (
            <CustomPlaceholder {...placeholderProps}>{customPlaceholder}</CustomPlaceholder>
        );
    }

    if (onClickSelectedLabel) {
        components.MultiValueLabel = (placeholderProps) => (
            <ClickableLabel {...placeholderProps} onClickSelectedLabel={onClickSelectedLabel} />
        );
    }

    return (
        <ReactSelect
            ref={ref}
            className={classNames('bz-select', wrap && 'bz-select--wrapped', invalid && 'bz-select--invalid')}
            classNamePrefix="bz-select"
            unstyled
            maxMenuHeight={maxMenuHeight}
            minMenuHeight={minMenuHeight}
            hideSelectedOptions={false}
            isSearchable={isSearchable}
            isDisabled={disabled}
            components={components}
            menuPortalTarget={menuPortalTarget}
            {...restProps}
        />
    );
});

export default Select;
