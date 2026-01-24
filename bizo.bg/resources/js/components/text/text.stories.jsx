/**
 * Internal dependencies
 */
import Text from '@/components/text/text';

export default {
    title: 'Pastel/Text',
    component: Text,
    argTypes: {
        as: {
            control: { type: 'text' },
        },
        wrap: {
            control: { type: 'boolean' },
        },
        variant: {
            control: { type: 'select' },
            options: [
                'Body (small)',
                'Body (medium)',
                'Body (large)',
                'Heading (small)',
                'Heading (medium)',
                'Heading (large)',
                'Heading (xlarge)',
                'Heading (2xlarge)',
            ],
            mapping: {
                'Body (small)': 'body-s',
                'Body (medium)': 'body-m',
                'Body (large)': 'body-l',
                'Heading (small)': 'heading-s',
                'Heading (medium)': 'heading-m',
                'Heading (large)': 'heading-l',
                'Heading (xlarge)': 'heading-xl',
                'Heading (2xlarge)': 'heading-2xl',
            },
        },
        align: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'justify'],
        },
        fontWeight: {
            control: { type: 'select' },
            options: ['light', 'regular', 'medium', 'semibold', 'bold'],
        },
        textTransform: {
            control: { type: 'select' },
            options: ['capitalize', 'uppercase', 'lowercase'],
        },
        color: {
            control: { type: 'select' },
            options: [
                'dark-100',
                'dark-200',
                'dark-300',
                'dark-400',
                'dark-500',
                'gray-100',
                'gray-200',
                'gray-300',
                'gray-400',
                'gray-500',
                'purple-100',
                'purple-200',
                'purple-300',
                'purple-400',
                'purple-500',
                'green-100',
                'green-200',
                'green-300',
                'green-400',
                'green-500',
                'blue-450',
                'system-error',
                'system-warning',
                'system-confirmation',
                'system-success',
                'white',
                'black',
            ],
        },
    },
};

const Template = (args) => <Text {...args}>Some content here</Text>;

export const Default = Template.bind({});
Default.args = {
    variant: 'Body (medium)',
    color: 'dark-500',
};

export const Heading = Template.bind({});
Heading.args = {
    as: 'h1',
    variant: 'Heading (2xlarge)',
    color: 'dark-500',
};

export const Truncated = (args) => {
    return (
        <div style={{ width: '200px' }}>
            <Text {...args}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat veritatis nostrum debitis repellendus
                placeat quibusdam soluta fugiat quos accusamus tenetur voluptate corrupti, optio corporis? Cupiditate
                explicabo quas ullam odit nulla.
            </Text>
        </div>
    );
};
Truncated.args = {
    variant: 'Body (medium)',
    truncate: true,
    color: 'dark-500',
};
