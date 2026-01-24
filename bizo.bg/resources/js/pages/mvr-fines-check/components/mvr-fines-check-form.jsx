/**
 * External dependencies
 */
import {
    useCallback,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import useCheckMVRFinesMutation from "@/pages/mvr-fines-check/data/use-check-mvr-fines-mutation";
import MVRFinesCheckValidationSchema from "@/pages/mvr-fines-check/validations/mvr-fines-check-validation-schema";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import Form from "@/components/form/form";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import TermsAcceptance from "@/components/terms-acceptance/terms-acceptance";
import InlineStack from "@/components/inline-stack/inline-stack";

const MVRFinesCheckForm = forwardRef((props, ref) => {
    const { setCheckResults } = props;
    const { mvr_fines_check } = usePage().props;

    const fields = mvr_fines_check.fields || [];

    const defaultValues = useMemo(() => {
        const profileField = fields.find((f) => f.key === "profile");

        if (
            profileField?.isVisible &&
            profileField?.values &&
            profileField.values.length > 0
        ) {
            const firstOption = profileField.values[0];
            if (firstOption && firstOption.value !== 0) {
                return {
                    profile: firstOption,
                    egn: firstOption.personal_identification_number || "",
                    driving_licence_number: firstOption.driver_license || "",
                };
            }
        }

        return {
            profile:
                profileField?.selected ||
                (profileField?.values && profileField.values.length > 0
                    ? profileField.values[0]
                    : undefined),
            egn: "",
            driving_licence_number: "",
            termsAccepted: false,
        };
    }, [fields]);

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset,
        trigger,
        getValues,
        control,
        clearErrors,
    } = useForm({
        defaultValues,
        resolver: yupResolver(MVRFinesCheckValidationSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const { mutate: checkMVRFines, isPending: isCheckingMVRFines } =
        useCheckMVRFinesMutation();

    const triggerErrors = useCallback(async () => {
        const allFields = ["egn", "driving_licence_number", "termsAccepted"];

        allFields.forEach((fieldName) => {
            const currentValue = getValues(fieldName);
            setValue(fieldName, currentValue, {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        await trigger();
    }, [trigger, getValues, setValue]);

    useImperativeHandle(ref, () => ({
        triggerErrors,
    }));

    // Handle initial profile auto-selection
    useEffect(() => {
        const profileField = fields.find((f) => f.key === "profile");
        if (
            profileField &&
            profileField.values &&
            profileField.values.length > 0 &&
            !profileField.selected
        ) {
            const firstOption = profileField.values[0];
            if (firstOption && firstOption.value !== 0) {
                setValue("profile", firstOption);
                setValue(
                    "egn",
                    firstOption.personal_identification_number || "",
                );
                setValue(
                    "driving_licence_number",
                    firstOption.driver_license || "",
                );
            }
        }
    }, [fields, setValue]);

    const onSubmit = useCallback(
        (data) => {
            const submitData = {
                egn: data.egn,
                driving_licence_number: data.driving_licence_number,
            };

            if (
                data.profile &&
                data.profile.value &&
                data.profile.value !== 0
            ) {
                submitData.profile_id = data.profile.value;
            }

            checkMVRFines(submitData, {
                onSuccess: (response) => {
                    if (response.success && !response.error) {
                        setCheckResults(response);
                    } else {
                        showAlert({
                            title: <Text color="red-500">Грешка</Text>,
                            message:
                                response.message ||
                                "Възникна грешка при проверката",
                            closable: true,
                            hideable: true,
                        });
                    }
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="red-500">Възникна грешка</Text>,
                        message:
                            error.response?.data?.message ||
                            "Възникна грешка при проверката",
                        closable: true,
                        hideable: true,
                    });
                },
            });
        },
        [checkMVRFines, setCheckResults, showAlert, closeAlert],
    );

    return (
        <Form
            id="mvr-fines-check-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <BlockStack gap="800" className="bz-mvr-fines-check-form">
                <BlockStack gap="400">
                    {fields.find((f) => f.key === "profile")?.isVisible &&
                        RenderFormFieldsUtils.renderSelectField({
                            fieldName: "profile",
                            onChangeHandler: (value) => {
                                clearErrors();
                                setValue("profile", value);
                                if (value.value === 0) {
                                    setValue("egn", "", {
                                        shouldValidate: false,
                                    });
                                    setValue("driving_licence_number", "", {
                                        shouldValidate: false,
                                    });
                                } else {
                                    setValue(
                                        "egn",
                                        value.personal_identification_number ||
                                            "",
                                    );
                                    setValue(
                                        "driving_licence_number",
                                        value.driver_license || "",
                                    );
                                }
                            },
                            fields: fields,
                            control,
                            error: errors.profile?.message,
                        })}

                    {RenderFormFieldsUtils.renderTextField(
                        "egn",
                        fields,
                        register,
                        errors.egn?.message,
                    )}

                    {RenderFormFieldsUtils.renderTextField(
                        "driving_licence_number",
                        fields,
                        register,
                        errors.driving_licence_number?.message,
                    )}

                    <TermsAcceptance
                        checked={watch("termsAccepted")}
                        onChange={(e) =>
                            setValue("termsAccepted", e.target.checked, {
                                shouldValidate: true,
                            })
                        }
                        error={errors?.termsAccepted}
                    />
                </BlockStack>

                <InlineStack align="center">
                    <Button
                        width="300px"
                        type="submit"
                        loading={isCheckingMVRFines}
                        disabled={isCheckingMVRFines}
                    >
                        <Text>Продължи</Text>
                    </Button>
                </InlineStack>
            </BlockStack>
        </Form>
    );
});

export default MVRFinesCheckForm;
