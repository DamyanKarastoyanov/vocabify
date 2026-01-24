/**
 * Internal dependencies
 */
import IconButton from '@/components/icon-button/icon-button';
import IconHelp from '@/components/icons/help';

export default {
    title: 'Pastel/IconButton',
    component: IconButton,
    argTypes: {
        variant: {
            options: ['primary', 'outline', 'circle'],
            control: { type: 'select' },
        },
        size: {
            control: { type: 'number' },
        },
        iconSize: {
            control: { type: 'number' },
        },
        disabled: {
            control: { type: 'boolean' },
        },
        pressed: {
            control: { type: 'boolean' },
        },
        loading: {
            control: { type: 'boolean' },
        },
        href: {
            control: { type: 'text' },
        },
    },
};

const Template = (args) => <IconButton {...args}>Button</IconButton>;

export const Default = Template.bind({});
Default.args = {
    icon: IconHelp,
};

export const Outline = Template.bind({});
Outline.args = {
    icon: IconHelp,
    variant: 'outline',
};

export const Circle = Template.bind({});
Circle.args = {
    icon: IconHelp,
    variant: 'circle',
};

export const Loading = Template.bind({});
Loading.args = {
    icon: IconHelp,
    loading: true,
};
