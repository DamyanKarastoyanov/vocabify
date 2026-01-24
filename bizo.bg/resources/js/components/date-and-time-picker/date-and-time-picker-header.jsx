/**
 * External dependencies
 */
import moment from 'moment';

/**
 * Internal dependencies
 */
import IconButton from '@/components/icon-button/icon-button';
import IconCaretLeft from '@/components/icons/caret-left';
import IconCaretRight from '@/components/icons/caret-right';
import Text from '@/components/text/text';
import InlineStack from '@/components/inline-stack/inline-stack';

const DateAndTimePickerHeader = (props) => {
    const { date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled } = props;

    return (
        <InlineStack align="space-between" blockAlign="center">
            <IconButton size="300" icon={IconCaretLeft} onClick={decreaseMonth} disabled={prevMonthButtonDisabled} />

            <Text align="center" fontWeight="medium">
                {moment(date).format('MMMM YYYY')}
            </Text>

            <IconButton size="300" icon={IconCaretRight} onClick={increaseMonth} disabled={nextMonthButtonDisabled} />
        </InlineStack>
    );
};

export default DateAndTimePickerHeader;
