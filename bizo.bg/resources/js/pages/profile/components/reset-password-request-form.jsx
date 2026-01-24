/**
 * External dependencies
 */
import Form from "@/components/form/form";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Surface from "@/components/surface/surface";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Box from "@/components/box/box";
import IconUser from "@/components/icons/user";
import Icon from "@/components/icon/icon";
import Password from "@/components/password/password";
import FormLabel from "@/components/form-label/form-label";
import InlineError from "@/components/inline-error/inline-error";
import { token } from "@/tokens/tokens";

const ResetPasswordRequestForm = (props) => {
    const {
        fields,
        register,
        errors,
        handleSubmit,
        onResetPasswordSubmit,
        isChangingPassword,
    } = props;
    return (
        <>
            <Form id="profile-form">
                <BlockStack
                    gap="800"
                    className="bz-reset-password-request-form"
                >
                    <Surface>
                        <Box padding="1000">
                            <BlockStack gap="800">
                                <InlineStack gap="400" blockAlign="center">
                                    <Icon icon={IconUser} size="600" />
                                    <Text variant="heading-m">
                                        Смяна на парола
                                    </Text>
                                </InlineStack>

                                <BlockStack
                                    gap="400"
                                    className="bz-reset-password-request-form-box-content"
                                >
                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        <BlockStack
                                            gap="200"
                                            className="bz-input-field-holder"
                                        >
                                            <FormLabel required>
                                                {fields.find(
                                                    (f) =>
                                                        f.key ===
                                                        "current_password",
                                                )?.label || "Текуща парола"}
                                            </FormLabel>
                                            <Password
                                                key="current_password"
                                                id="current_password"
                                                placeholder="Въведи текуща парола"
                                                invalid={
                                                    !!errors.current_password
                                                }
                                                {...register(
                                                    "current_password",
                                                )}
                                            />
                                            {errors.current_password && (
                                                <InlineError>
                                                    {
                                                        errors.current_password
                                                            ?.message
                                                    }
                                                </InlineError>
                                            )}
                                        </BlockStack>
                                        <BlockStack className="bz-input-field-holder"></BlockStack>
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        <BlockStack
                                            gap="200"
                                            className="bz-input-field-holder"
                                        >
                                            <FormLabel required>
                                                {fields.find(
                                                    (f) => f.key === "password",
                                                )?.label || "Нова парола"}
                                            </FormLabel>
                                            <Password
                                                key="password"
                                                id="password"
                                                placeholder="Въведи нова парола"
                                                invalid={!!errors.password}
                                                {...register("password")}
                                            />
                                            {errors.password && (
                                                <InlineError>
                                                    {errors.password?.message}
                                                </InlineError>
                                            )}
                                        </BlockStack>
                                        <BlockStack
                                            gap="200"
                                            className="bz-input-field-holder"
                                        >
                                            <FormLabel required>
                                                {fields.find(
                                                    (f) =>
                                                        f.key ===
                                                        "password_confirmation",
                                                )?.label ||
                                                    "Потвърди нова парола"}
                                            </FormLabel>
                                            <Password
                                                key="password_confirmation"
                                                id="password_confirmation"
                                                placeholder="Повтори нова парола"
                                                invalid={
                                                    !!errors.password_confirmation
                                                }
                                                {...register(
                                                    "password_confirmation",
                                                )}
                                            />
                                            {errors.password_confirmation && (
                                                <InlineError>
                                                    {
                                                        errors
                                                            .password_confirmation
                                                            ?.message
                                                    }
                                                </InlineError>
                                            )}
                                        </BlockStack>
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </Surface>

                    <InlineStack align="end">
                        <Button
                            width={token("size.3600")}
                            onClick={handleSubmit(onResetPasswordSubmit)}
                            loading={isChangingPassword}
                        >
                            <Text>Запази</Text>
                        </Button>
                    </InlineStack>
                </BlockStack>
            </Form>
        </>
    );
};

export default ResetPasswordRequestForm;
