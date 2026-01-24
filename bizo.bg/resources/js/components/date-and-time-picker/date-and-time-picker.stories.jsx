/**
 * External dependencies
 */
import { useState } from 'react';

/**
 * Internal dependencies
 */
import DateAndTimePicker from '@/components/date-and-time-picker/date-and-time-picker';
import Box from '@/components/box/box';
import InlineStack from '@/components/inline-stack/inline-stack';
import Text from '@/components/text/text';
import { formatDate } from '@/utils/formatting';

export default {
    title: 'Pastel/DateAndTimePicker',
    component: DateAndTimePicker,
    argTypes: {
        fieldInput: {
            control: { type: 'boolean' },
        },
        startDate: {
            control: { type: 'text' },
        },
        disabled: {
            control: { type: 'boolean' },
        },
    },
};

const Template = (args) => {
    const [date, setDate] = useState();

    const formattedDate = date ? formatDate(date, 'MMM dd, yyyy HH:mm:ss') : 'No date selected';

    return (
        <Box height="500px">
            <InlineStack align="center">
                <Box width="max-content">
                    <DateAndTimePicker
                        {...args}
                        onChange={(date) => {
                            setDate(date);
                        }}
                    />
                </Box>
            </InlineStack>

            <Text>Selected Date and Time: {formattedDate}</Text>
        </Box>
    );
};

export const Default = Template.bind({});
Default.args = {
    fieldInput: false,
};

export const FieldTypeInput = Template.bind({});
FieldTypeInput.args = {
    fieldInput: true,
};

export const ExternalDate = Template.bind({});
ExternalDate.args = {
    startDate: new Date('2021-09-01T10:30'),
    fieldInput: true,
};
