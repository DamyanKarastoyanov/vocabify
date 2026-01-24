/**
 * External dependencies
 */
import { Link, router, usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * Internal dependencies
 */
import FormLabel from "@/components/form-label/form-label";
import TextInput from "@/components/text-input/text-input";
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import InlineStack from "@/components/inline-stack/inline-stack";
import InlineError from "@/components/inline-error/inline-error";
import RegisterEmailValidationSchema from "@/pages/auth/register/validations/register-email-validation-schema";
import Button from "@/components/button/button";
import AuthenticationLayout from "@/layouts/authentication-layout/authentication-layout";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Text from "@/components/text/text";
import TermsAcceptance from "@/components/terms-acceptance/terms-acceptance";

const RegisterEmail = () => {
    const { status } = usePage().props;
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(RegisterEmailValidationSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            termsAccepted: false,
        },
    });

    const onSubmit = (data) => {
        router.post(route("register-email"), data);
    };

    return (
        <>
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="600">
                        <Text variant="heading-m">Регистрация</Text>

                        <Form id="register-email-form">
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

                                <TermsAcceptance
                                    checked={watch("termsAccepted")}
                                    onChange={(e) =>
                                        setValue(
                                            "termsAccepted",
                                            e.target.checked,
                                            {
                                                shouldValidate: false,
                                            },
                                        )
                                    }
                                    error={errors?.termsAccepted}
                                />

                                <Button onClick={handleSubmit(onSubmit)}>
                                    Изпрати активация
                                </Button>
                            </BlockStack>
                        </Form>

                        <InlineStack align="center">
                            <Link variant="secondary" href={route("login")}>
                                <Text color="brand-500" fontWeight="regular">
                                    Вече имаш акаунт?
                                </Text>
                            </Link>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Surface>
        </>
    );
};

export default AuthenticationLayout.wrap(RegisterEmail);
