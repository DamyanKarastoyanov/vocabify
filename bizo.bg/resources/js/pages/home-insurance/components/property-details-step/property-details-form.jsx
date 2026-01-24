/**
 * External dependencies
 */
import {
    useState,
    useEffect,
    useMemo,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import useGetMunicipalityQuery from "@/pages/home-insurance/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/home-insurance/data/use-get-town-query";
import IconProperty from "@/components/icons/property";
import Icon from "@/components/icon/icon";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import propertyDetailsStepValidationSchema from "@/pages/home-insurance/validations/property-details-step-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const propertySizeDefaultValue = 80;

const PropertyDetailsForm = forwardRef((props, ref) => {
    const { home_insurance } = usePage().props;

    const {
        calculatePriceFormData,
        setPropertyDetailsFormData,
        propertyDetailsFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setIsPropertyDetailsValid } = useValidityContext();

    const [manuallyLocationChanged, setManuallyLocationChanged] =
        useState(false);

    const fields = home_insurance.fields || [];
    const isPropertyVisible = fields.find(
        (f) => f.key === "property",
    )?.isVisible;
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    // Initialize state with values from context if available
    const [districtId, setDistrictId] = useState(() => {
        if (propertyDetailsFormData?.property?.district_id) {
            const parsedId = parseInt(
                propertyDetailsFormData.property.district_id,
            );
            return parsedId;
        }
        return (
            home_insurance.fields.find((f) => f.key === "district")?.selected
                ?.value || null
        );
    });

    const [municipalityId, setMunicipalityId] = useState(
        propertyDetailsFormData?.property?.municipality_id
            ? parseInt(propertyDetailsFormData.property.municipality_id)
            : null,
    );

    const { toggleFieldEnabled } = useFieldControls(fields);

    const {
        register,
        formState: { errors, isValid },
        reset,
        control,
        setValue,
        watch,
        trigger,
        getValues,
    } = useForm({
        resolver: yupResolver(propertyDetailsStepValidationSchema),
        mode: "onChange",
        defaultValues: useMemo(() => {
            setManuallyLocationChanged(false);
            if (propertyDetailsFormData?.property) {
                const { post_code, address, property_size } =
                    propertyDetailsFormData.property;
                const districtOption = fields
                    .find((f) => f.key === "district")
                    ?.values?.find(
                        (v) =>
                            v.value ===
                            parseInt(
                                propertyDetailsFormData.property.district_id,
                            ),
                    );
                const propertyOption = fields
                    .find((f) => f.key === "property")
                    ?.values?.find(
                        (v) =>
                            v.value ===
                            parseInt(
                                propertyDetailsFormData.property.property_id,
                            ),
                    );
                return {
                    property: propertyOption
                        ? {
                              ...propertyOption,
                              value: propertyOption.value.toString(),
                          }
                        : undefined,
                    district: districtOption
                        ? {
                              ...districtOption,
                              value: districtOption.value.toString(),
                          }
                        : undefined,
                    postcode: post_code,
                    property_address: address,
                    property_size: Math.round(
                        parseFloat(property_size) || 0,
                    ).toString(),
                };
            }

            return {
                ...fields.reduce((acc, field) => {
                    if (field.key && field.values && field.values.length > 0) {
                        const selected = field.selected;
                        acc[field.key] = selected
                            ? {
                                  ...selected,
                                  value: selected.value.toString(),
                              }
                            : undefined;
                    }
                    return acc;
                }, {}),
                property_size: propertySizeDefaultValue.toString(),
                property: fields.find((f) => f.key === "property")?.values?.[0],
            };
        }, [fields, propertyDetailsFormData]),
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    const triggerErrors = useCallback(async () => {
        const requiredFields = [
            "property",
            "district",
            "municipality",
            "town",
            "postcode",
            "property_address",
            "property_size",
        ];
        requiredFields.forEach((fieldName) => {
            const currentValue = getValues(fieldName);
            setValue(fieldName, currentValue ?? null, {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        await trigger(requiredFields);
    }, [trigger, getValues, setValue]);

    useImperativeHandle(ref, () => ({ triggerErrors }));

    const {
        data: municipalities,
        invalidateQuery: invalidateMunicipalityQuery,
    } = useGetMunicipalityQuery(districtId);

    const { data: towns, invalidateQuery: invalidateTownQuery } =
        useGetTownQuery(municipalityId);

    // Set municipality options once they're loaded
    useEffect(() => {
        const municipalityId =
            watch("property")?.municipality_id ||
            propertyDetailsFormData?.property?.municipality_id;

        if (municipalities?.length === 1) {
            setValue("municipality", municipalities[0], {
                shouldValidate: true,
            });
            setMunicipalityId(municipalities[0].value);
            toggleFieldEnabled("town", true);
        }

        if (manuallyLocationChanged) {
            return;
        }

        if (municipalities?.length > 0 && municipalityId) {
            const savedMunicipality = municipalities.find(
                (m) => m.value === parseInt(municipalityId),
            );
            if (savedMunicipality) {
                setValue(
                    "municipality",
                    {
                        ...savedMunicipality,
                        value: savedMunicipality.value.toString(),
                    },
                    {
                        shouldValidate: true,
                    },
                );
            }
        }
    }, [municipalities, propertyDetailsFormData, manuallyLocationChanged]);

    // Set town options once they're loaded
    useEffect(() => {
        if (manuallyLocationChanged) {
            return;
        }

        const townId =
            watch("property")?.town_id ||
            propertyDetailsFormData?.property?.town_id;
        if (towns?.length > 0 && townId) {
            const savedTown = towns.find((t) => t.value === parseInt(townId));
            if (savedTown) {
                setValue(
                    "town",
                    {
                        ...savedTown,
                        value: savedTown.value.toString(),
                    },
                    { shouldValidate: true },
                );
            }
        }
    }, [towns, propertyDetailsFormData, manuallyLocationChanged]);

    // Trigger municipality fetch when district is set from context
    useEffect(() => {
        if (districtId) {
            invalidateMunicipalityQuery();
        }
    }, [districtId]);

    // Trigger town fetch when municipality is set from context
    useEffect(() => {
        if (municipalityId) {
            invalidateTownQuery();
        }
    }, [municipalityId]);

    // Handle initial property auto-selection when profile has properties
    useEffect(() => {
        const propertyField = fields.find((f) => f.key === "property");
        if (
            propertyField &&
            propertyField.values &&
            propertyField.values.length > 0 &&
            !propertyDetailsFormData
        ) {
            const firstOption = propertyField.values[0];
            if (firstOption?.value !== 0) {
                setValue("property", firstOption);

                const currentDistrict = fields
                    .find((f) => f.key === "district")
                    ?.values?.find((v) => v.value === firstOption.district_id);
                setValue("district", currentDistrict);
                setDistrictId(firstOption.district_id);

                const currentMunicipality = fields
                    .find((f) => f.key === "municipality")
                    ?.values?.find(
                        (v) => v.value === firstOption.municipality_id,
                    );
                setValue("municipality", currentMunicipality);
                setMunicipalityId(firstOption.municipality_id);

                const currentTown = fields
                    .find((f) => f.key === "town")
                    ?.values?.find((v) => v.value === firstOption.town_id);
                setValue("town", currentTown);

                setValue("postcode", firstOption.postal_code);
                setValue("property_address", firstOption.address);
                setValue(
                    "property_size",
                    Math.round(
                        parseFloat(firstOption.gross_floor_area) || 0,
                    ).toString(),
                );
            }

            if (firstOption?.value === 0) {
                setValue("property", firstOption);

                const currentDistrict = fields.find(
                    (f) => f.key === "district",
                )?.selected;
                setValue("district", currentDistrict);
                setDistrictId(currentDistrict?.value);

                const currentMunicipality = fields.find(
                    (f) => f.key === "municipality",
                )?.selected;
                setValue("municipality", currentMunicipality);
                setMunicipalityId(currentMunicipality?.value);

                setValue("town", null);

                setValue("postcode", null);
                setValue("property_address", null);
                setValue(
                    "property_size",
                    Math.round(
                        parseFloat(firstOption.gross_floor_area) || 0,
                    ).toString(),
                );
            }
        }
    }, [fields, setValue, propertyDetailsFormData]);

    const formData = useMemo(() => {
        if (!calculatePriceFormData) return null;

        const property = watch("property");
        const district = watch("district");
        const municipality = watch("municipality");
        const town = watch("town");
        const postcode = watch("postcode");
        const propertyAddress = watch("property_address");
        const propertySize = watch("property_size");

        return {
            property: {
                property_id: property?.value?.toString() || null,
                municipality_id: municipality?.value?.toString() || null,
                district_id: district?.value?.toString() || null,
                town_id: town?.value?.toString() || null,
                post_code: postcode?.toString() || null,
                address: propertyAddress || null,
                property_size: propertySize?.toString() || null,
            },
        };
    }, [
        watch("district"),
        watch("municipality"),
        watch("town"),
        watch("postcode"),
        watch("property_address"),
        watch("property_size"),
        watch("property"),
    ]);

    useEffect(() => {
        if (
            !propertyDetailsFormData ||
            (propertyDetailsFormData &&
                JSON.stringify(formData) ==
                    JSON.stringify(propertyDetailsFormData))
        ) {
            setIsFormInitialized(true);
        }

        const isFormChanged =
            JSON.stringify(formData) !==
            JSON.stringify(propertyDetailsFormData);

        if (isFormInitialized && isFormChanged) {
            setPropertyDetailsFormData(formData);
            setLastVisitedStep(2);
        }
    }, [formData]);

    useEffect(() => {
        setIsPropertyDetailsValid(isValid);
    }, [isValid]);

    return (
        <Form id="property-details-form">
            <BlockStack gap="800">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconProperty} size="600" />
                                <Text variant="heading-m">
                                    Информация за имота
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                {isPropertyVisible &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "property",
                                        onChangeHandler: (value) => {
                                            if (value.value === 0) {
                                                setValue("property", null);
                                                const defaultDistrict =
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "district",
                                                    )?.selected;
                                                setValue(
                                                    "district",
                                                    defaultDistrict || null,
                                                );
                                                setDistrictId(
                                                    defaultDistrict?.value,
                                                );
                                                setValue("municipality", null);
                                                setMunicipalityId(null);
                                                setValue("town", null);
                                                setValue("postcode", null);
                                                setValue(
                                                    "property_address",
                                                    null,
                                                );
                                                setValue("property_size", null);
                                                toggleFieldEnabled(
                                                    "town",
                                                    true,
                                                );
                                            } else {
                                                setValue("property", value);
                                                const districtOption = fields
                                                    .find(
                                                        (f) =>
                                                            f.key ===
                                                            "district",
                                                    )
                                                    ?.values?.find(
                                                        (v) =>
                                                            v.value ===
                                                            value.district_id,
                                                    );
                                                if (districtOption) {
                                                    setValue("district", {
                                                        ...districtOption,
                                                        value: districtOption.value.toString(),
                                                    });
                                                }
                                                setValue(
                                                    "postcode",
                                                    value.postal_code,
                                                );
                                                setValue(
                                                    "property_address",
                                                    value.address,
                                                );
                                                setValue(
                                                    "property_size",
                                                    Math.round(
                                                        parseFloat(
                                                            value.gross_floor_area,
                                                        ) || 0,
                                                    ).toString(),
                                                );
                                                setDistrictId(
                                                    value.district_id,
                                                );
                                                setMunicipalityId(
                                                    value.municipality_id,
                                                );
                                                toggleFieldEnabled(
                                                    "town",
                                                    true,
                                                );
                                            }
                                            setManuallyLocationChanged(false);
                                        },
                                        fields,
                                        control,
                                        error: errors.property?.message,
                                    })}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "district",
                                        onChangeHandler: (value) => {
                                            // Ensure district value is set as string for validation
                                            setValue("district", {
                                                ...value,
                                                value: value.value.toString(),
                                            });
                                            setValue("town", null);
                                            setValue("postcode", null);
                                            setDistrictId(value.value);
                                            setValue("municipality", null);

                                            setMunicipalityId(null);
                                            toggleFieldEnabled("town", false);
                                            setManuallyLocationChanged(true);
                                        },
                                        fields,
                                        control,
                                        error: errors.district?.message,
                                    })}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "municipality",
                                        onRenderHandler: (field) => {
                                            if (municipalities?.length > 0) {
                                                field.values = municipalities;
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
                                            toggleFieldEnabled("town", true);
                                            setValue("postcode", null);
                                            setMunicipalityId(value.value);
                                            setManuallyLocationChanged(true);
                                        },
                                        fields,
                                        control,
                                        error: errors.municipality?.message,
                                    })}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
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
                                            // Ensure town value is set as string for validation
                                            setValue("town", {
                                                ...value,
                                                value: value.value.toString(),
                                            });
                                            setValue(
                                                "postcode",
                                                value.postcode,
                                                {
                                                    shouldValidate: true,
                                                },
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields,
                                        control,
                                        error: errors.town?.message,
                                    })}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "postcode",
                                        fields,
                                        register,
                                        errors.postcode?.message,
                                    )}
                                </InlineStack>

                                {RenderFormFieldsUtils.renderTextField(
                                    "property_address",
                                    fields,
                                    register,
                                    errors.property_address?.message,
                                )}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "property_size",
                                        fields,
                                        register,
                                        errors.property_size?.message,
                                    )}

                                    <BlockStack className="bz-input-field-holder"></BlockStack>
                                </InlineStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
});

export default PropertyDetailsForm;
