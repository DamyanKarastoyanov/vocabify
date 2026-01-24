/**
 * Internal dependencies
 */
import Textarea from '@/components/textarea/textarea';

export default {
    title: 'Pastel/Textarea',
    component: Textarea,
};

export const Default = {
    render: (args) => {
        return <Textarea {...args} />;
    },
};

Default.args = {
    placeholder: '',
    invalid: false,
    disabled: false,
};
