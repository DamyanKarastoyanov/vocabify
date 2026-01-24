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
    useState,
    useCallback,
    useRef,
} from "react";
import { usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Form from "@/components/form/form";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import IconUser from "@/components/icons/user";
import Icon from "@/components/icon/icon";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Text from "@/components/text/text";
import InsuredPersonValidationSchema from "@/pages/mtpl-insurance/validations/insured-person-validation-schema";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { formatDate } from "@/utils/formatting";
import parseDate from "@/pages/mtpl-insurance/utils/parse-date";
import buildValidationSchema from "@/pages/mtpl-insurance/utils/build-validation-schema";
import getFieldError from "@/pages/mtpl-insurance/utils/get-field-error";

const InsuredPersonForm = forwardRef((props, ref) => {
    const { mtpl_insurance } = usePage().props;
    const fields = mtpl_insurance.fields || [];

    const {
        insuredPersonFormData,
        setInsuredPersonFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setIsInsuredPersonValid } = useValidityContext();
    const { additionalFields } = useInsuranceDataContext();

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    // Get matched additional fields with field configurations from fields array
    const matchedAdditionalFields = useMemo(() => {
        const insuredAdditionalFields =
            additionalFields?.insuredAdditionalFields;
        if (
            !insuredAdditionalFields ||
            typeof insuredAdditionalFields !== "object"
        ) {
            return [];
        }
        const normalizeKey = (key) => key.replace(/\.|\|/g, "_");

        const filteredAdditionalFields = Object.entries(
            insuredAdditionalFields,
        ).filter(([key, value]) => {
            // Exclude fields that are already handled in the main form
            const excludedFields = [];
            return !excludedFields.includes(key);
        });

        return filteredAdditionalFields.map(([originalKey, value]) => {
            const matchedField = fields.find(
                (f) => f.broqeeKey === originalKey,
            );
            let additionalFieldsSelectValues = [];
            let fieldPlaceholder = "Въведи";

            if (value.options_type === "select") {
                additionalFieldsSelectValues = value?.options || [];
                fieldPlaceholder = "Избери";
            }

            if (value.type === "date") {
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
                key: normalizedKey, // Use flat key for form handling
                originalKey, // Keep original for reference
                broqeeKey: matchedField?.broqeeKey || originalKey, // Keep for backend mapping
                label: value?.label || matchedField?.label,
                isRequired:
                    value?.required !== undefined
                        ? value.required
                        : (matchedField?.isRequired ?? true),
                isEnabled: matchedField?.isEnabled !== false,
                isVisible: matchedField?.isVisible !== false,
                values:
                    additionalFieldsSelectValues || matchedField?.values || [],
                placeholder: fieldPlaceholder,
                selected: null,
                validationSchema: validationSchema,
                type: value?.type,
                options_type: value?.options_type,
                data_source: value?.data_source,
            };
        });
    }, [additionalFields?.insuredAdditionalFields, fields]);

    const getSelectFieldDefaultValue = (
        fieldKey,
        shouldUseFirstValue = true,
    ) => {
        const field = fields.find((f) => f.key === fieldKey);

        if (field?.selected) {
            return field.selected;
        }

        return shouldUseFirstValue ? field?.values?.[0] : null;
    };

    const defaultValues = useMemo(() => {
        if (insuredPersonFormData) {
            const baseData = { ...insuredPersonFormData };

            matchedAdditionalFields?.forEach((field) => {
                let value = baseData[field.key];

                if (field.type === "date") {
                    value = parseDate(value);
                }

                if (value === undefined || value === null) {
                    switch (field.type) {
                        case "select":
                            baseData[field.key] = null;
                            break;
                        case "date": {
                            baseData[field.key] = null;
                            break;
                        }
                        case "number":
                            baseData[field.key] = null;
                            break;
                        default:
                            baseData[field.key] = "";
                            break;
                    }
                } else {
                    baseData[field.key] = value;
                }
            });

            return baseData;
        }

        const profileField = fields.find((f) => f.key === "profile");
        const firstProfileOption = profileField?.values?.[0];

        let baseData;

        // If first profile option exists and is valid (value !== 0), populate from it
        if (
            firstProfileOption &&
            firstProfileOption.value !== 0 &&
            firstProfileOption.value !== undefined
        ) {
            baseData = {
                profile: profileField.values.find(
                    (v) => v.value === firstProfileOption.value,
                ),
                first_name: firstProfileOption.first_name || "",
                last_name: firstProfileOption.last_name || "",
                insured_phone: firstProfileOption.insured_phone || "",
                insured_email: firstProfileOption.insured_email || "",
            };
        } else {
            // Default: use field.selected or first value
            baseData = {
                profile: getSelectFieldDefaultValue("profile"),
                first_name:
                    fields.find((f) => f.key === "first_name")?.selected || "",
                last_name:
                    fields.find((f) => f.key === "last_name")?.selected || "",
                insured_phone:
                    fields.find((f) => f.key === "insured_phone")?.selected ||
                    "",
                insured_email:
                    fields.find((f) => f.key === "insured_email")?.selected ||
                    "",
            };
        }

        // Add default values for additional fields
        matchedAdditionalFields.forEach((field) => {
            if (baseData[field.key] === undefined) {
                if (field.type === "select" && field.values.length > 0) {
                    baseData[field.key] = field.selected || null;
                } else if (field.type === "date") {
                    const validation = field.validationSchema || {};
                    if (validation.after_or_equal) {
                        const defaultDate = new Date(validation.after_or_equal);
                        if (!isNaN(defaultDate.getTime())) {
                            baseData[field.key] = defaultDate;
                        } else {
                            baseData[field.key] = null;
                        }
                    } else {
                        baseData[field.key] = null;
                    }
                } else if (field.type === "number") {
                    baseData[field.key] = null;
                } else {
                    baseData[field.key] = "";
                }
            }
        });

        return baseData;
    }, [insuredPersonFormData, fields, matchedAdditionalFields]);

    // Build dynamic yup schema for additional fields
    const dynamicValidationSchema = useMemo(() => {
        return buildValidationSchema(
            InsuredPersonValidationSchema,
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

    // Watch all form values to avoid dynamic dependency arrays
    const allFormValues = watch();

    // Build current form data from watched fields
    const currentFormData = useMemo(() => {
        const firstName = allFormValues.first_name || "";
        const lastName = allFormValues.last_name || "";

        const baseData = {
            profile:
                allFormValues.profile !== undefined
                    ? allFormValues.profile
                    : null,
            first_name: firstName,
            last_name: lastName,
            insured_names: `${firstName || ""} ${lastName || ""}`.trim(),
            insured_phone: allFormValues.insured_phone,
            insured_email: allFormValues.insured_email,
        };

        // Add additional fields to form data
        // Always include these fields in context so they persist
        matchedAdditionalFields.forEach((field) => {
            const watchedValue = allFormValues[field.key];

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

        return baseData;
    }, [allFormValues, matchedAdditionalFields, insuredPersonFormData]);

    // Track form initialization
    useEffect(() => {
        if (
            !insuredPersonFormData ||
            (insuredPersonFormData &&
                JSON.stringify(currentFormData) ===
                    JSON.stringify(insuredPersonFormData))
        ) {
            setIsFormInitialized(true);
        }
    }, [insuredPersonFormData, currentFormData]);

    // Update form data and lastVisitedStep on changes
    useEffect(() => {
        const isFormChanged =
            JSON.stringify(currentFormData) !==
            JSON.stringify(insuredPersonFormData);

        if (isFormInitialized && isFormChanged) {
            setInsuredPersonFormData(currentFormData);
            setLastVisitedStep(4);
        }
    }, [
        currentFormData,
        insuredPersonFormData,
        isFormInitialized,
        setInsuredPersonFormData,
        setLastVisitedStep,
    ]);

    // Reactively track form validity
    useEffect(() => {
        setIsInsuredPersonValid(isValid);
    }, [isValid, setIsInsuredPersonValid]);

    // Helper function to get nested error messages
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
                const validation = field.validationSchema || {};
                const datePickerOptions = {
                    useEnhancedHeader: !validation ? true : false,
                };

                // Set minDate from after_or_equal if available
                if (validation.after_or_equal) {
                    const minDate = new Date(validation.after_or_equal);
                    if (!isNaN(minDate.getTime())) {
                        datePickerOptions.minDate = minDate;
                    }
                } else {
                    // Default to 120 years ago if no min date specified
                    datePickerOptions.minDate = new Date().setFullYear(
                        new Date().getFullYear() - 120,
                    );
                }

                // Set maxDate from before_or_equal if available
                if (validation.before_or_equal) {
                    const maxDate = new Date(validation.before_or_equal);
                    if (!isNaN(maxDate.getTime())) {
                        // Set to end of day for inclusive comparison
                        maxDate.setHours(23, 59, 59, 999);
                        datePickerOptions.maxDate = maxDate;
                    }
                } else {
                    // Default to today if no max date specified
                    datePickerOptions.maxDate = new Date();
                }

                return RenderFormFieldsUtils.renderDateAndTimePickerField(
                    field.key,
                    [field],
                    control,
                    error,
                    datePickerOptions,
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

    // Trigger validation errors on all fields explicitly
    const triggerErrors = async () => {
        const allFields = [
            "first_name",
            "last_name",
            "insured_email",
            "insured_phone",
            ...matchedAdditionalFields.map((field) => field.key),
        ];

        allFields.forEach((fieldName) => {
            setValue(fieldName, watch(fieldName), {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        await trigger();
    };

    useImperativeHandle(ref, () => ({
        triggerErrors,
    }));

    return (
        <Form id="insured-person-form">
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="800">
                        <InlineStack gap="400" blockAlign="center">
                            <Icon icon={IconUser} size="600" />
                            <Text variant="heading-m">
                                Данни на застрахованото лице
                            </Text>
                        </InlineStack>

                        <BlockStack gap="400">
                            {fields.find((f) => f.key === "profile")
                                ?.isVisible &&
                                RenderFormFieldsUtils.renderSelectField({
                                    fieldName: "profile",
                                    onChangeHandler: (value) => {
                                        if (value.value === 0) {
                                            // Clear form for new profile
                                            setValue("first_name", "");
                                            setValue("last_name", "");
                                            setValue("insured_phone", "");
                                            setValue("insured_email", "");
                                        } else {
                                            // Populate form with selected profile data
                                            setValue(
                                                "first_name",
                                                value.first_name || "",
                                            );
                                            setValue(
                                                "last_name",
                                                value.last_name || "",
                                            );
                                            setValue(
                                                "insured_phone",
                                                value.insured_phone || "",
                                            );
                                            setValue(
                                                "insured_email",
                                                value.insured_email || "",
                                            );
                                        }
                                    },
                                    fields,
                                    control,
                                    error: errors.profile?.message,
                                })}

                            <InlineStack
                                gap="800"
                                rowGap="300"
                                align="space-between"
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
                                gap="800"
                                rowGap="300"
                                align="space-between"
                            >
                                {RenderFormFieldsUtils.renderTextField(
                                    "insured_email",
                                    fields,
                                    register,
                                    errors.insured_email?.message,
                                )}

                                {RenderFormFieldsUtils.renderTextField(
                                    "insured_phone",
                                    fields,
                                    register,
                                    errors.insured_phone?.message,
                                )}
                            </InlineStack>

                            {(() => {
                                const firstAdditionalField =
                                    matchedAdditionalFields[0];
                                const remainingFields =
                                    matchedAdditionalFields.slice(1);

                                return (
                                    <>
                                        {firstAdditionalField && (
                                            <InlineStack
                                                gap="800"
                                                rowGap="300"
                                                align="space-between"
                                            >
                                                {renderAdditionalField(
                                                    firstAdditionalField,
                                                )}
                                                {remainingFields[0] ? (
                                                    renderAdditionalField(
                                                        remainingFields[0],
                                                    )
                                                ) : (
                                                    <BlockStack />
                                                )}
                                            </InlineStack>
                                        )}

                                        {remainingFields.length > 1 &&
                                            Array.from(
                                                {
                                                    length: Math.ceil(
                                                        (remainingFields.length -
                                                            1) /
                                                            2,
                                                    ),
                                                },
                                                (_, i) => {
                                                    const field1 =
                                                        remainingFields[
                                                            i * 2 + 1
                                                        ];
                                                    const field2 =
                                                        remainingFields[
                                                            i * 2 + 2
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
                                    </>
                                );
                            })()}
                        </BlockStack>
                    </BlockStack>
                </Box>
            </Surface>
        </Form>
    );
});

export default InsuredPersonForm;
