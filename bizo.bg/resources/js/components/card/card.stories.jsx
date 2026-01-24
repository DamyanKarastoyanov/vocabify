/**
 * Internal dependencies
 */
import Card from '@/components/card/card';
import Text from '@/components/text/text';
import Icon from '@/components/icon/icon';
import IconCalendar from '@/components/icons/calendar';

export default {
    title: 'Pastel/Card',
    component: Card,
    argTypes: {
        disabled: {
            control: { type: 'boolean' },
        },
    },
};

export const Default = {
    render: (args) => {
        return (
            <div
                style={{
                    width: '336px',
                }}
            >
                <Card disabled={args.disabled}>
                    <Card.Media>
                        <Icon size="200" icon={IconCalendar} color="purple-500" />
                    </Card.Media>

                    <Card.Content>
                        <Text as="h2" variant="heading-m" color="purple-400">
                            A small business is only as good as its tools and it is totally true.
                        </Text>

                        <Text variant="body-m" color="purple-30">
                            We've all experienced the chaos of multiple spreadsheets, tracking and insight tools, and
                            scrambling for the right data at the right time.
                        </Text>
                    </Card.Content>
                </Card>
            </div>
        );
    },
};