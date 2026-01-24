/**
 * Internal dependencies
 */
import FormControl from '@/components/form-control/form-control';
import FormLabel from '@/components/form-label/form-label';
import TextInput from '@/components/text-input/text-input';
import InlineError from '@/components/inline-error/inline-error';
import IconButton from '@/components/icon-button/icon-button';
import IconEye from '@/components/icons/eye';

export default {
    title: 'Pastel/InlineError',
    component: InlineError,
};

export const Default = {
    render: () => {
        return (
            <FormControl>
                <FormLabel htmlFor="test">Label</FormLabel>

                <TextInput id="test" placeholder="Type your password..." suffix={<IconButton icon={IconEye} />} />

                <InlineError>Text message for the error</InlineError>
            </FormControl>
        );
    },
};
