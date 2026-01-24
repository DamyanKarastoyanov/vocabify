/**
 * External dependencies
 */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { parse } from "date-fns";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconDocument from "@/components/icons/document";
import IconPayment from "@/components/icons/payment";
import NumberCounter from "@/components/number-counter/number-counter";
import Checkbox from "@/components/checkbox/checkbox";
import useCalculatePriceQuery from "@/pages/travel-insurance/data/use-calculate-price-query";
import useGetTravelTypeActivitiesQuery from "@/pages/travel-insurance/data/use-get-travel-type-activities-query";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import calculatePriceValidationSchema from "@/pages/travel-insurance/validations/calculate-price-validation-schema";
import { useFormDataContext } from "@/pages/travel-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/travel-insurance/contexts/insurance-data-context";
import { useValidityContext } from "@/pages/travel-insurance/contexts/validity-context";
import { formatDate } from "@/utils/formatting";
// Utility functions
const createCustomerGroup = (formData, insuranceAmount) => {
    const {
        customerGroup,
        numberOfPassengers,
        numberOfPassengersUnder18,
        numberOfPassengersUnder26,
    } = formData;

    let group = {
        id: customerGroup?.value,
        count: numberOfPassengers,
        insurance_amount: insuranceAmount?.value,
    };

    if (customerGroup?.value === 1) {
        group = {
            ...group,
            count_under_14: 0,
            count_under_18: numberOfPassengersUnder18 || 0,
            count_under_26: numberOfPassengersUnder26 || 0,
        };
    }

    return group;
};

const createAdditionalCoverages = (additionalRisks, fields, watchFunction) => {
    return additionalRisks.map((risk) => ({
        id: risk,
        name: fields
            .find((field) => field.key === "additional_risks")
            ?.values?.find((value) => value.value === risk)?.label,
        insurance_amount: watchFunction(`additional_risk_${risk}_amount`)
            ?.value,
    }));
};

const getSelectedRiskAmount = (riskId, calculatePriceFormData, fields) => {
    const selectedRisk = calculatePriceFormData?.additional_coverages?.find(
        (selectedRisk) => selectedRisk.id === riskId,
    );

    if (selectedRisk) {
        return fields
            .find((field) => field.key === `additional_risk_${riskId}_amount`)
            ?.values?.find(
                (value) => value.value === selectedRisk.insurance_amount,
            );
    }

    return fields.find(
        (field) => field.key === `additional_risk_${riskId}_amount`,
    )?.selected;
};

const createDefaultValues = (calculatePriceFormData, fields) => {
    if (calculatePriceFormData) {
        const tomorrow = new Date(
            new Date().setDate(new Date().getDate() + 1),
        ).setHours(0, 0, 0, 0);

        const {
            start_date,
            end_date,
            currency,
            travel_type,
            travel_type_activity,
            destination,
            customer_groups,
            additional_coverages,
        } = calculatePriceFormData;

        // Create additional risk amounts object
        const additionalRiskAmounts = {};
        for (let i = 1; i <= 10; i++) {
            additionalRiskAmounts[`additional_risk_${i}_amount`] =
                getSelectedRiskAmount(i, calculatePriceFormData, fields) ||
                null;
        }

        return {
            currency: fields
                .find((f) => f.key === "currency")
                ?.values?.find((v) => v.value === currency),
            start_date:
                new Date(start_date).setHours(0, 0, 0, 0) < tomorrow
                    ? new Date(
                          fields.find((f) => f.key === "start_date")?.selected,
                      ).setHours(0, 0, 0, 0)
                    : new Date(start_date).setHours(0, 0, 0, 0),
            end_date:
                new Date(end_date).setHours(0, 0, 0, 0) < tomorrow
                    ? new Date(
                          fields.find((f) => f.key === "end_date")?.selected,
                      ).setHours(0, 0, 0, 0)
                    : new Date(end_date).setHours(0, 0, 0, 0),
            travel_type: fields
                .find((f) => f.key === "travel_type")
                ?.values?.find((v) => v.value === travel_type),
            travel_type_activity:
                fields
                    .find((f) => f.key === "travel_type_activity")
                    ?.values?.find((v) => v.value === travel_type_activity) ||
                null,
            destination: fields
                .find((f) => f.key === "destination")
                ?.values?.find((v) => v.value === destination),
            insurance_amount: fields
                .find((f) => f.key === "insurance_amount")
                ?.values?.find(
                    (v) => v.value === customer_groups[0].insurance_amount,
                ),
            customer_group: fields
                .find((f) => f.key === "customer_group")
                ?.values?.find((v) => v.value === customer_groups[0].id),
            number_of_passengers: customer_groups[0].count || 1,
            number_of_passengers_under_18:
                customer_groups[0].count_under_18 || 0,
            number_of_passengers_under_26:
                customer_groups[0].count_under_26 || 0,
            additional_risks:
                additional_coverages?.map((coverage) => coverage.id) || [],
            ...additionalRiskAmounts,
        };
    }

    const defaultFields = fields.reduce((acc, field) => {
        if (field.key === "start_date" || field.key === "end_date") {
            acc[field.key] =
                new Date(field.selected).setHours(0, 0, 0, 0) ||
                new Date().setHours(0, 0, 0, 0);
        } else if (field.key === "number_of_passengers") {
            acc[field.key] = field.selected || 1;
        } else if (field.key && field.values && field.values.length > 0) {
            acc[field.key] =
                field.selected !== undefined ? field.selected : undefined;
        }
        return acc;
    }, {});

    return { ...defaultFields };
};

const modifyFieldsForVisibility = (fields, travelType, additionalRisks) => {
    return fields.map((field) => {
        if (
            field.key &&
            field.key.startsWith("additional_risk_") &&
            field.key.endsWith("_amount")
        ) {
            const riskValue = field.key
                .replace("additional_risk_", "")
                .replace("_amount", "");
            return {
                ...field,
                isVisible: additionalRisks.includes(parseInt(riskValue)),
            };
        }

        return field;
    });
};

// Custom hook for form data management
const useCalculatePriceFormData = (watch, fields) => {
    return useMemo(() => {
        const startDate = watch("start_date");
        const endDate = watch("end_date");
        const travelType = watch("travel_type");
        const travelTypeActivity = watch("travel_type_activity");
        const destination = watch("destination");
        const currency = watch("currency");
        const insuranceAmount = watch("insurance_amount");
        const customerGroup = watch("customer_group");
        const numberOfPassengers = watch("number_of_passengers");
        const numberOfPassengersUnder18 = watch(
            "number_of_passengers_under_18",
        );
        const numberOfPassengersUnder26 = watch(
            "number_of_passengers_under_26",
        );
        const additionalRisks = watch("additional_risks") || [];

        const formData = {
            customerGroup,
            numberOfPassengers,
            numberOfPassengersUnder18,
            numberOfPassengersUnder26,
        };

        const additional_coverages = createAdditionalCoverages(
            additionalRisks,
            fields,
            watch,
        );
        const customer_group = createCustomerGroup(formData, insuranceAmount);

        return {
            installment: 1,
            discounts: [],
            start_date: formatDate(startDate, "yyyy-MM-dd HH:mm:ss") || null,
            end_date: formatDate(endDate, "yyyy-MM-dd HH:mm:ss") || null,
            travel_type: travelType?.value,
            travel_type_activity: travelTypeActivity?.value || null,
            destination: destination?.value,
            currency: currency?.value,
            additional_coverages,
            customer_groups: [customer_group],
        };
    }, [
        watch("start_date"),
        watch("end_date"),
        watch("travel_type"),
        watch("travel_type_activity"),
        watch("destination"),
        watch("currency"),
        watch("insurance_amount"),
        watch("customer_group"),
        watch("number_of_passengers"),
        watch("number_of_passengers_under_18"),
        watch("number_of_passengers_under_26"),
        watch("number_of_passengers_between_70_and_80"),
        watch("additional_risks"),
        ...Array.from({ length: 10 }, (_, i) =>
            watch(`additional_risk_${i + 1}_amount`),
        ),
    ]);
};

const AdditionalRisksSection = ({
    fields,
    additionalRisks,
    setValue,
    modifiedFields,
    control,
    errors,
}) => {
    const additionalRisksField = fields.find(
        (field) => field.key === "additional_risks",
    );

    if (!additionalRisksField?.values) return null;

    const handleRiskToggle = (value) => {
        const currentRisks = additionalRisks || [];
        if (currentRisks.includes(value)) {
            setValue(
                "additional_risks",
                currentRisks.filter((risk) => risk !== value),
            );
        } else {
            setValue("additional_risks", [...currentRisks, value]);
        }
    };

    return (
        <BlockStack gap="300">
            {additionalRisksField.values.map((value) => (
                <Box
                    className="bz-additional-risks-section-item"
                    key={value.value}
                    width="100%"
                >
                    <InlineStack
                        key={value.value}
                        gap="300"
                        align="space-between"
                    >
                        <Checkbox
                            label={value.label.replace("*", "")}
                            checked={additionalRisks.includes(value.value)}
                            onChange={() => handleRiskToggle(value.value)}
                        />

                        <Box width="200px">
                            {additionalRisks.includes(value.value) &&
                                RenderFormFieldsUtils.renderSelectField({
                                    fieldName: `additional_risk_${value.value}_amount`,
                                    fields: modifiedFields,
                                    control,
                                    error: errors[
                                        `additional_risk_${value.value}_amount`
                                    ]?.message,
                                })}
                        </Box>
                    </InlineStack>
                </Box>
            ))}
        </BlockStack>
    );
};

const CalculatePriceForm = () => {
    const {
        setCalculatePriceFormData,
        calculatePriceFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setPriceData } = useInsuranceDataContext();
    const { setIsCalculatePriceValid } = useValidityContext();

    const { travel_insurance } = usePage().props;

    const fields = travel_insurance.fields || [];

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const defaultValues = useMemo(
        () => createDefaultValues(calculatePriceFormData, fields),
        [calculatePriceFormData, fields],
    );

    const {
        register,
        reset,
        control,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(calculatePriceValidationSchema),
        mode: "onChange",
        defaultValues,
    });

    const travelType = watch("travel_type")?.value;
    const additionalRisks = watch("additional_risks") || [];

    const {
        data: travelTypeActivities,
        invalidateQuery: invalidateTravelTypeActivitiesQuery,
    } = useGetTravelTypeActivitiesQuery(travelType);

    const modifiedFields = useMemo(
        () => modifyFieldsForVisibility(fields, travelType, additionalRisks),
        [fields, travelType, additionalRisks],
    );

    const startDate = watch("start_date");
    const endDate = watch("end_date");

    useEffect(() => {
        trigger(["start_date", "end_date"]);
    }, [startDate, endDate, trigger]);

    // Clear travel_type_activity when travel_type changes
    useEffect(() => {
        if (travelType === 1) {
            // If travel type is 1, clear the activity field as it's not needed
            setValue("travel_type_activity", null);
            trigger("travel_type_activity"); // Explicitly trigger validation
        } else if (travelType && travelType !== 1) {
            // If travel type is not 1, clear the field and wait for user selection
            const currentActivity = watch("travel_type_activity");
            if (currentActivity && travelTypeActivities?.length > 0) {
                // Check if current activity is still valid for this travel type
                const isValidActivity = travelTypeActivities.some(
                    (activity) => activity.value === currentActivity.value,
                );
                if (!isValidActivity) {
                    setValue("travel_type_activity", null);
                    trigger("travel_type_activity"); // Explicitly trigger validation
                }
            } else if (!currentActivity) {
                // If no activity is selected and travel type requires it, trigger validation
                trigger("travel_type_activity");
            }
        }
    }, [travelType, travelTypeActivities]);

    // Set travel type activity options once they're loaded
    useEffect(() => {
        if (
            travelTypeActivities?.length > 0 &&
            calculatePriceFormData?.travel_type_activity
        ) {
            const savedTravelTypeActivity = travelTypeActivities.find(
                (t) =>
                    t.value ===
                    parseInt(calculatePriceFormData.travel_type_activity),
            );
            if (savedTravelTypeActivity) {
                setValue("travel_type_activity", savedTravelTypeActivity, {
                    shouldValidate: true,
                });
            }
        }
    }, [travelTypeActivities, calculatePriceFormData]);

    useEffect(() => {
        if (!calculatePriceFormData && fields.length > 0) {
            // Only reset on initial load when there's no existing form data
            reset(defaultValues);
        }
    }, [defaultValues, reset, calculatePriceFormData, fields]);

    const calculatePriceData = useCalculatePriceFormData(watch, fields);

    useEffect(() => {
        /*const hasChanged = JSON.stringify(calculatePriceData) !== JSON.stringify(calculatePriceFormData);
        setCalculatePriceFormData(calculatePriceData);
        if (hasChanged) {
            setLastVisitedStep(1);
        }*/

        if (
            !calculatePriceFormData ||
            (calculatePriceFormData &&
                JSON.stringify(calculatePriceData) ==
                    JSON.stringify(calculatePriceFormData))
        ) {
            setIsFormInitialized(true);
        }

        const isFormChanged =
            JSON.stringify(calculatePriceData) !==
            JSON.stringify(calculatePriceFormData);

        if (isFormInitialized && isFormChanged) {
            setCalculatePriceFormData(calculatePriceData);
            setLastVisitedStep(1);
        }
    }, [calculatePriceData]);

    const { data: priceQueryData, isError } =
        useCalculatePriceQuery(calculatePriceData);

    useEffect(() => {
        if (priceQueryData) {
            setPriceData(priceQueryData);
        } else {
            setPriceData(null);
        }
    }, [priceQueryData]);

    useEffect(() => {
        setIsCalculatePriceValid(isValid && !isError);
    }, [isValid, isError]);

    return (
        <Form id="travel-insurance-calculate-price-form">
            <BlockStack gap="800">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconDocument} size="600" />

                                <Text variant="heading-m">
                                    Изчисляване на цената
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                        "start_date",
                                        modifiedFields,
                                        control,
                                        errors.start_date?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                        "end_date",
                                        modifiedFields,
                                        control,
                                        errors.end_date?.message,
                                    )}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "currency",
                                        fields: modifiedFields,
                                        control,
                                        error: errors.currency?.message,
                                    })}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "destination",
                                        fields: modifiedFields,
                                        control,
                                        error: errors.destination?.message,
                                    })}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "travel_type",
                                        fields: modifiedFields,
                                        control,
                                        error: errors.travel_type?.message,
                                    })}

                                    {watch("travel_type")?.value !== 1 &&
                                        RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName:
                                                    "travel_type_activity",
                                                onRenderHandler: (field) => {
                                                    if (
                                                        travelTypeActivities?.length >
                                                        0
                                                    ) {
                                                        field.values =
                                                            travelTypeActivities;
                                                    } else {
                                                        field.values = [];
                                                    }
                                                    return field;
                                                },
                                                fields: modifiedFields,
                                                control,
                                                error: errors
                                                    .travel_type_activity
                                                    ?.message,
                                            },
                                        )}
                                </InlineStack>

                                {RenderFormFieldsUtils.renderSelectField({
                                    fieldName: "customer_group",
                                    fields: modifiedFields,
                                    control,
                                    error: errors.customer_group?.message,
                                })}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    <NumberCounter
                                        value={watch("number_of_passengers")}
                                        onChange={(value) =>
                                            setValue(
                                                "number_of_passengers",
                                                value,
                                            )
                                        }
                                        min={1}
                                        label="Брой лица"
                                    />

                                    {watch("customer_group")?.value == 1 &&
                                        RenderFormFieldsUtils.renderNumberTextField(
                                            "number_of_passengers_under_18",
                                            modifiedFields,
                                            register,
                                            errors.number_of_passengers_under_18
                                                ?.message,
                                        )}

                                    {watch("customer_group")?.value == 1 &&
                                        RenderFormFieldsUtils.renderNumberTextField(
                                            "number_of_passengers_under_26",
                                            modifiedFields,
                                            register,
                                            errors.number_of_passengers_under_26
                                                ?.message,
                                        )}
                                </InlineStack>
                            </BlockStack>

                            {RenderFormFieldsUtils.renderRangeField(
                                "insurance_amount",
                                modifiedFields,
                                control,
                                errors.insurance_amount?.message,
                            )}
                        </BlockStack>
                    </Box>
                </Surface>

                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconPayment} size="600" />

                                <Text variant="heading-m">
                                    Допълнителни рискове
                                </Text>
                            </InlineStack>

                            <AdditionalRisksSection
                                fields={fields}
                                additionalRisks={additionalRisks}
                                setValue={setValue}
                                modifiedFields={modifiedFields}
                                control={control}
                                errors={errors}
                            />
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
};

export default CalculatePriceForm;
