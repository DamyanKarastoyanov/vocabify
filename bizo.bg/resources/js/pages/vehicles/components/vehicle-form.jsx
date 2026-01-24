/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, usePage } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import IconButton from "@/components/icon-button/icon-button";
import Button from "@/components/button/button";
import Form from "@/components/form/form";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconCar from "@/components/icons/car";
import IconFloppyDisk from "@/components/icons/floppy-disk";
import IconX from "@/components/icons/x";
import useCreateVehicleMutation from "@/pages/vehicles/data/use-create-vehicle-mutation";
import useGetVehicleDetailsQuery from "@/pages/vehicles/data/use-get-vehicle-details-query";
import vehicleFormValidationSchema from "@/pages/vehicles/validations/vehicle-form-validation-schema";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import { ensureIndexHash } from "@/utils/hash-utils";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";

const VehicleForm = (props) => {
    const { setCurrentVehicle, setIsInCreateMode } = props;

    const route = useRoute();
    const { vehicleId } = route().params;

    const { vehicles: vehiclesData } = usePage().props;
    const columns = vehiclesData?.columns || {};

    const { mutate: createVehicle, isPending: isCreatingVehicle } =
        useCreateVehicleMutation();

    const { data: vehicleDetails } = useGetVehicleDetailsQuery(vehicleId);

    const { showAlert } = useAlert(Alert, {
        duration: 5000,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const [fields, setFields] = useState(() => {
        return Object.values(columns).filter((col) => col.isEnabled);
    });

    useEffect(() => {
        const vehicleData = vehicleDetails?.data || vehicleDetails;
        if (vehicleData && vehicleId) {
            const baseFields = Object.values(columns).filter(
                (col) => col.isEnabled,
            );
            const updatedFields = baseFields.map((field) => {
                if (field.key === "reg_number" && vehicleData.reg_number) {
                    return { ...field, selected: vehicleData.reg_number };
                }
                if (field.key === "talon" && vehicleData.talon) {
                    return { ...field, selected: vehicleData.talon };
                }
                return field;
            });
            setFields(updatedFields);
        } else if (!vehicleId) {
            // Reset to base fields when not editing
            const baseFields = Object.values(columns).filter(
                (col) => col.isEnabled,
            );
            setFields(baseFields);
        }
    }, [vehicleDetails, vehicleId, columns]);

    const defaultValues = useMemo(() => {
        return fields.reduce((acc, field) => {
            if (field.key && field.selected !== undefined) {
                acc[field.key] = field.selected || "";
            }
            return acc;
        }, {});
    }, [fields]);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        defaultValues,
        resolver: yupResolver(vehicleFormValidationSchema),
        mode: "onChange",
    });

    // Reset the form with the defaultValues when the form is being mounted or fields change
    useEffect(() => {
        if (Object.keys(defaultValues).length) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const onSubmit = (data) => {
        const transformedData = {
            reg_number: data.reg_number,
            talon: data.talon || null,
        };

        createVehicle(transformedData, {
            onSuccess: () => {
                showAlert({
                    title: <Text color="green-500">Успех</Text>,
                    message: vehicleId
                        ? "Превозното средство беше редактирано успешно"
                        : "Превозното средство беше създадено успешно",
                    closable: true,
                    hideable: true,
                });
                setIsInCreateMode(false);
                setCurrentVehicle(null);
                router.reload({
                    data: { ...route().params, vehicleId: null },
                    onFinish: ensureIndexHash,
                });
            },
            onError: (error) => {
                showAlert({
                    title: <Text color="red-500">Възникна грешка</Text>,
                    message:
                        error.response?.data?.message ||
                        "Възникна грешка при " +
                            (vehicleId ? "редактиране" : "създаване") +
                            " на превозното средство",
                    closable: true,
                    hideable: true,
                });
            },
        });
    };

    return (
        <BlockStack className="bz-vehicles-form" align="center" gap="800">
            <Surface>
                <Form id="edit-vehicle-form">
                    <Box className="bz-vehicles-list" padding="1000">
                        <BlockStack gap="400">
                            <InlineStack
                                gap="300"
                                blockAlign="center"
                                align="space-between"
                            >
                                <InlineStack gap="300">
                                    <Icon icon={IconCar} size="600" />

                                    <Text variant="heading-s">
                                        {vehicleId
                                            ? "Автомобил"
                                            : "Нов автомобил"}
                                    </Text>
                                </InlineStack>

                                <InlineStack gap="100">
                                    <Button
                                        variant="plain"
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={!isValid || isCreatingVehicle}
                                    >
                                        <InlineStack gap="100">
                                            <Icon
                                                size="600"
                                                icon={IconFloppyDisk}
                                                color="brand-500"
                                            />
                                            <Text color="brand-500">
                                                {vehicleId
                                                    ? "Запази"
                                                    : "Създай"}
                                            </Text>
                                        </InlineStack>
                                    </Button>

                                    <IconButton
                                        variant="primary"
                                        size="600"
                                        icon={IconX}
                                        onClick={() => {
                                            setCurrentVehicle(null);
                                            setIsInCreateMode(false);
                                        }}
                                        aria-label="Затвори"
                                    />
                                </InlineStack>
                            </InlineStack>

                            <BlockStack
                                className="bz-vehicles-form-fields"
                                gap="400"
                            >
                                <InlineStack
                                    align="space-between"
                                    rowGap="300"
                                    gap="600"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "reg_number",
                                        fields,
                                        register,
                                        errors.reg_number?.message,
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
                </Form>
            </Surface>
        </BlockStack>
    );
};

export default VehicleForm;
