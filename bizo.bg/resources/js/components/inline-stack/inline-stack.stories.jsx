/**
 * Internal dependencies
 */
import InlineStack from '@/components/inline-stack/inline-stack';

export default {
    title: 'Pastel/InlineStack',
    component: InlineStack,
    argTypes: {
        gap: {
            control: { type: 'select' },
            options: [
                // TODO: Expose design tokens to JS and import here.
                '0',
                '025',
                '050',
                '100',
                '150',
                '200',
                '300',
                '400',
                '500',
                '600',
                '800',
                '1000',
                '1200',
                '1600',
                '2000',
                '2400',
                '2800',
                '3200',
            ],
        },
        rowGap: {
            control: { type: 'select' },
            options: [
                '0',
                '025',
                '050',
                '100',
                '150',
                '200',
                '300',
                '400',
                '500',
                '600',
                '800',
                '1000',
                '1200',
                '1600',
                '2000',
                '2400',
                '2800',
                '3200',
            ],
        },
        align: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'],
        },
        blockAlign: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'stretch', 'baseline'],
        },
        wrap: {
            control: { type: 'boolean' },
        },
    },
};

export const Default = {
    args: {
        gap: '500',
        align: 'start',
        blockAlign: 'stretch',
    },
    render: (args) => {
        return (
            <div
                style={{
                    padding: 'var(--bz-space-500)',
                    border: '1px solid var(--bz-color-purple-300)',
                }}
            >
                <InlineStack {...args}>
                    <div
                        style={{
                            border: '1px solid var(--bz-color-purple-300)',
                            padding: 'var(--bz-space-250)',
                        }}
                    >
                        Lorem, ipsum dolor.
                    </div>

                    <div
                        style={{
                            border: '1px solid var(--bz-color-purple-300)',
                            padding: 'var(--bz-space-250)',
                        }}
                    >
                        Lorem
                    </div>

                    <div
                        style={{
                            border: '1px solid var(--bz-color-purple-300)',
                            padding: 'var(--bz-space-250)',
                        }}
                    >
                        ipsum dolor.
                    </div>
                </InlineStack>
            </div>
        );
    },
};
