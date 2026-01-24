/**
 * External dependencies
 */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import useGetPersonDetailsQuery from "../data/use-get-person-details-query";
import useGetMunicipalityQuery from "@/pages/persons/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/persons/data/use-get-town-query";
import useEditPersonMutation from "@/pages/persons/data/use-edit-person-mutation";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import Form from "@/components/form/form";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Button from "@/components/button/button";
import Icon from "@/components/icon/icon";
import IconUser from "@/components/icons/user";
import IconFloppyDisk from "@/components/icons/floppy-disk";
import IconX from "@/components/icons/x";
import IconButton from "@/components/icon-button/icon-button";
import personFormValidationSchema from "@/pages/persons/validations/person-form-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import useCreatePersonMutation from "../data/use-create-person-mutation";
import Box from "@/components/box/box";
import { ensureIndexHash } from "@/utils/hash-utils";
import IconBuilding from "@/components/icons/building";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";

const PersonForm = (props) => {
    const { person, isInCreateMode, setCurrentPerson, setIsInCreateMode } =
        props;

    const route = useRoute();
    const { personId } = route().params;

    const { showAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const [fields, setFields] = useState([]);

    const [districtId, setDistrictId] = useState(null);

    const [municipalityId, setMunicipalityId] = useState(null);

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const { mutate: editPerson, isPending: isEditingPerson } =
        useEditPersonMutation(personId);

    const { mutate: createPerson, isPending: isCreatingPerson } =
        useCreatePersonMutation();

    const {
        data: personDetails,
        invalidateQuery: invalidatePersonDetailsQuery,
    } = useGetPersonDetailsQuery(personId);

    useEffect(() => {
        if (personDetails) {
            setFields(personDetails.fields);

            // Extract districtId and municipalityId from fields to enable dependent queries
            const district = personDetails.fields.find(
                (f) => f.key === "district",
            )?.selected?.value;
            const municipality = personDetails.fields.find(
                (f) => f.key === "municipality",
            )?.selected?.value;

            if (district) setDistrictId(Number(district));
            if (municipality) setMunicipalityId(Number(municipality));
        }
    }, [personDetails]);

    const defaultValues = useMemo(() => {
        return fields.reduce((acc, field) => {
            if (field.key && field.selected) {
                // Handle different types of selected values
                if (
                    typeof field.selected === "object" &&
                    field.selected.value !== undefined
                ) {
                    // For select fields with object format
                    acc[field.key] = {
                        ...field.selected,
                        value: field.selected.value.toString(),
                    };
                } else {
                    // For text fields with string values
                    acc[field.key] = field.selected.toString();
                }
            }
            return acc;
        }, {});
    }, [fields]);

    const {
        data: municipalities,
        invalidateQuery: invalidateMunicipalityQuery,
    } = useGetMunicipalityQuery(districtId);

    const { data: towns, invalidateQuery: invalidateTownQuery } =
        useGetTownQuery(municipalityId);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
        clearErrors,
    } = useForm({
        defaultValues,
        resolver: yupResolver(personFormValidationSchema),
        mode: "onChange",
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    // Reset the form with the defaultValues when the form is being mounted
    useEffect(() => {
        if (Object.keys(defaultValues).length && !isFormInitialized) {
            reset(defaultValues);
            setIsFormInitialized(true);
        }
    }, [defaultValues]);

    const onSubmit = (data) => {
        const transformedData = {
            profile: {
                personal_identification_number_type_id:
                    data.personal_identification_number_type
                        ? parseInt(
                              data.personal_identification_number_type.value,
                              10,
                          )
                        : undefined,
                personal_identification_number:
                    data.personal_identification_number,
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone || null,
                address: {
                    district_id: parseInt(data.district?.value, 10) || null,
                    municipality_id:
                        parseInt(data.municipality?.value, 10) || null,
                    town_id: parseInt(data.town?.value, 10) || null,
                    postal_code: data.postcode || null,
                    address: data.address || null,
                },
            },
        };

        if (isInCreateMode) {
            createPerson(transformedData, {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Застрахованото лице беше създадено успешно",
                        closable: true,
                        hideable: true,
                    });
                    setIsInCreateMode(false);
                    setCurrentPerson(null);
                    // Reload and clear selected id from URL
                    router.reload({
                        data: { ...route().params, personId: null },
                        onFinish: ensureIndexHash,
                    });
                },
                onError: (error) => {
                    debugger;
                },
            });
        } else {
            editPerson(transformedData, {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Застрахованото лице беше редактирано успешно",
                        closable: true,
                        hideable: true,
                    });
                    setCurrentPerson(null);
                    // Reload and clear selected id from URL
                    router.reload({
                        data: { ...route().params, personId: null },
                        onFinish: ensureIndexHash,
                    });
                },
                onError: (error) => {
                    debugger;
                },
            });
        }
    };

    return (
        <BlockStack className="bz-persons-form" align="center" gap="800">
            <Surface>
                <Form id="edit-person-form">
                    <Box className="bz-persons-list" padding="1000">
                        <BlockStack gap="400">
                            <InlineStack
                                gap="300"
                                blockAlign="center"
                                align="space-between"
                            >
                                <InlineStack gap="300">
                                    <Icon icon={IconUser} size="600" />

                                    <Text variant="heading-s">Лични данни</Text>
                                </InlineStack>

                                <InlineStack gap="100">
                                    <Button
                                        variant="plain"
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={!isValid}
                                    >
                                        <InlineStack gap="100">
                                            <Icon
                                                size="600"
                                                icon={IconFloppyDisk}
                                                color="brand-500"
                                            />
                                            <Text color="brand-500">
                                                {personId ? "Запази" : "Създай"}
                                            </Text>
                                        </InlineStack>
                                    </Button>

                                    <IconButton
                                        variant="primary"
                                        size="600"
                                        icon={IconX}
                                        onClick={() => {
                                            setCurrentPerson(null);
                                            setIsInCreateMode(false);
                                        }}
                                        aria-label="Затвори"
                                    />
                                </InlineStack>
                            </InlineStack>

                            <BlockStack gap="800">
                                <BlockStack
                                    className="bz-persons-form-fields"
                                    gap="400"
                                >
                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderTextField(
                                            "first_name",
                                            fields,
                                            register,
                                            errors.first_name?.message,
                                        )}
                                        {RenderFormFieldsUtils.renderTextField(
                                            "last_name",
                                            fields,
                                            register,
                                            errors.last_name?.message,
                                        )}
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName:
                                                    "personal_identification_number_type",
                                                fields: fields,
                                                control,
                                                onChangeHandler: (value) => {
                                                    const personalIdType =
                                                        watch(
                                                            "personal_identification_number_type",
                                                        );

                                                    if (
                                                        personalIdType?.value !=
                                                        value?.value
                                                    ) {
                                                        setValue(
                                                            "personal_identification_number",
                                                            null,
                                                        );
                                                        clearErrors(
                                                            "personal_identification_number",
                                                        );
                                                    }
                                                },
                                                error: errors
                                                    .personal_identification_number_type
                                                    ?.message,
                                            },
                                        )}

                                        {RenderFormFieldsUtils.renderTextField(
                                            "personal_identification_number",
                                            fields,
                                            register,
                                            errors
                                                .personal_identification_number
                                                ?.message,
                                        )}
                                    </InlineStack>
                                </BlockStack>

                                <BlockStack gap="800">
                                    <InlineStack gap="300">
                                        <Icon icon={IconBuilding} size="600" />

                                        <Text variant="heading-s">
                                            Информация за адрес
                                        </Text>
                                    </InlineStack>

                                    <BlockStack
                                        gap="300"
                                        className="bz-persons-form-fields"
                                    >
                                        <InlineStack
                                            align="space-between"
                                            rowGap="300"
                                            gap="800"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "district",
                                                    onChangeHandler: (
                                                        value,
                                                    ) => {
                                                        setValue(
                                                            "municipality",
                                                            null,
                                                        );
                                                        setValue("town", null);
                                                        setValue(
                                                            "postcode",
                                                            null,
                                                        );
                                                        invalidateMunicipalityQuery();
                                                        invalidateTownQuery();
                                                        setDistrictId(
                                                            value.value,
                                                        );
                                                    },
                                                    fields,
                                                    control,
                                                    error: errors.district
                                                        ?.message,
                                                },
                                            )}

                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "municipality",
                                                    onRenderHandler: (
                                                        field,
                                                    ) => {
                                                        field.values =
                                                            municipalities?.length >
                                                            0
                                                                ? municipalities
                                                                : [];
                                                        return field;
                                                    },
                                                    onChangeHandler: (
                                                        value,
                                                    ) => {
                                                        if (
                                                            value.value !=
                                                            person?.municipality_id
                                                        ) {
                                                            // Ensure municipality value is set as string for validation
                                                            setValue(
                                                                "municipality",
                                                                {
                                                                    ...value,
                                                                    value: value.value.toString(),
                                                                },
                                                            );
                                                            setValue(
                                                                "town",
                                                                null,
                                                            );
                                                            setValue(
                                                                "postcode",
                                                                null,
                                                            );
                                                            invalidateTownQuery();
                                                            setMunicipalityId(
                                                                value.value,
                                                            );
                                                        }
                                                    },
                                                    fields,
                                                    control,
                                                    error: errors.municipality
                                                        ?.message,
                                                },
                                            )}
                                        </InlineStack>

                                        <InlineStack
                                            align="space-between"
                                            rowGap="300"
                                            gap="800"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "town",
                                                    onRenderHandler: (
                                                        field,
                                                    ) => {
                                                        field.values =
                                                            towns?.length > 0
                                                                ? towns
                                                                : [];
                                                        return field;
                                                    },
                                                    onChangeHandler: (
                                                        value,
                                                    ) => {
                                                        setValue("town", {
                                                            ...value,
                                                            value: value.value.toString(),
                                                        });
                                                        setValue(
                                                            "postcode",
                                                            value.postcode,
                                                        );
                                                    },
                                                    fields,
                                                    control,
                                                    error: errors.town?.message,
                                                },
                                            )}

                                            {RenderFormFieldsUtils.renderTextField(
                                                "postcode",
                                                fields,
                                                register,
                                                errors.postcode?.message,
                                            )}
                                        </InlineStack>

                                        <InlineStack
                                            align="space-between"
                                            rowGap="300"
                                            gap="800"
                                        >
                                            {RenderFormFieldsUtils.renderTextField(
                                                "address",
                                                fields,
                                                register,
                                                errors.address?.message,
                                            )}
                                        </InlineStack>
                                    </BlockStack>
                                </BlockStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Form>
            </Surface>
        </BlockStack>
    );
};

export default PersonForm;
