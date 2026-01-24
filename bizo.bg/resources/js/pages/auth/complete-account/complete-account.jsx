/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePage, router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import FormLabel from "@/components/form-label/form-label";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import InlineError from "@/components/inline-error/inline-error";
import Password from "@/components/password/password";
import Form from "@/components/form/form";
import Button from "@/components/button/button";
import AuthenticationLayout from "@/layouts/authentication-layout/authentication-layout";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Text from "@/components/text/text";
import TextInput from "@/components/text-input/text-input";
import CompleteAccountValidationSchema from "@/pages/auth/complete-account/validations/complete-account-validation-schema";

const CompleteAccount = () => {
    const { token } = usePage().props;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            first_name: "",
            last_name: "",
            password: "",
            password_confirmation: "",
        },
        resolver: yupResolver(CompleteAccountValidationSchema),
    });

    const onSubmit = (data) => {
        router.post(route("account.complete.store"), {
            ...data,
            token: token,
        });
    };

    return (
        <>
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="600">
                        <Text variant="heading-m">Завърши регистрацията</Text>

                        <Form id="complete-account-form">
                            <BlockStack gap="400">
                                <BlockStack
                                    gap="200"
                                    className="bz-input-field-holder"
                                >
                                    <FormLabel required>Име</FormLabel>

                                    <TextInput
                                        id={"first_name"}
                                        placeholder="Въведи име"
                                        invalid={!!errors?.first_name}
                                        {...register("first_name")}
                                    />

                                    {errors?.first_name && (
                                        <InlineError>
                                            {errors?.first_name?.message}
                                        </InlineError>
                                    )}
                                </BlockStack>

                                <BlockStack
                                    gap="200"
                                    className="bz-input-field-holder"
                                >
                                    <FormLabel required>Фамилия</FormLabel>

                                    <TextInput
                                        id={"last_name"}
                                        placeholder="Въведи фамилия"
                                        invalid={!!errors?.last_name}
                                        {...register("last_name")}
                                    />

                                    {errors?.last_name && (
                                        <InlineError>
                                            {errors?.last_name?.message}
                                        </InlineError>
                                    )}
                                </BlockStack>

                                <BlockStack
                                    gap="200"
                                    className="bz-input-field-holder"
                                >
                                    <FormLabel required>Парола</FormLabel>

                                    <Password
                                        id={"password"}
                                        placeholder="Въведи парола"
                                        invalid={!!errors?.password}
                                        {...register("password")}
                                    />

                                    {errors?.password && (
                                        <InlineError>
                                            {errors?.password?.message}
                                        </InlineError>
                                    )}
                                </BlockStack>

                                <BlockStack
                                    gap="200"
                                    className="bz-input-field-holder"
                                >
                                    <FormLabel required>
                                        Повтори паролата
                                    </FormLabel>

                                    <Password
                                        id={"password_confirmation"}
                                        placeholder="Повтори паролата"
                                        invalid={
                                            !!errors?.password_confirmation
                                        }
                                        {...register("password_confirmation")}
                                    />
                                    {errors?.password_confirmation && (
                                        <InlineError>
                                            {
                                                errors?.password_confirmation
                                                    ?.message
                                            }
                                        </InlineError>
                                    )}
                                </BlockStack>

                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!isValid}
                                >
                                    Завърши регистрацията
                                </Button>
                            </BlockStack>
                        </Form>
                    </BlockStack>
                </Box>
            </Surface>
        </>
    );
};

export default AuthenticationLayout.wrap(CompleteAccount);
