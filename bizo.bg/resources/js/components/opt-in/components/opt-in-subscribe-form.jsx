/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePage } from "@inertiajs/react";
import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Form from "@/components/form/form";
import FormControl from "@/components/form-control/form-control";
import FormLabel from "@/components/form-label/form-label";
import TextInput from "@/components/text-input/text-input";
import Checkbox from "@/components/checkbox/checkbox";
import Button from "@/components/button/button";
import OptInFormValidationSchema from "@/components/opt-in/validations/opt-in-form-validation-schema";
import InlineError from "@/components/inline-error/inline-error";
import Icon from "@/components/icon/icon";
import IconDocument from "@/components/icons/document";

const OptInSubscribeForm = (props) => {
    const { onSubmit } = props;
    const {
        auth: { user },
    } = usePage().props;

    const profileEmail = user?.email ?? "";
    const hasUser = !!user && !!user.email;

    const shouldUseProfileEmailByDefault = useMemo(
        () => !!profileEmail,
        [profileEmail],
    );

    const [useProfileEmail, setUseProfileEmail] = useState(
        shouldUseProfileEmailByDefault,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(OptInFormValidationSchema),
        mode: "onChange",
        defaultValues: {
            email: profileEmail,
            optIn: false,
        },
    });

    const handleUseProfileEmailChange = useCallback(
        (checked) => {
            setUseProfileEmail(checked);
            if (checked && profileEmail) {
                setValue("email", profileEmail, { shouldValidate: true });
            }
        },
        [profileEmail, setValue],
    );

    useEffect(() => {
        if (useProfileEmail && profileEmail) {
            setValue("email", profileEmail, { shouldValidate: true });
        }
    }, [useProfileEmail, profileEmail, setValue]);

    return (
        <BlockStack className="bz-opt-in-form" gap="800">
            <InlineStack gap="400">
                <Icon icon={IconDocument} size="600" />

                <Text variant="heading-m">Абонирай се</Text>
            </InlineStack>

            <Text variant="body-l" color="text-secondary">
                Забравяш кога изтичат винетката, гражданската и прегледът на
                твоята кола? Не се притеснявай – не си сам. Абонирай се за
                автоматични напомняния за живот без стрес и глоби.
            </Text>

            <Form id="opt-in-form">
                <BlockStack gap="800">
                    <FormControl>
                        <FormLabel> Имейл: </FormLabel>

                        <InlineStack gap="200" blockAlign="center" wrap={false}>
                            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                                <TextInput
                                    id="email"
                                    placeholder="Въведи имейл"
                                    {...register("email", { required: true })}
                                    invalid={!!errors.email}
                                    disabled={useProfileEmail}
                                />
                            </div>

                            {hasUser && (
                                <Checkbox
                                    onChange={(e) =>
                                        handleUseProfileEmailChange(
                                            e.target.checked,
                                        )
                                    }
                                    checked={useProfileEmail}
                                    label="Използвай имейла от профила"
                                />
                            )}
                        </InlineStack>

                        {errors.email && (
                            <InlineError>{errors.email.message}</InlineError>
                        )}
                    </FormControl>

                    <FormControl>
                        <InlineStack gap="200" blockAlign="center">
                            <Checkbox
                                onChange={(e) =>
                                    setValue("optIn", e.target.checked)
                                }
                                checked={watch("optIn")}
                                label="Съгласен съм да получавам съобщения, реклами, промоции и оферти от Bizo.bg"
                            />
                        </InlineStack>
                    </FormControl>

                    <InlineStack align="center">
                        <Button onClick={handleSubmit(onSubmit)} width="300px">
                            <Text>Абонирай се</Text>
                        </Button>
                    </InlineStack>
                </BlockStack>
            </Form>
        </BlockStack>
    );
};

export default OptInSubscribeForm;
