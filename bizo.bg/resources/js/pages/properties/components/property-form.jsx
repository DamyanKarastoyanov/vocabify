/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
/**
 * Internal dependencies
 */
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import IconButton from "@/components/icon-button/icon-button";
import Form from "@/components/form/form";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconProperty from "@/components/icons/property";
import IconFloppyDisk from "@/components/icons/floppy-disk";
import Button from "@/components/button/button";
import IconX from "@/components/icons/x";
import useGetMunicipalityQuery from "@/pages/properties/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/properties/data/use-get-town-query";
import useEditPropertyMutation from "@/pages/properties/data/use-edit-property-mutation";
import useGetPropertyDetailsQuery from "@/pages/properties/data/use-get-property-details-query";
import propertyFormValidationSchema from "@/pages/properties/validations/property-form-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import Text from "@/components/text/text";
import useCreatePropertyMutation from "@/pages/properties/data/use-create-property-mutation";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import { ensureIndexHash } from "@/utils/hash-utils";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";

const PropertyForm = (props) => {
    const { setCurrentProperty, setIsInCreateMode } = props;

    const route = useRoute();
    const { propertyId } = route().params;

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

    const { mutate: editProperty, isPending } =
        useEditPropertyMutation(propertyId);

    const { mutate: createProperty, isPending: isCreatingProperty } =
        useCreatePropertyMutation();

    const {
        data: propertyDetails,
        invalidateQuery: invalidatePropertyDetailsQuery,
    } = useGetPropertyDetailsQuery(propertyId);

    const {
        data: municipalities,
        invalidateQuery: invalidateMunicipalityQuery,
    } = useGetMunicipalityQuery(districtId);

    const { data: towns, invalidateQuery: invalidateTownQuery } =
        useGetTownQuery(municipalityId);

    useEffect(() => {
        if (propertyDetails) {
            setFields(propertyDetails.fields);

            // Extract districtId and municipalityId from fields to enable dependent queries
            const district = propertyDetails.fields.find(
                (f) => f.key === "district",
            )?.selected?.value;
            const municipality = propertyDetails.fields.find(
                (f) => f.key === "municipality",
            )?.selected?.value;

            if (district) setDistrictId(Number(district));
            if (municipality) setMunicipalityId(Number(municipality));
        }
    }, [propertyDetails]);

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
                } else if (field.key === "property_size") {
                    acc[field.key] = Number(field.selected);
                } else {
                    // For text fields with string values
                    acc[field.key] = field.selected.toString();
                }
            }
            return acc;
        }, {});
    }, [fields]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
    } = useForm({
        defaultValues,
        resolver: yupResolver(propertyFormValidationSchema),
        mode: "onChange",
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    // Reset the form with the defaultValues when the form is being mounted
    useEffect(() => {
        if (Object.keys(defaultValues).length) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const onSubmit = (data) => {
        // Transform the form data to match backend expectations
        const transformedData = {
            gross_floor_area_m2: parseFloat(data.property_size) || 0,
            address: {
                district_id: parseInt(data.district?.value) || null,
                municipality_id: parseInt(data.municipality?.value) || null,
                town_id: parseInt(data.town?.value) || null,
                postal_code: data.postcode || null,
                address: data.address || null,
            },
        };

        // If property has an id, it's an edit, otherwise it's a create
        if (propertyId) {
            editProperty(transformedData, {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Имотът беше редактиран успешно",
                        closable: true,
                        hideable: true,
                    });
                    // Just redirect back to list view after successful edit
                    setCurrentProperty(null);
                    setIsInCreateMode(false);
                    // Reload and clear selected id from URL
                    router.reload({
                        data: { ...route().params, propertyId: null },
                        onFinish: ensureIndexHash,
                    });
                },
                onError: (error) => {
                    debugger;
                },
            });
        } else {
            createProperty(transformedData, {
                onSuccess: () => {
                    showAlert({
                        title: <Text color="green-500">Успех</Text>,
                        message: "Имотът беше създаден успешно",
                        closable: true,
                        hideable: true,
                    });
                    setIsInCreateMode(false);
                    setCurrentProperty(null);
                    // Reload and clear selected id from URL
                    router.reload({
                        data: { ...route().params, propertyId: null },
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
        <BlockStack className="bz-properties-form" align="center" gap="800">
            <Surface>
                <Form id="edit-property-form">
                    <Box className="bz-properties-list" padding="1000">
                        <BlockStack gap="400">
                            <InlineStack
                                gap="300"
                                blockAlign="center"
                                align="space-between"
                            >
                                <InlineStack gap="300" blockAlign="center">
                                    <Icon icon={IconProperty} size="600" />

                                    <Text variant="heading-m">
                                        {propertyId ? "Имот" : "Нов имот"}
                                    </Text>
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
                                                {propertyId
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
                                            setCurrentProperty(null);
                                            setIsInCreateMode(false);
                                        }}
                                        aria-label="Затвори"
                                    />
                                </InlineStack>
                            </InlineStack>

                            <BlockStack gap="800">
                                <BlockStack
                                    className="bz-properties-form-fields"
                                    gap="400"
                                >
                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName: "district",
                                                onChangeHandler: (value) => {
                                                    setValue(
                                                        "municipality",
                                                        null,
                                                    );
                                                    setValue("town", null);
                                                    setValue("postcode", null);
                                                    //  invalidateMunicipalityQuery();
                                                    //  invalidateTownQuery();
                                                    setDistrictId(value.value);
                                                },
                                                fields,
                                                control,
                                                error: errors.district?.message,
                                            },
                                        )}

                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName: "municipality",
                                                onRenderHandler: (field) => {
                                                    if (
                                                        municipalities?.length >
                                                        0
                                                    ) {
                                                        field.values =
                                                            municipalities;
                                                    } else {
                                                        field.values = [];
                                                    }
                                                    return field;
                                                },
                                                onChangeHandler: (value) => {
                                                    // Ensure municipality value is set as string for validation
                                                    setValue("municipality", {
                                                        ...value,
                                                        value: value.value.toString(),
                                                    });
                                                    setValue("town", null);
                                                    setValue("postcode", null);
                                                    // invalidateTownQuery();
                                                    setMunicipalityId(
                                                        value.value,
                                                    );
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
                                                onRenderHandler: (field) => {
                                                    if (towns?.length > 0) {
                                                        field.values = towns;
                                                    } else {
                                                        field.values = [];
                                                    }
                                                    return field;
                                                },
                                                onChangeHandler: (value) => {
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

                                        {RenderFormFieldsUtils.renderNumberTextField(
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

                                        {RenderFormFieldsUtils.renderTextField(
                                            "property_size",
                                            fields,
                                            register,
                                            errors.property_size?.message,
                                        )}
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Form>
            </Surface>
            <InlineStack
                align={propertyId ? "end" : "space-between"}
                rowGap="300"
                gap="600"
            ></InlineStack>
        </BlockStack>
    );
};

export default PropertyForm;
