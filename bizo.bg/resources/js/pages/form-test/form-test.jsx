/**
 * External dependencies
 */
import { Head } from "@inertiajs/react";
import { useForm, Controller } from "react-hook-form";

/**
 * Internal dependencies
 */
import Form from "@/components/form/form";
import TextInput from "@/components/text-input/text-input";
import FormLabel from "@/components/form-label/form-label";
import Box from "@/components/box/box";
import Select from "@/components/select/select";
import BlockStack from "@/components/block-stack/block-stack";
import InlineError from "@/components/inline-error/inline-error";
import DateAndTimePicker from "@/components/date-and-time-picker/date-and-time-picker";

const options = [
    { value: "1", label: "Business Name" },
    { value: "2", label: "Brand" },
    { value: "3", label: "Subregion" },
    { value: "4", label: "Latest Reviews" },
    { value: "5", label: "Response Rate" },
    { value: "6", label: "More info" },
    { value: "7", label: "Business Stats" },
    { value: "8", label: "Tier" },
    { value: "10", label: "Country" },
    { value: "11", label: "Unresponded Reviews" },
];

export default function FormTest() {
    const {
        control,
        formState: { errors, defaultValues },
        register,
    } = useForm({
        mode: "onChange",
        defaultValues: {},
        //  resolver: yupResolver(gbpCredentialsCreateEditValidationSchema),
    });

    return (
        <>
            <Head title="Form" />

            <Box padding="400" width="20%">
                <Form>
                    <BlockStack gap="600">
                        <FormLabel>Car number</FormLabel>
                        <TextInput
                            invalid={false}
                            placeholder="Car number"
                            {...register("carNumber")}
                        />

                        <TextInput
                            invalid={true}
                            placeholder="Car number"
                            {...register("carNumber")}
                        />
                        <InlineError>Невалиден имейл адрес.</InlineError>

                        <TextInput
                            disabled={true}
                            placeholder="Car number"
                            {...register("carNumber")}
                        />

                        <Controller
                            name={"type"}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    invalid={false}
                                    isClearable={false}
                                    options={options}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    value={field.value}
                                />
                            )}
                        />

                        <Controller
                            name={"type2"}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    invalid={false}
                                    isClearable={true}
                                    options={options}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    value={field.value}
                                />
                            )}
                        />

                        <Controller
                            name={"type3_multi"}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    invalid={false}
                                    isClearable={true}
                                    options={options}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    isMulti={true}
                                    value={field.value}
                                />
                            )}
                        />

                        <DateAndTimePicker
                            fieldInput={true}
                            startDate={new Date()}
                            key={"startDate"}
                            showTime={false}
                        />
                    </BlockStack>
                </Form>
            </Box>
        </>
    );
}
