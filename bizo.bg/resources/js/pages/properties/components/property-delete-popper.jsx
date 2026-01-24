/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import useDeletePropertyMutation from "@/pages/properties/data/use-delete-property-mutation";
import PropertyDeleteConfirmation from "@/pages/properties/components/property-delete-confirmation";
import useAlert from "@/components/alert/hooks/use-alert";
import { stripHash } from "@/utils/hash-utils";
import Alert from "@/components/alert/alert";
import Popper from "@/components/popper/popper";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import Box from "@/components/box/box";

const PropertyDeletePopper = (props) => {
    const { propertyId, setCurrentProperty } = props;
    const route = useRoute();
    const { mutate: deleteProperty, isPending: isDeleting } =
        useDeletePropertyMutation(propertyId);

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
        deleteProperty(
            {},
            {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Имотът беше изтрит успешно",
                        closable: true,
                        hideable: true,
                    });
                    setCurrentProperty(null);
                    router.reload({
                        data: {
                            ...route().params,
                            propertyId: null,
                        },
                        onFinish: stripHash,
                    });
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="red-500">Възникна грешка</Text>,
                        message:
                            error.response?.data?.message ||
                            "Възникна грешка при изтриването на имота.",
                        closable: true,
                        hideable: true,
                    });
                },
            },
        );
    };

    return (
        <Popper>
            <Popper.Trigger>
                <Box className="bz-properties-delete-button">
                    <Button variant="primary" disabled={isDeleting}>
                        <Text>Изтрий</Text>
                    </Button>
                </Box>
            </Popper.Trigger>
            <Popper.Content>
                <PropertyDeleteConfirmation
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                />
            </Popper.Content>
        </Popper>
    );
};

export default PropertyDeletePopper;
