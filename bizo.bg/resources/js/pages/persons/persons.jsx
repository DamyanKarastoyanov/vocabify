/**
 * External dependencies
 */
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useRoute } from "ziggy-js";
/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import PersonForm from "./components/person-form";
import PersonSingleView from "./components/person-single-view";
import useDeletePersonMutation from "@/pages/persons/data/use-delete-person-mutation";
import PersonDeleteConfirmation from "@/pages/persons/components/person-delete-confirmation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import EntityCard from "@/components/entity-card/entity-card";
import Button from "@/components/button/button";
import IconUser from "@/components/icons/user";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import IconPlus from "@/components/icons/plus";
import Surface from "@/components/surface/surface";
import InlineStack from "@/components/inline-stack/inline-stack";
import IconUsers from "@/components/icons/users";
import Icon from "@/components/icon/icon";
import { stripHash, ensureIndexHash } from "@/utils/hash-utils";

const Persons = () => {
    const { persons: data } = usePage().props;
    const personList = data.persons;

    const route = useRoute();
    const { personId } = route().params;

    const [currentPerson, setCurrentPerson] = useState(null);
    const [isInCreateMode, setIsInCreateMode] = useState(false);

    useEffect(() => {
        if (!personId) {
            ensureIndexHash();
        }
    }, []);

    useEffect(() => {
        if (isInCreateMode) {
            setCurrentPerson({});
            return;
        }

        if (personId) {
            const found = personList.find(
                (p) => String(p.id) === String(personId),
            );
            setCurrentPerson(found || null);
        } else {
            // Do not clear when in create mode
            if (!isInCreateMode) {
                setCurrentPerson(null);
            }
        }
    }, [isInCreateMode, personId, personList]);

    const onClickHandler = (id) => {
        if (isInCreateMode) setIsInCreateMode(false);
        router.reload({
            data: {
                ...route().params,
                personId: id,
            },
            onFinish: stripHash,
        });
        window.scrollTo(0, 0);
    };

    const onCreateClick = () => {
        setIsInCreateMode(true);
    };

    const onEditClick = () => {
        // Set to true to show the form
        // The form will detect person.id exists and use edit mode
        setIsInCreateMode(true);
    };

    const { mutate: deletePerson, isPending: isDeleting } =
        useDeletePersonMutation(currentPerson?.id);

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
        <>
            <Head title="Persons" />

            <Box className="bz-persons">
                {currentPerson && !isInCreateMode && currentPerson.id ? (
                    <PersonSingleView
                        person={currentPerson}
                        onEdit={onEditClick}
                        deleteConfirmation={
                            <PersonDeleteConfirmation
                                onConfirm={handleDeleteConfirm}
                                isDeleting={isDeleting}
                            />
                        }
                    />
                ) : currentPerson || isInCreateMode ? (
                    <PersonForm
                        person={currentPerson}
                        setIsInCreateMode={setIsInCreateMode}
                        isInCreateMode={isInCreateMode}
                        setCurrentPerson={setCurrentPerson}
                    />
                ) : (
                    <>
                        <BlockStack gap="800">
                            <Surface>
                                <Box className="bz-persons-list" padding="1000">
                                    <BlockStack gap="800">
                                        <InlineStack
                                            gap="300"
                                            blockAlign="center"
                                            align="space-between"
                                        >
                                            <InlineStack gap="300">
                                                <Icon
                                                    icon={IconUsers}
                                                    size="600"
                                                />
                                                <Text variant="heading-m">
                                                    Застраховани лица
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
                                                        Добави лице
                                                    </Text>
                                                </InlineStack>
                                            </Button>
                                        </InlineStack>

                                        <BlockStack gap="400">
                                            {personList.length > 0 ? (
                                                personList.map((person) => (
                                                    <EntityCard
                                                        key={person.id}
                                                        id={person.id}
                                                        icon={IconUser}
                                                        clickHandler={
                                                            onClickHandler
                                                        }
                                                        headerInfo={`${person.first_name} ${person.last_name}`}
                                                        actionInfo={`<InlineStack gap="100"><Text color="text-secondary">${person.personal_identification_number_type_name}:</Text> <Text>${person.personal_identification_number}</Text></InlineStack>`}
                                                        detailsInfo={
                                                            <Text color="text-secondary">
                                                                {person.address}
                                                            </Text>
                                                        }
                                                    />
                                                ))
                                            ) : (
                                                <Text variant="body-m">
                                                    Няма добавени лица
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

export default AuthenticatedLayout.wrap(Persons);
