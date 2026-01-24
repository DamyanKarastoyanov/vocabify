/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import useDeletePersonMutation from "@/pages/persons/data/use-delete-person-mutation";
import PersonDeleteConfirmation from "@/pages/persons/components/person-delete-confirmation";
import useAlert from "@/components/alert/hooks/use-alert";
import { stripHash } from "@/utils/hash-utils";
import Alert from "@/components/alert/alert";
import Popper from "@/components/popper/popper";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import Box from "@/components/box/box";

const PersonDeletePopper = (props) => {
    const { personId, setCurrentPerson } = props;
    const route = useRoute();
    const { mutate: deletePerson, isPending: isDeleting } =
        useDeletePersonMutation(personId);

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
        deletePerson(
            {},
            {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Застрахованото лице беше изтрито успешно",
                        closable: true,
                        hideable: true,
                    });
                    setCurrentPerson(null);
                    router.reload({
                        data: {
                            ...route().params,
                            personId: null,
                        },
                        onFinish: stripHash,
                    });
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="red-500">Възникна грешка</Text>,
                        message:
                            error.response?.data?.message ||
                            "Възникна грешка при изтриването на застрахованото лице.",
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
                <Box className="bz-persons-delete-button">
                    <Button variant="primary" disabled={isDeleting}>
                        <Text>Изтрий</Text>
                    </Button>
                </Box>
            </Popper.Trigger>
            <Popper.Content>
                <PersonDeleteConfirmation
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                />
            </Popper.Content>
        </Popper>
    );
};

export default PersonDeletePopper;
