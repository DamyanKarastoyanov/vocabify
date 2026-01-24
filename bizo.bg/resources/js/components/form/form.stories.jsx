/**
 * Extrernal dependencies
 */
import { useState } from 'react';

/**
 * Internal dependencies
 */
import FormControl from '@/components/form-control/form-control';
import TextInput from '@/components/text-input/text-input';
import Textarea from '@/components/textarea/textarea';
import FormLabel from '@/components/form-label/form-label';
import Form from '@/components/form/form';
import BlockStack from '@/components/block-stack/block-stack';

export default {
    title: 'Pastel/Form',
    component: Form,
};

export const Default = {
    render: (args) => {
        const { defaultValues } = args;

        const [formValues, setFormValues] = useState(defaultValues);

        const handleChange = (e) => {
            const { id, value } = e.target;
            setFormValues((prevValues) => ({
                ...prevValues,
                [id]: value,
            }));
        };

        return (
            <Form defaultValues={defaultValues} formValues={formValues}>
                <BlockStack gap="400">
                    <FormControl>
                        <FormLabel for="firstValue">First Field</FormLabel>
                        <TextInput
                            id="firstValue"
                            placeholder="Type here..."
                            value={formValues.firstValue}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel for="secondValue">Second Field</FormLabel>
                        <Textarea
                            id="secondValue"
                            placeholder="Type here..."
                            rows="4"
                            value={formValues.secondValue}
                            onChange={handleChange}
                        />
                    </FormControl>
                </BlockStack>
            </Form>
        );
    },
};

Default.args = {
    defaultValues: {
        firstValue: '',
        secondValue: '',
    },
};
