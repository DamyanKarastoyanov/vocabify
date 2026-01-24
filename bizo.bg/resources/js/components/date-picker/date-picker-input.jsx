/**
 * External dependencies
 */
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import InlineStack from '@/components/inline-stack/inline-stack';
import Icon from '@/components/icon/icon';
import IconCaretDown from '@/components/icons/caret-down';

const DatePickerInput = forwardRef((props, ref) => {
    const { value, icon = IconCaretDown, onClick, ...restProps } = props;

    return (
        <InlineStack
            wrap={false}
            align="space-between"
            blockAlign="center"
            className="react-datepicker-ignore-onclickoutside"
            onClick={onClick}
        >
            <input value={value} readOnly ref={ref} {...restProps} />
            <Icon size="400" icon={icon} />
        </InlineStack>
    );
});

export default DatePickerInput;
