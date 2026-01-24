/**
 * External dependencies
 */
import {
    useCallback,
    forwardRef,
    useImperativeHandle,
    useMemo,
    useEffect,
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
import useCheckMtplMutation from "@/pages/mtpl-check/data/use-check-mtpl-mutation";
import MtplCheckValidationSchema from "@/pages/mtpl-check/validations/mtpl-check-validation-schema";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import convertRegNumberToLatin from "@/utils/convert-reg-number-to-latin";
import Form from "@/components/form/form";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import TermsAcceptance from "@/components/terms-acceptance/terms-acceptance";
import InlineStack from "@/components/inline-stack/inline-stack";
import useFieldControls from "@/hooks/use-field-controls";

const MtplCheckForm = forwardRef((props, ref) => {
    const { setCheckResults } = props;
    const { mtpl_check } = usePage().props;

    const fields = mtpl_check.fields || [];
    const { applyUpperCaseToField } = useFieldControls(fields);

    const defaultValues = useMemo(() => {
        const vehicleField = fields.find((f) => f.key === "vehicle");

        if (vehicleField?.values?.length > 0) {
            const firstVehicle = vehicleField.values[0];
            if (firstVehicle && firstVehicle.value !== 0) {
                return {
                    vehicle: firstVehicle,
                    registration_number: firstVehicle.reg_number || "",
                };
            }
        }

        return {
            vehicle: null,
            registration_number: "",
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
        resolver: yupResolver(MtplCheckValidationSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
    });
    const registrationNumber = watch("registration_number");

    const { mutate: checkMtpl, isPending: isCheckingMtpl } =
        useCheckMtplMutation();

    const triggerErrors = useCallback(async () => {
        const allFields = ["vehicle", "registration_number", "termsAccepted"];

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

    const onSubmit = useCallback(
        (data) => {
            checkMtpl(
                {
                    registration_number: convertRegNumberToLatin(
                        data.registration_number,
                    ),
                },
                {
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
                },
            );
        },
        [checkMtpl, setCheckResults, showAlert, closeAlert],
    );

    useEffect(() => {
        applyUpperCaseToField(
            "registration_number",
            registrationNumber,
            setValue,
        );
    }, [applyUpperCaseToField, registrationNumber, setValue]);

    return (
        <Form id="mtpl-check-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <BlockStack gap="800" className="bz-mtpl-check-form">
                <BlockStack gap="400">
                    {RenderFormFieldsUtils.renderSelectField({
                        fieldName: "vehicle",
                        onChangeHandler: (value) => {
                            clearErrors();
                            if (value.value === 0) {
                                setValue("vehicle", value);
                                setValue("registration_number", "", {
                                    shouldValidate: false,
                                    shouldTouch: false,
                                });
                            } else {
                                setValue("vehicle", value);
                                setValue(
                                    "registration_number",
                                    value.reg_number || "",
                                    {
                                        shouldValidate: true,
                                        shouldTouch: true,
                                    },
                                );
                            }
                        },
                        fields,
                        control,
                        error: errors.vehicle?.message,
                    })}

                    {RenderFormFieldsUtils.renderTextField(
                        "registration_number",
                        fields,
                        register,
                        errors.registration_number?.message,
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
                        type="submit"
                        loading={isCheckingMtpl}
                        disabled={isCheckingMtpl}
                        width="250px"
                    >
                        <Text>Продължи</Text>
                    </Button>
                </InlineStack>
            </BlockStack>
        </Form>
    );
});

export default MtplCheckForm;
