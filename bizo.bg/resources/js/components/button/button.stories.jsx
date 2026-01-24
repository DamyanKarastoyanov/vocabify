/**
 * Internal dependencies
 */
import Button from '@/components/button/button';
import Icon from '@/components/icon/icon';
import IconHelp from '@/components/icons/help';
import IconCheck from '@/components/icons/check';
import IconEye from '@/components/icons/eye';

const createAffixControl = () => ({
    control: { type: 'select' },
    options: ['help', 'check', 'eye'],
    mapping: {
        help: <Icon icon={IconHelp} />,
        trash: <Icon icon={IconCheck} />,
        eye: <Icon icon={IconEye} />,
    },
});

export default {
    title: 'Pastel/Button',
    component: Button,
    argTypes: {
        variant: {
            options: ['primary', 'secondary', 'tertiary', 'outline', 'plain', 'feature'],
            control: { type: 'select' },
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
        prefix: createAffixControl(),
        suffix: createAffixControl(),
    },
};

const Template = (args) => <Button {...args}>Button</Button>;

export const Default = Template.bind({});
Default.args = {
    variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: 'secondary',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
    variant: 'tertiary',
};

export const Outline = Template.bind({});
Outline.args = {
    variant: 'outline',
};

export const Plain = Template.bind({});
Plain.args = {
    variant: 'plain',
};

export const Feature = Template.bind({});
Feature.args = {
    variant: 'feature',
};

export const Disabled = Template.bind({});
Disabled.args = {
    variant: 'primary',
    disabled: true,
};

export const Pressed = Template.bind({});
Pressed.args = {
    variant: 'primary',
    pressed: true,
};

export const Loading = Template.bind({});
Loading.args = {
    variant: 'primary',
    loading: true,
};

export const WithIcon = Template.bind({});
Icon.args = {
    variant: 'primary',
};

export const AsLink = Template.bind({});
AsLink.args = {
    variant: 'primary',
    href: 'https://example.com',
};
