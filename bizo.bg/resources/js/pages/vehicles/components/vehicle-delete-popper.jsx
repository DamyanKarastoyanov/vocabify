/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import useDeleteVehicleMutation from "@/pages/vehicles/data/use-delete-vehicle-mutation";
import VehicleDeleteConfirmation from "@/pages/vehicles/components/vehicle-delete-confirmation";
import useAlert from "@/components/alert/hooks/use-alert";
import { stripHash } from "@/utils/hash-utils";
import Alert from "@/components/alert/alert";
import Popper from "@/components/popper/popper";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import Box from "@/components/box/box";

const VehicleDeletePopper = (props) => {
    const { vehicleId } = props;
    const route = useRoute();
    const { mutate: deleteVehicle, isPending: isDeleting } =
        useDeleteVehicleMutation(vehicleId);

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
                    router.reload({
                        data: {
                            ...route().params,
                            vehicleId: null,
                            mode: null,
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

    return (
        <Popper>
            <Popper.Trigger asChild>
                <Box className="bz-vehicles-delete-button">
                    <Button variant="primary" disabled={isDeleting}>
                        <Text>Изтрий</Text>
                    </Button>
                </Box>
            </Popper.Trigger>
            <Popper.Content>
                <VehicleDeleteConfirmation
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                />
            </Popper.Content>
        </Popper>
    );
};

export default VehicleDeletePopper;
