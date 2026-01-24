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
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import Text from "@/components/text/text";
import PropertyForm from "@/pages/properties/components/property-form";
import PropertySingleView from "@/pages/properties/components/property-single-view";
import useDeletePropertyMutation from "@/pages/properties/data/use-delete-property-mutation";
import PropertyDeleteConfirmation from "@/pages/properties/components/property-delete-confirmation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Button from "@/components/button/button";
import EntityCard from "@/components/entity-card/entity-card";
import IconProperty from "@/components/icons/property";
import IconPlus from "@/components/icons/plus";
import Box from "@/components/box/box";
import Surface from "@/components/surface/surface";
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import { ensureIndexHash } from "@/utils/hash-utils";

const Properties = () => {
    const {
        properties: { properties },
    } = usePage().props;

    const route = useRoute();
    const { propertyId } = route().params;

    const [currentProperty, setCurrentProperty] = useState(null);
    const [isInCreateMode, setIsInCreateMode] = useState(false);

    useEffect(() => {
        if (!propertyId) {
            ensureIndexHash();
        }
    }, []);

    useEffect(() => {
        if (isInCreateMode) {
            setCurrentProperty({});
            return;
        }

        if (propertyId) {
            const found = properties.find(
                (p) => String(p.id) === String(propertyId),
            );
            setCurrentProperty(found || null);
        } else {
            // Do not clear when in create mode
            if (!isInCreateMode) {
                setCurrentProperty(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyId, properties, isInCreateMode]);

    const onClickHandler = (id) => {
        if (isInCreateMode) setIsInCreateMode(false);
        router.reload({
            data: {
                ...route().params,
                propertyId: id,
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
        // The form will detect property.id exists and use edit mode
        setIsInCreateMode(true);
    };

    const { mutate: deleteProperty, isPending: isDeleting } =
        useDeletePropertyMutation(currentProperty?.id);

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
        <>
            <Head title="Properties" />

            <Box className="bz-properties">
                {currentProperty && !isInCreateMode && currentProperty.id ? (
                    <PropertySingleView
                        property={currentProperty}
                        onEdit={onEditClick}
                        deleteConfirmation={
                            <PropertyDeleteConfirmation
                                onConfirm={handleDeleteConfirm}
                                isDeleting={isDeleting}
                            />
                        }
                    />
                ) : currentProperty || isInCreateMode ? (
                    <PropertyForm
                        setCurrentProperty={setCurrentProperty}
                        setIsInCreateMode={setIsInCreateMode}
                    />
                ) : (
                    <>
                        <BlockStack gap="800">
                            <Surface>
                                <Box
                                    className="bz-properties-list"
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
                                                    icon={IconProperty}
                                                    size="600"
                                                />
                                                <Text variant="heading-m">
                                                    Имоти
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
                                                        Добави имот
                                                    </Text>
                                                </InlineStack>
                                            </Button>
                                        </InlineStack>

                                        <BlockStack gap="400">
                                            {properties.length > 0 ? (
                                                properties.map((property) => {
                                                    const [
                                                        address,
                                                        town,
                                                        municipality,
                                                        district,
                                                        postalCode,
                                                    ] =
                                                        property.address?.split(
                                                            ", ",
                                                        ) ?? [];
                                                    return (
                                                        <EntityCard
                                                            key={property.id}
                                                            id={property.id}
                                                            icon={IconProperty}
                                                            clickHandler={
                                                                onClickHandler
                                                            }
                                                            headerInfo={`${address}, ${town}, ${postalCode}`}
                                                            actionInfo={`${property.gross_floor_area} кв.м`}
                                                            detailsInfo={
                                                                <Text
                                                                    variant="body-s"
                                                                    color="text-secondary"
                                                                >
                                                                    {
                                                                        municipality
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        district
                                                                    }{" "}
                                                                </Text>
                                                            }
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <Text variant="body-m">
                                                    Няма добавени имоти
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

export default AuthenticatedLayout.wrap(Properties);
