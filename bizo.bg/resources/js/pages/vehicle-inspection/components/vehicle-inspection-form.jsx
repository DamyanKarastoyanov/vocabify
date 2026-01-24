/**
 * External dependencies
 */
import {
    useState,
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
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import VehicleInspectionCaptcha from "@/pages/vehicle-inspection/components/vehicle-inspection-captcha";
import useRefreshCaptchaMutation from "@/pages/vehicle-inspection/data/use-refresh-captcha-mutation";
import useCheckInspectionMutation from "@/pages/vehicle-inspection/data/use-check-inspection-mutation";
import VehicleInspectionValidationSchema from "@/pages/vehicle-inspection/validations/vehicle-inspection-validation-schema";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import convertRegNumberToLatin from "@/utils/convert-reg-number-to-latin";
import Form from "@/components/form/form";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import TermsAcceptance from "@/components/terms-acceptance/terms-acceptance";
import useFieldControls from "@/hooks/use-field-controls";

const VehicleInspectionForm = forwardRef((props, ref) => {
    const { setInspectionResults } = props;
    const { vehicle_inspection } = usePage().props;
    const [captchaData, setCaptchaData] = useState(null);

    const fields = vehicle_inspection.fields || [];
    const { applyUpperCaseToField } = useFieldControls(fields);

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const defaultValues = useMemo(() => {
        const vehicleField = fields.find((f) => f.key === "vehicle");
        if (vehicleField?.values?.length > 0) {
            const firstVehicle = vehicleField.values[0];
            if (firstVehicle) {
                return {
                    vehicle: firstVehicle,
                    registration_number: firstVehicle.number,
                    captcha_code: "",
                    captcha_session: "",
                    termsAccepted: false,
                };
            }
        }
        return {
            registration_number: "",
            captcha_code: "",
            captcha_session: "",
            termsAccepted: false,
        };
    }, [fields]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        control,
        trigger,
        getValues,
        reset,
        clearErrors,
    } = useForm({
        resolver: yupResolver(VehicleInspectionValidationSchema),
        defaultValues,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const registrationNumber = watch("registration_number");

    const { mutate: refreshCaptcha, isPending: isRefreshingCaptcha } =
        useRefreshCaptchaMutation();

    const { mutate: checkInspection, isPending: isCheckingInspection } =
        useCheckInspectionMutation();

    const handleCaptchaRefresh = useCallback(() => {
        refreshCaptcha(
            {},
            {
                onSuccess: (response) => {
                    if (response.data.success) {
                        setCaptchaData(response.data);
                        setValue(
                            "captcha_session",
                            response.data.captcha_session || "",
                        );
                        setValue("captcha_code", "");
                    }
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="red-500">Възникна грешка</Text>,
                        message:
                            error.response?.data?.message ||
                            "Възникна грешка при зареждане на captcha",
                        closable: true,
                        hideable: true,
                    });
                },
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshCaptcha, setValue]);

    const triggerErrors = useCallback(async () => {
        const allFields = [
            "registration_number",
            "captcha_code",
            "captcha_session",
            "termsAccepted",
        ];

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
            const formattedData = {
                ...data,
                registration_number: convertRegNumberToLatin(
                    data.registration_number,
                ),
            };

            checkInspection(formattedData, {
                onSuccess: (response) => {
                    if (response.data.success && response.data.data.found) {
                        setInspectionResults(response.data);
                        reset(defaultValues);
                    }
                    if (!response.data.data.found) {
                        showAlert({
                            title: <Text color="red-500">Грешка</Text>,
                            message:
                                response.data.message ||
                                "Няма намерен автомобил с този регистрационен номер",
                            closable: true,
                            hideable: true,
                        });
                        handleCaptchaRefresh();
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
                    setValue("captcha_code", "");
                    handleCaptchaRefresh();
                },
            });
        },
        [
            checkInspection,
            handleCaptchaRefresh,
            setInspectionResults,
            setValue,
            closeAlert,
        ],
    );

    useEffect(() => {
        applyUpperCaseToField(
            "registration_number",
            registrationNumber,
            setValue,
        );
    }, [applyUpperCaseToField, registrationNumber, setValue]);

    // Load captcha on component mount
    useEffect(() => {
        handleCaptchaRefresh();
    }, [handleCaptchaRefresh]);

    return (
        <Form
            id="vehicle-inspection-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <BlockStack gap="800" className="bz-vehicle-inspection-form">
                <BlockStack gap="400">
                    {RenderFormFieldsUtils.renderSelectField({
                        fieldName: "vehicle",
                        onRenderHandler: (field) => {
                            field.values =
                                fields.find((f) => f.key === "vehicle")
                                    ?.values || [];
                            return field;
                        },
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
                                    value.number || "",
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

                    <VehicleInspectionCaptcha
                        register={register("captcha_code")}
                        captchaData={captchaData}
                        onRefreshClick={handleCaptchaRefresh}
                        isRefreshing={isRefreshingCaptcha}
                        fieldErrorText={errors.captcha_code?.message}
                    />

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
                        width="250px"
                        type="submit"
                        loading={isCheckingInspection}
                        disabled={isCheckingInspection}
                    >
                        <Text>Продължи</Text>
                    </Button>
                </InlineStack>
            </BlockStack>
        </Form>
    );
});

export default VehicleInspectionForm;
