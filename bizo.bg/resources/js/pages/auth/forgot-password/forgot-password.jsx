/**
 * External dependencies
 */

import { Head, router } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Internal dependencies
 */

import FormLabel from "@/components/form-label/form-label";
import InlineError from "@/components/inline-error/inline-error";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Button from "@/components/button/button";
import TextInput from "@/components/text-input/text-input";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import AuthenticationLayout from "@/layouts/authentication-layout/authentication-layout";
import Form from "@/components/form/form";
import ForgotPasswordValidationSchema from "@/pages/auth/forgot-password/validations/forgot-password-validation-schema";
import Text from "@/components/text/text";

const ForgotPassword = (props) => {
    const { status } = props;
    const [isEmailSent, setIsEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
        },
        resolver: yupResolver(ForgotPasswordValidationSchema),
    });

    const onSubmit = (data) => {
        router.post(route("password.request"), data, {
            preserveState: true,
            onSuccess: () => {
                setIsEmailSent(true);
            },
        });
    };

    return (
        <>
            <Head title="Забравена парола" />
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="600">
                        <Text variant="heading-m">Забравена парола</Text>

                        <Form id="forgot-password-form">
                            <BlockStack gap="400">
                                <BlockStack
                                    gap="200"
                                    className="bz-input-field-holder"
                                >
                                    <FormLabel required>Имейл</FormLabel>

                                    <TextInput
                                        id={"email"}
                                        placeholder="Въведи email"
                                        invalid={!!errors?.email}
                                        {...register("email")}
                                    />
                                    {errors?.email && (
                                        <InlineError>
                                            {errors?.email.message}
                                        </InlineError>
                                    )}
                                    {status && (
                                        <InlineError>{status}</InlineError>
                                    )}
                                </BlockStack>

                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isEmailSent || !isValid}
                                >
                                    Изпрати имейл
                                </Button>
                            </BlockStack>
                        </Form>
                    </BlockStack>
                </Box>
            </Surface>
        </>
    );
};

export default AuthenticationLayout.wrap(ForgotPassword);
