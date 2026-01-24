/**
 * External dependencies
 */

import { Head, router } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

/**
 * Internal dependencies
 */

import FormLabel from "@/components/form-label/form-label";
import TextInput from "@/components/text-input/text-input";
import Surface from "@/components/surface/surface";
import AuthenticationLayout from "@/layouts/authentication-layout/authentication-layout";
import Form from "@/components/form/form";
import InlineError from "@/components/inline-error/inline-error";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Button from "@/components/button/button";
import Password from "@/components/password/password";
import ResetPasswordValidationSchema from "@/pages/auth/reset-password/validations/reset-password-validation-schema";

const ResetPassword = (props) => {
    const { token, email } = props;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
        resolver: yupResolver(ResetPasswordValidationSchema),
    });

    const onSubmit = (data) => {
        router.post(route("password.store"), {
            token: token,
            email: email,
            password: data.password,
            password_confirmation: data.password_confirmation,
        });
    };

    return (
        <Surface>
            <BlockStack className="bz-reset-password-form">
                <Form id="reset-password-form">
                    <BlockStack gap="600">
                        <InlineStack gap="600" rowGap="400">
                            <BlockStack
                                gap="200"
                                className="bz-input-field-holder"
                            >
                                <FormLabel required>Имейл</FormLabel>

                                <TextInput
                                    id={"email"}
                                    value={email}
                                    disabled
                                    invalid={!!errors?.email}
                                    {...register("email")}
                                />
                                {errors?.email && (
                                    <InlineError>
                                        {errors?.email?.message}
                                    </InlineError>
                                )}
                            </BlockStack>
                        </InlineStack>

                        <InlineStack gap="600" rowGap="300">
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
                        </InlineStack>

                        <InlineStack gap="600" rowGap="300">
                            <BlockStack
                                gap="200"
                                className="bz-input-field-holder"
                            >
                                <FormLabel required>Повтори паролата</FormLabel>

                                <Password
                                    id={"password_confirmation"}
                                    placeholder="Повтори паролата"
                                    invalid={!!errors?.password_confirmation}
                                    {...register("password_confirmation")}
                                />
                                {errors?.password_confirmation && (
                                    <InlineError>
                                        {errors?.password_confirmation?.message}
                                    </InlineError>
                                )}
                            </BlockStack>
                        </InlineStack>

                        <Button
                            disabled={!isValid}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Напред
                        </Button>
                    </BlockStack>
                </Form>
            </BlockStack>
        </Surface>
    );
};

export default AuthenticationLayout.wrap(
    ResetPassword,
    "Възстановяване на парола",
);
