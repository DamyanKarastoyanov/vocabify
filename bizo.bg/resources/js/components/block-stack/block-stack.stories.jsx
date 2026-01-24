/**
 * Internal dependencies
 */
import BlockStack from '@/components/block-stack/block-stack';

export default {
    title: 'Pastel/BlockStack',
    component: BlockStack,
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
        align: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'],
        },
        inlineAlign: {
            control: { type: 'select' },
            options: ['start', 'center', 'end', 'stretch', 'baseline'],
        },
        height: {
            control: { type: 'text' },
        },
    },
};

export const Default = {
    args: {
        gap: '500',
        align: 'start',
        inlineAlign: 'stretch',
    },
    render: (args) => {
        return (
            <div
                style={{
                    display: 'flex',
                    padding: 'var(--bz-space-500)',
                    width: 'max-content',
                    height: '256px',
                    border: '1px solid var(--bz-color-purple-300)',
                }}
            >
                <BlockStack {...args}>
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
                </BlockStack>
            </div>
        );
    },
};
