/**
 * Internal dependencies
 */
import Box from '@/components/box/box';
import { token } from '@/tokens/tokens';

const createSpaceControl = () => ({
    control: { type: 'select' },
    options: [
        '0',
        '025',
        '050',
        '100',
        '150',
        '200',
        '250',
        '300',
        '350',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        '1000',
        '1200',
        '1400',
        '1600',
        '1800',
        '2000',
        '2400',
        '2800',
        '3200',
    ],
});

const createColorControl = () => ({
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
        'system-error',
        'system-warning',
        'system-confirmation',
        'system-success',
        'white',
        'black',
    ],
});

const createRadiusControl = () => ({
    control: { type: 'select' },
    options: ['0', '050', '100', '150', '200', '250', '300', '400', '500', '600', 'full'],
});

export default {
    title: 'Pastel/Box',
    component: Box,
    argTypes: {
        position: {
            control: { type: 'select' },
            options: ['relative', 'absolute', 'fixed', 'sticky'],
        },
        width: {
            control: { type: 'text' },
        },
        minWidth: {
            control: { type: 'text' },
        },
        maxWidth: {
            control: { type: 'text' },
        },
        height: {
            control: { type: 'text' },
        },
        minHeight: {
            control: { type: 'text' },
        },
        maxHeight: {
            control: { type: 'text' },
        },
        opacity: {
            control: { type: 'text' },
        },
        padding: createSpaceControl(),
        paddingBlock: createSpaceControl(),
        paddingInline: createSpaceControl(),
        paddingBlockStart: createSpaceControl(),
        paddingBlockEnd: createSpaceControl(),
        paddingInlineStart: createSpaceControl(),
        paddingInlineEnd: createSpaceControl(),
        insetBlockStart: createSpaceControl(),
        insetBlockEnd: createSpaceControl(),
        insetInlineStart: createSpaceControl(),
        insetInlineEnd: createSpaceControl(),
        borderRadius: createRadiusControl(),
        borderStartStartRadius: createRadiusControl(),
        borderStartEndRadius: createRadiusControl(),
        borderEndStartRadius: createRadiusControl(),
        borderEndEndRadius: createRadiusControl(),
        backgroundColor: createColorControl(),
        color: createColorControl(),
    },
};

export const Default = {
    args: {
        width: '300px',
        height: token('size.2000'),
        paddingBlock: '500',
        paddingInline: '200',
        backgroundColor: 'gray-500',
        color: 'purple-500',
    },
    render: (args) => {
        return <Box {...args}>I'm a box!</Box>;
    },
};
