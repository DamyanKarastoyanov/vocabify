/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    useMemo,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import { usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Form from "@/components/form/form";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import IconCar from "@/components/icons/car";
import Icon from "@/components/icon/icon";
import VehicleDataValidationSchema from "@/pages/mtpl-insurance/validations/vehicle-data-validation-schema";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";

const VehicleDataForm = forwardRef((props, ref) => {
    const { mtpl_insurance } = usePage().props;
    const { vehicleDataFormData, setVehicleDataFormData, setLastVisitedStep } =
        useFormDataContext();
    const { setIsVehicleDataValid } = useValidityContext();

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const fields = mtpl_insurance.fields || [];

    const defaultValues = useMemo(() => {
        if (vehicleDataFormData) {
            return vehicleDataFormData;
        }
        const vehicleField = fields.find((f) => f.key === "vehicle");

        if (vehicleField?.values?.length > 0) {
            const firstVehicle = vehicleField.values[0];
            if (firstVehicle) {
                return {
                    vehicle: fields
                        .find((f) => f.key === "vehicle")
                        .values.find((v) => v.value === firstVehicle.value),
                    number: firstVehicle.number || "",
                    talon: firstVehicle.talon || "",
                };
            }
        }

        return {
            vehicle: vehicleField?.selected || "",
            number: "",
            talon: "",
        };
    }, [vehicleDataFormData, fields]);

    const {
        register,
        watch,
        formState: { errors, isValid },
        setValue,
        trigger,
        control,
    } = useForm({
        resolver: yupResolver(VehicleDataValidationSchema),
        defaultValues,
        mode: "onChange",
    });

    const vehicleFormData = useMemo(() => {
        const regNumber = watch("number");
        const talon = watch("talon");
        const vehicle = watch("vehicle");

        return {
            number: regNumber,
            talon: talon,
            vehicle: vehicle,
        };
    }, [watch("number"), watch("talon"), watch("vehicle")]);

    // Track form initialization
    useEffect(() => {
        if (
            !vehicleDataFormData ||
            (vehicleDataFormData &&
                JSON.stringify(vehicleFormData) ===
                    JSON.stringify(vehicleDataFormData))
        ) {
            setIsFormInitialized(true);
        }
    }, [vehicleDataFormData, vehicleFormData]);

    // Update form data and lastVisitedStep on changes
    useEffect(() => {
        const isFormChanged =
            JSON.stringify(vehicleFormData) !==
            JSON.stringify(vehicleDataFormData);

        if (isFormInitialized && isFormChanged) {
            setVehicleDataFormData(vehicleFormData);
            setLastVisitedStep(1);
        }
    }, [
        vehicleFormData,
        isFormInitialized,
        setVehicleDataFormData,
        setLastVisitedStep,
    ]);

    useEffect(() => {
        setIsVehicleDataValid(isValid);
    }, [isValid, setIsVehicleDataValid]);

    // Focus on talon field when component mounts with pre-filled number
    useEffect(() => {
        if (defaultValues.number && !defaultValues.talon) {
            setTimeout(() => {
                document.getElementById("talon")?.focus();
            }, 100);
        }
    }, []);

    const triggerErrors = async () => {
        const allFields = ["number", "talon"];

        allFields.forEach((fieldName) => {
            setValue(fieldName, watch(fieldName), {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        await trigger();
    };

    useImperativeHandle(ref, () => ({
        triggerErrors,
    }));

    return (
        <Form id="mtpl-insurance__vehicle-data-form">
            <BlockStack gap="300">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconCar} size="600" />
                                <Text variant="heading-m">
                                    Данни на автомобила
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                {fields.find((f) => f.key === "vehicle")
                                    ?.isVisible &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "vehicle",
                                        onChangeHandler: (value) => {
                                            if (value.value === 0) {
                                                setValue("number", "");
                                                setValue("talon", "");
                                            } else {
                                                setValue(
                                                    "number",
                                                    value.number,
                                                );
                                                setValue("talon", value.talon);
                                            }
                                        },
                                        fields,
                                        control,
                                        error: errors.vehicle?.message,
                                    })}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="center"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "number",
                                        fields,
                                        register,
                                        errors.number?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "talon",
                                        fields,
                                        register,
                                        errors.talon?.message,
                                    )}
                                </InlineStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
});

export default VehicleDataForm;
