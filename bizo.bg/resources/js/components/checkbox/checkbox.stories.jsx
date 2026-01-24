/**
 * Internal dependencies
 */

import Checkbox from '@/components/checkbox/checkbox';

export default {
    title: 'Pastel/Checkbox',
    component: Checkbox,
};

export const Default = {
    render: (args) => {
        return <Checkbox {...args} />;
    },
};
Default.args = {
    name: 'checkbox',
    label: 'Label',
    disabled: false,
    invalid: false,
    checked: false,
};
