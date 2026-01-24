/**
 * Internal dependencies
 */
import FormLabel from '@/components/form-label/form-label';

export default {
    title: 'Pastel/FormLabel',
    component: FormLabel,
};

export const Default = {
    render: (args) => {
        return <FormLabel {...args}>Label</FormLabel>;
    },
};
Default.args = {
    disabled: false,
    invalid: false,
    required: false,
};
