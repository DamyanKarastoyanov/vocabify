/**
 * Internal dependencies
 */
import TextInput from '@/components/text-input/text-input';
import IconButton from '@/components/icon-button/icon-button';
import Icon from '@/components/icon/icon';
import IconEye from '@/components/icons/eye';
import IconCalendar from '@/components/icons/calendar';

export default {
    title: 'Pastel/TextInput',
    component: TextInput,
    argTypes: {
        placeholder: {
            control: { type: 'text' },
        },
        disabled: {
            control: { type: 'boolean' },
        },
        invalid: {
            control: { type: 'boolean' },
        },
    },
};

const Template = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
    placeholder: 'Enter something...',
};

export const NoPlaceholder = Template.bind({});
NoPlaceholder.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
    placeholder: 'Enter something...',
    disabled: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
    invalid: true,
    value: 'Test Value',
};

export const WithPrefix = Template.bind({});
WithPrefix.args = {
    placeholder: 'Choose date...',
    prefix: <Icon icon={IconCalendar} />,
};

export const WithSuffix = Template.bind({});
WithSuffix.args = {
    placeholder: 'Type your password...',
    suffix: <IconButton icon={IconEye} />,
};
