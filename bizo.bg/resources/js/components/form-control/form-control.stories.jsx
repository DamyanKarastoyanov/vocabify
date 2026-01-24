/**
 * Internal dependencies
 */
import FormControl from '@/components/form-control/form-control';
import TextInput from '@/components/text-input/text-input';
import IconButton from '@/components/icon-button/icon-button';
import IconEye from '@/components/icons/eye';
import FormLabel from '@/components/form-label/form-label';

export default {
    title: 'Pastel/FormControl',
    component: FormControl,
};

export const Default = {
    render: () => {
        return (
            <FormControl>
                <FormLabel for="test">Label</FormLabel>

                <TextInput id="test" placeholder="Type your password..." suffix={<IconButton icon={IconEye} />} />
            </FormControl>
        );
    },
};
