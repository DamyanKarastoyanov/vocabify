/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    useMemo,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from "react";
import { usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconDocument from "@/components/icons/document";
import CalculatePriceValidationSchema from "@/pages/mtpl-insurance/validations/calculate-price-validation-schema";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import { formatDate } from "@/utils/formatting";
import parseDate from "@/pages/mtpl-insurance/utils/parse-date";
import buildValidationSchema from "@/pages/mtpl-insurance/utils/build-validation-schema";
import getFieldError from "@/pages/mtpl-insurance/utils/get-field-error";

const CalculatePriceForm = forwardRef((props, ref) => {
    const { mtpl_insurance } = usePage().props;
    const fields = mtpl_insurance.fields || [];

    const {
        calculatePriceFormData,
        setCalculatePriceFormData,
        vehicleDataFormData,
        setLastVisitedStep,
    } = useFormDataContext();

    const { vehicleData, additionalFields } = useInsuranceDataContext();
    const { setIsCalculatePriceValid } = useValidityContext();

    // Get matched additional fields with field configurations from fields array
    const matchedAdditionalFields = useMemo(() => {
        const calculatePriceAdditionalFields =
            additionalFields?.calculatePriceAdditionalFields;
        if (
            !calculatePriceAdditionalFields ||
            typeof calculatePriceAdditionalFields !== "object"
        ) {
            return [];
        }
        const normalizeKey = (key) => key.replace(/\./g, "_");

        const excludedFields = [
            "insured.xp",
            "vehicle.engine_volume",
            "vehicle.engine_power_kw",
            "vehicle.usage",
        ];
        const filteredAdditionalFields = Object.entries(
            calculatePriceAdditionalFields,
        ).filter(([key, value]) => !excludedFields.includes(key));

        return filteredAdditionalFields.map(([originalKey, value]) => {
            const matchedField = fields.find(
                (f) => f.broqeeKey === originalKey,
            );
            let additionalFieldsSelectValues = [];
            let fieldPlaceholder = "Въведи";

            if (value.options_type === "select") {
                additionalFieldsSelectValues = value?.options || [];
                fieldPlaceholder = "Избери";
            } else if (
                value.options_type === "nomenclature" &&
                value.type === "select"
            ) {
                additionalFieldsSelectValues = matchedField?.values || [];
            }

            if (value?.type === "date") {
                fieldPlaceholder = "Избери";
            }

            const normalizedKey = normalizeKey(originalKey);

            // Extract validation from additionalFields value
            const additionalFieldsValidation =
                typeof value === "object" && value !== null && value.validation
                    ? value.validation
                    : null;

            // Merge validations, prioritizing additionalFields validation
            const validationSchema =
                additionalFieldsValidation || matchedField?.validation || null;

            // Use properties from additionalFields, with fallback to matchedField
            return {
                key: normalizedKey, // Use flat key for form handling -> "vehicle_places"
                broqeeKey: matchedField?.broqeeKey, // Keep for backend mapping -> "vehicle.places"
                label: value?.label,
                isRequired: value?.required,
                isEnabled: matchedField?.isEnabled,
                isVisible: matchedField?.isVisible,
                values: additionalFieldsSelectValues || [],
                placeholder: value?.placeholder,
                selected: null,
                validationSchema: validationSchema,
                type: value?.type,
                options_type: value?.options_type,
                data_source: value?.data_source,
            };
        });
    }, [additionalFields?.calculatePriceAdditionalFields, fields]);

    const getSelectFieldDefaultValue = (
        fieldKey,
        shouldUseFirstValue = true,
    ) => {
        const field = fields.find((f) => f.key === fieldKey);

        if (field?.selected) {
            return field.selected;
        }

        return shouldUseFirstValue ? field.values[0] : null;
    };

    const defaultValues = useMemo(() => {
        // Helper to convert string to Date or return null

        if (calculatePriceFormData) {
            const tomorrow = new Date(
                new Date().setDate(new Date().getDate() + 1),
            ).setHours(0, 0, 0, 0);

            const savedDate = calculatePriceFormData.policy_start_date
                ? new Date(calculatePriceFormData.policy_start_date)
                : null;

            const policyStartDate =
                savedDate && new Date(savedDate).setHours(0, 0, 0, 0) < tomorrow
                    ? new Date(
                          fields.find((f) => f.key === "policy_start_date")
                              ?.selected ||
                              new Date(
                                  new Date().setDate(new Date().getDate() + 1),
                              ),
                      )
                          .toISOString()
                          .split("T")[0]
                    : calculatePriceFormData.policy_start_date;

            const baseData = {
                ...calculatePriceFormData,
                policy_start_date: policyStartDate,
            };

            // Initialize additional fields if they don't exist (using flat keys)
            // Values come from fields (backend), validation comes from matchedAdditionalFields
            matchedAdditionalFields?.forEach((field) => {
                let value = baseData[field.key];

                // Parse dates (may be strings from saved context)
                if (field.type === "date") {
                    value = parseDate(value);
                }

                // Initialize missing fields with type-based defaults
                if (value === undefined || value === null) {
                    switch (field.type) {
                        case "date":
                            baseData[field.key] = field.selected
                                ? parseDate(field.selected)
                                : null;
                            break;
                        case "select":
                            if (field.values.length > 0) {
                                baseData[field.key] =
                                    field.selected || field.values[0] || null;
                            } else {
                                baseData[field.key] = null;
                            }
                            break;
                        case "number":
                            baseData[field.key] = null;
                            break;
                        default:
                            baseData[field.key] = "";
                            break;
                    }
                } else {
                    // Use parsed/existing value
                    baseData[field.key] = value;
                }
            });

            return baseData;
        }

        // Pre-fill from vehicle data if available
        if (vehicleData) {
            const baseData = {
                number: vehicleDataFormData?.number || vehicleData.number || "",
                talon: vehicleDataFormData?.talon || vehicleData.talon || "",
                model_name: vehicleData.model_name || "",
                mark_name: vehicleData.mark_name || "",
                vin: vehicleData.vin || "",
                engine_volume: vehicleData.engine_volume || "",
                engine_power_kw: vehicleData.engine_power_kw || "",
                wheel_direction: getSelectFieldDefaultValue("wheel_direction"),
                vehicle_usage: getSelectFieldDefaultValue("vehicle_usage"),
                policy_start_date: new Date(
                    new Date().setDate(new Date().getDate() + 1),
                )
                    .toISOString()
                    .split("T")[0],
                policy_installments: getSelectFieldDefaultValue(
                    "policy_installments",
                ),
            };

            // Initialize additional fields from fields array
            matchedAdditionalFields?.forEach((field) => {
                if (field.type === "date") {
                    baseData[field.key] = field.selected
                        ? parseDate(field.selected)
                        : null;
                } else if (field.type === "select" && field.values.length > 0) {
                    baseData[field.key] =
                        field.selected || field.values[0] || null;
                } else {
                    baseData[field.key] = field.type === "number" ? null : "";
                }
            });

            return baseData;
        }

        const baseData = {
            number: vehicleDataFormData?.number || "",
            talon: vehicleDataFormData?.talon || "",
            model_name: "",
            mark_name: "",
            vin: "",
            engine_volume: "",
            engine_power_kw: "",
            driver_experience: getSelectFieldDefaultValue("driver_experience"),
            wheel_direction: getSelectFieldDefaultValue("wheel_direction"),
            vehicle_usage: getSelectFieldDefaultValue("vehicle_usage"),
            policy_start_date: new Date(
                new Date().setDate(new Date().getDate() + 1),
            )
                .toISOString()
                .split("T")[0],
            policy_installments: getSelectFieldDefaultValue(
                "policy_installments",
            ),
        };

        // Initialize additional fields from fields array
        matchedAdditionalFields?.forEach((field) => {
            if (field.type === "date") {
                baseData[field.key] = field.selected
                    ? parseDate(field.selected)
                    : null;
            } else if (field.type === "select" && field.values.length > 0) {
                baseData[field.key] = field.selected || field.values[0] || null;
            } else {
                baseData[field.key] = field.type === "number" ? null : "";
            }
        });

        return baseData;
    }, [
        calculatePriceFormData,
        vehicleData,
        vehicleDataFormData,
        fields,
        matchedAdditionalFields,
    ]);

    // Build dynamic yup schema for additional fields - handle nested dot-notation keys
    const dynamicValidationSchema = useMemo(() => {
        return buildValidationSchema(
            CalculatePriceValidationSchema,
            matchedAdditionalFields,
        );
    }, [matchedAdditionalFields]);

    const {
        register,
        control,
        formState: { errors, isValid },
        watch,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(dynamicValidationSchema),
        defaultValues,
        mode: "onChange",
    });

    // Sync calculatePriceFormData values back to react-hook-form when they change externally
    // Only sync if values are actually different to avoid unnecessary updates
    useEffect(() => {
        if (matchedAdditionalFields.length > 0 && calculatePriceFormData) {
            matchedAdditionalFields.forEach((field) => {
                const formDataValue = calculatePriceFormData[field.key];
                const currentFormValue = watch(field.key);

                // Skip if value is undefined or already matches
                if (formDataValue === undefined) return;

                // Compare values properly (handle Date objects)
                let valuesEqual = false;
                if (field.type === "date") {
                    const formDate =
                        formDataValue instanceof Date
                            ? formDataValue
                            : typeof formDataValue === "string"
                              ? new Date(formDataValue)
                              : null;
                    const currentDate =
                        currentFormValue instanceof Date
                            ? currentFormValue
                            : typeof currentFormValue === "string"
                              ? new Date(currentFormValue)
                              : null;

                    if (
                        formDate &&
                        currentDate &&
                        !isNaN(formDate.getTime()) &&
                        !isNaN(currentDate.getTime())
                    ) {
                        valuesEqual =
                            formDate.getTime() === currentDate.getTime();
                    } else {
                        valuesEqual = formDataValue === currentFormValue;
                    }
                } else {
                    valuesEqual = formDataValue === currentFormValue;
                }

                // Only update if values are different
                if (!valuesEqual) {
                    const valueToSet =
                        field.type === "date" &&
                        formDataValue &&
                        typeof formDataValue === "string"
                            ? (() => {
                                  const date = new Date(formDataValue);
                                  return !isNaN(date.getTime())
                                      ? date
                                      : formDataValue;
                              })()
                            : formDataValue;

                    setValue(field.key, valueToSet, {
                        shouldValidate: false,
                        shouldDirty: false,
                    });
                }
            });
        }
    }, [calculatePriceFormData, matchedAdditionalFields, setValue, watch]);

    // Build current form data from watched fields
    const currentFormData = useMemo(() => {
        const baseData = {
            number: watch("number"),
            talon: watch("talon"),
            model_name: watch("model_name"),
            mark_name: watch("mark_name"),
            vin: watch("vin"),
            engine_volume: watch("engine_volume"),
            engine_power_kw: watch("engine_power_kw"),
            wheel_direction: watch("wheel_direction"),
            vehicle_usage: watch("vehicle_usage"),
            driver_experience: watch("driver_experience"),
            policy_start_date:
                formatDate(watch("policy_start_date"), "yyyy-MM-dd HH:mm:ss") ||
                null,
            policy_installments: watch("policy_installments"),
        };

        // Add additional fields - watch all fields from react-hook-form (using flat keys)
        // Always include these fields in context so they persist
        if (matchedAdditionalFields.length > 0) {
            matchedAdditionalFields.forEach((field) => {
                const watchedValue = watch(field.key);

                // Always include field in baseData so it gets saved to context
                if (field.type === "date") {
                    if (watchedValue instanceof Date) {
                        baseData[field.key] = formatDate(
                            watchedValue,
                            "yyyy-MM-dd",
                        );
                    } else if (watchedValue !== undefined) {
                        // Handle string dates from saved context
                        baseData[field.key] = watchedValue;
                    } else {
                        // Include null explicitly so field structure persists
                        baseData[field.key] = null;
                    }
                } else {
                    // For select, text, number fields - include value or null
                    baseData[field.key] =
                        watchedValue !== undefined ? watchedValue : null;
                }
            });
        }
        return baseData;
    }, [
        watch("number"),
        watch("talon"),
        watch("model_name"),
        watch("mark_name"),
        watch("vin"),
        watch("engine_volume"),
        watch("engine_power_kw"),
        watch("wheel_direction"),
        watch("vehicle_usage"),
        watch("driver_experience"),
        watch("policy_start_date"),
        watch("policy_installments"),
        // Watch each additional field individually
        ...matchedAdditionalFields.map((f) => watch(f.key)),
        matchedAdditionalFields,
    ]);

    // Update form data and lastVisitedStep on changes
    useEffect(() => {
        // Initialize on first load or update when form data changes
        const isFormChanged =
            !calculatePriceFormData ||
            JSON.stringify(currentFormData) !==
                JSON.stringify(calculatePriceFormData);

        if (isFormChanged) {
            setCalculatePriceFormData(currentFormData);
            setLastVisitedStep(2);
        }
    }, [
        currentFormData,
        calculatePriceFormData,
        setCalculatePriceFormData,
        setLastVisitedStep,
    ]);

    // Reactively track form validity
    useEffect(() => {
        setIsCalculatePriceValid(isValid);
    }, [isValid, setIsCalculatePriceValid]);

    // Helper function to get nested error messages for dot-notation keys
    const getFieldErrorCallback = useCallback(
        (fieldKey) => {
            return getFieldError(fieldKey, errors);
        },
        [errors],
    );

    // Render a single additional field based on its type
    const renderAdditionalField = useCallback(
        (field) => {
            if (!field) return null;

            const error = getFieldErrorCallback(field.key);

            if (field.type === "select" && field.values.length > 0) {
                return RenderFormFieldsUtils.renderSelectField({
                    fieldName: field.key,
                    fields: [field],
                    control,
                    error,
                });
            }

            if (field.type === "date") {
                return RenderFormFieldsUtils.renderDateAndTimePickerField(
                    field.key,
                    [field],
                    control,
                    error,
                    {
                        minDate: new Date().setFullYear(
                            new Date().getFullYear() - 120,
                        ),
                        maxDate: new Date(),
                        useEnhancedHeader: true,
                    },
                );
            }

            if (field.type === "number") {
                return RenderFormFieldsUtils.renderNumberTextField(
                    field.key,
                    [field],
                    register,
                    error,
                );
            }

            return RenderFormFieldsUtils.renderTextField(
                field.key,
                [field],
                register,
                error,
            );
        },
        [errors, control, setValue, register, getFieldErrorCallback],
    );

    const triggerErrors = async () => {
        const allFields = [
            "number",
            "talon",
            "model_name",
            "mark_name",
            "vin",
            "engine_volume",
            "engine_power_kw",
            "wheel_direction",
            "vehicle_usage",
            "driver_experience",
            "policy_start_date",
            "policy_installments",
        ];

        // Add additional fields to validation trigger
        const additionalFieldKeys = matchedAdditionalFields.map(
            (field) => field.key,
        );
        const fieldsToValidate = [...allFields, ...additionalFieldKeys];

        fieldsToValidate.forEach((fieldName) => {
            // Get value from formData first, then fallback to watch
            let formDataValue = calculatePriceFormData?.[fieldName];
            const watchedValue = watch(fieldName);

            // Find the field config to check its type
            const fieldConfig = matchedAdditionalFields.find(
                (f) => f.key === fieldName,
            );

            // Convert date strings to Date objects for date fields
            if (
                fieldConfig?.type === "date" &&
                formDataValue &&
                typeof formDataValue === "string"
            ) {
                const date = new Date(formDataValue);
                if (!isNaN(date.getTime())) {
                    formDataValue = date;
                }
            }

            const fieldValue =
                formDataValue !== undefined ? formDataValue : watchedValue;

            // Always set the value to ensure react-hook-form has it
            setValue(fieldName, fieldValue, {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        // Sync all formData values to react-hook-form before validation
        if (matchedAdditionalFields.length > 0 && calculatePriceFormData) {
            matchedAdditionalFields.forEach((field) => {
                let formDataValue = calculatePriceFormData[field.key];

                // Convert date strings to Date objects for date fields
                if (
                    field.type === "date" &&
                    formDataValue &&
                    typeof formDataValue === "string"
                ) {
                    const date = new Date(formDataValue);
                    if (!isNaN(date.getTime())) {
                        formDataValue = date;
                    }
                }

                if (formDataValue !== undefined) {
                    setValue(field.key, formDataValue, {
                        shouldValidate: false,
                        shouldDirty: false,
                    });
                }
            });
        }

        await trigger();
    };

    useImperativeHandle(ref, () => ({
        triggerErrors,
    }));

    return (
        <Form id="mtpl-insurance-calculate-price-form">
            <BlockStack gap="300">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconDocument} size="600" />
                                <Text variant="heading-m">
                                    Данни за полицата
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "model_name",
                                        fields,
                                        register,
                                        errors.model_name?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "mark_name",
                                        fields,
                                        register,
                                        errors.mark_name?.message,
                                    )}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "vin",
                                        fields,
                                        register,
                                        errors.vin?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "wheel_direction",
                                        fields,
                                        control,
                                        error: errors.wheel_direction?.message,
                                    })}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "engine_volume",
                                        fields,
                                        register,
                                        errors.engine_volume?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "engine_power_kw",
                                        fields,
                                        register,
                                        errors.engine_power_kw?.message,
                                    )}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                        "policy_start_date",
                                        fields,
                                        control,
                                        errors.policy_start_date?.message,
                                        {
                                            minDate: new Date(
                                                new Date().setDate(
                                                    new Date().getDate() + 1,
                                                ),
                                            ),
                                        },
                                    )}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "policy_installments",
                                        fields,
                                        control,
                                        error: errors.policy_installments
                                            ?.message,
                                    })}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "driver_experience",
                                        fields,
                                        control,
                                        onChangeHandler: (value) => {
                                            setValue(
                                                "driver_experience",
                                                value,
                                                { shouldValidate: true },
                                            );
                                        },
                                        error: errors.driver_experience
                                            ?.message,
                                    })}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "vehicle_usage",
                                        fields,
                                        control,
                                        onChangeHandler: (value) => {
                                            setValue("vehicle_usage", value, {
                                                shouldValidate: true,
                                            });
                                        },
                                        error: errors.vehicle_usage?.message,
                                    })}
                                </InlineStack>

                                {matchedAdditionalFields.length > 0 &&
                                    Array.from(
                                        {
                                            length: Math.ceil(
                                                matchedAdditionalFields.length /
                                                    2,
                                            ),
                                        },
                                        (_, i) => {
                                            const field1 =
                                                matchedAdditionalFields[i * 2];
                                            const field2 =
                                                matchedAdditionalFields[
                                                    i * 2 + 1
                                                ];

                                            return (
                                                <InlineStack
                                                    key={`additional-pair-${i}`}
                                                    gap="800"
                                                    rowGap="300"
                                                    align="space-between"
                                                >
                                                    {renderAdditionalField(
                                                        field1,
                                                    )}
                                                    {field2 ? (
                                                        renderAdditionalField(
                                                            field2,
                                                        )
                                                    ) : (
                                                        <BlockStack />
                                                    )}
                                                </InlineStack>
                                            );
                                        },
                                    )}
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
});

export default CalculatePriceForm;
