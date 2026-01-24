/**
 * External dependencies
 */
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useRoute } from "ziggy-js";
import { stripHash } from "@/utils/hash-utils";

/**
 * Internal dependencies
 */
import { formatDate } from "@/utils/formatting";
import { ensureIndexHash } from "@/utils/hash-utils";
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import InlineStack from "@/components/inline-stack/inline-stack";
import EntityCard from "@/components/entity-card/entity-card";
import IconCar from "@/components/icons/car";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import VehicleForm from "@/pages/vehicles/components/vehicle-form";
import VehicleSingleView from "@/pages/vehicles/components/vehicle-single-view";
import useDeleteVehicleMutation from "@/pages/vehicles/data/use-delete-vehicle-mutation";
import VehicleDeleteConfirmation from "@/pages/vehicles/components/vehicle-delete-confirmation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Button from "@/components/button/button";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconPlus from "@/components/icons/plus";

const Vehicles = () => {
    const { vehicles: vehiclesData } = usePage().props;
    const vehicles = vehiclesData?.vehicles;
    const route = useRoute();
    const { vehicleId } = route().params;

    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [isInCreateMode, setIsInCreateMode] = useState(false);

    useEffect(() => {
        if (!vehicleId) {
            ensureIndexHash();
        }
    }, []);

    useEffect(() => {
        if (isInCreateMode) {
            setCurrentVehicle({});
            return;
        }

        if (vehicleId) {
            const found = vehicles?.find(
                (v) => String(v.id) === String(vehicleId),
            );
            setCurrentVehicle(found || null);
        } else {
            if (!isInCreateMode) {
                setCurrentVehicle(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleId, vehicles, isInCreateMode]);

    const onClickHandler = (id) => {
        if (isInCreateMode) setIsInCreateMode(false);
        router.reload({
            data: {
                ...route().params,
                vehicleId: id,
            },
            onFinish: stripHash,
        });
        window.scrollTo(0, 0);
    };

    const onCreateClick = () => {
        setIsInCreateMode(true);
    };

    const onEditClick = () => {
        setIsInCreateMode(true);
    };

    const { mutate: deleteVehicle, isPending: isDeleting } =
        useDeleteVehicleMutation(currentVehicle?.id);

    const { showAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const handleDeleteConfirm = () => {
        deleteVehicle(
            {},
            {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Превозното средство беше изтрито успешно",
                        closable: true,
                        hideable: true,
                    });
                    setCurrentVehicle(null);
                    router.reload({
                        data: {
                            ...route().params,
                            vehicleId: null,
                        },
                        onFinish: stripHash,
                    });
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="red-500">Възникна грешка</Text>,
                        message:
                            error.response?.data?.message ||
                            "Възникна грешка при изтриването на превозното средство.",
                        closable: true,
                        hideable: true,
                    });
                },
            },
        );
    };

    const getInspectionStatusHtml = (isValid) => {
        if (isValid === null || isValid === undefined) {
            return '<span class="bz-text-pending">Няма данни за преглед</span>';
        }

        if (isValid === true) {
            return '<span class="bz-text-active">Валиден преглед</span>';
        }

        if (isValid === false) {
            return '<span class="bz-text-declined">Невалиден преглед</span>';
        }
    };

    const renderVehicles = (vehicles) => {
        return vehicles.map((vehicle) => {
            const hasInspection =
                vehicle.is_valid !== null && vehicle.is_valid !== undefined;

            return (
                <EntityCard
                    key={vehicle.id}
                    id={vehicle.id}
                    icon={IconCar}
                    clickHandler={onClickHandler}
                    headerInfo={vehicle.title}
                    actionInfo={getInspectionStatusHtml(vehicle.is_valid)}
                    detailsInfo={
                        vehicle.manufactured_year ||
                        (hasInspection && vehicle.next_inspection_date && (
                            <InlineStack className="bz-vehicle-details">
                                {vehicle.manufactured_year && (
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        Година на производство:{" "}
                                        {vehicle.manufactured_year}
                                    </Text>
                                )}
                                {hasInspection &&
                                    vehicle.next_inspection_date && (
                                        <Text
                                            variant="body-s"
                                            color="text-secondary"
                                        >
                                            Следващ преглед:{" "}
                                            {formatDate(
                                                vehicle.next_inspection_date,
                                                "dd.MM.yyyy",
                                            )}
                                        </Text>
                                    )}
                            </InlineStack>
                        ))
                    }
                />
            );
        });
    };

    return (
        <>
            <Head title="Vehicles" />

            <Box className="bz-vehicles">
                {currentVehicle && !isInCreateMode && currentVehicle.id ? (
                    <VehicleSingleView
                        vehicle={currentVehicle}
                        onEdit={onEditClick}
                        deleteConfirmation={
                            <VehicleDeleteConfirmation
                                onConfirm={handleDeleteConfirm}
                                isDeleting={isDeleting}
                            />
                        }
                    />
                ) : currentVehicle || isInCreateMode ? (
                    <VehicleForm
                        setCurrentVehicle={setCurrentVehicle}
                        setIsInCreateMode={setIsInCreateMode}
                    />
                ) : (
                    <>
                        <BlockStack gap="800">
                            <Surface>
                                <Box
                                    className="bz-vehicles-list"
                                    padding="1000"
                                >
                                    <BlockStack gap="800">
                                        <InlineStack
                                            gap="300"
                                            blockAlign="center"
                                            align="space-between"
                                        >
                                            <InlineStack gap="300">
                                                <Icon
                                                    icon={IconCar}
                                                    size="600"
                                                />
                                                <Text variant="heading-m">
                                                    Автомобили
                                                </Text>
                                            </InlineStack>

                                            <Button
                                                variant="plain"
                                                onClick={onCreateClick}
                                            >
                                                <InlineStack gap="100">
                                                    <Icon
                                                        icon={IconPlus}
                                                        size="600"
                                                        color="brand-500"
                                                    />

                                                    <Text color="brand-500">
                                                        Добави автомобил
                                                    </Text>
                                                </InlineStack>
                                            </Button>
                                        </InlineStack>

                                        <BlockStack gap="400">
                                            {vehicles && vehicles.length > 0 ? (
                                                renderVehicles(vehicles)
                                            ) : (
                                                <Text variant="body-m">
                                                    Няма добавени превозни
                                                    средства
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </BlockStack>
                                </Box>
                            </Surface>
                        </BlockStack>
                    </>
                )}
            </Box>
        </>
    );
};

export default AuthenticatedLayout.wrap(Vehicles);
