/**
 * External Dependencies
 */
import { Link, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

/**
 * Internal Dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Surface from "@/components/surface/surface";
import Form from "@/components/form/form";
import Box from "@/components/box/box";
import Button from "@/components/button/button";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import InlineError from "@/components/inline-error/inline-error";
import FormLabel from "@/components/form-label/form-label";
import TextInput from "@/components/text-input/text-input";
import Password from "@/components/password/password";
import LoginValidationSchema from "@/pages/auth/login/validations/login-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import AuthenticationLayout from "@/layouts/authentication-layout/authentication-layout";

const Login = (props) => {
    const { canResetPassword } = props;
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(LoginValidationSchema),
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    const [errorMessages, setErrorMessages] = useState(null);

    const onSubmit = (data) => {
        setErrorMessages({});
        router.post(route("login"), data, {
            onError: (errors) => {
                setErrorMessages(errors);
            },
        });
    };

    return (
        <>
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="600">
                        <Text variant="heading-m">Вход</Text>

                        <Form id="login-form">
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
                                            {errors?.email}
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
                                            {errors?.password}
                                        </InlineError>
                                    )}
                                </BlockStack>

                                {errorMessages ? (
                                    <BlockStack
                                        className="bz-auth-login__errors"
                                        gap="200"
                                    >
                                        {Object.entries(errorMessages).map(
                                            ([key, value]) => (
                                                <InlineError
                                                    variant="caption-s"
                                                    key={key}
                                                >
                                                    {value}
                                                </InlineError>
                                            ),
                                        )}
                                    </BlockStack>
                                ) : null}

                                {canResetPassword && (
                                    <InlineStack align="end">
                                        <Link
                                            variant="caption-s"
                                            href={route("password.request")}
                                        >
                                            <Text
                                                color="brand-500"
                                                fontWeight="regular"
                                            >
                                                Забравена парола?
                                            </Text>
                                        </Link>
                                    </InlineStack>
                                )}

                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!isValid}
                                >
                                    Вход
                                </Button>
                            </BlockStack>
                        </Form>

                        <InlineStack align="center">
                            <Link variant="secondary" href={route("register")}>
                                <Text color="brand-500" fontWeight="regular">
                                    Регистрирай се
                                </Text>
                            </Link>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Surface>
        </>
    );
};

export default AuthenticationLayout.wrap(Login);
