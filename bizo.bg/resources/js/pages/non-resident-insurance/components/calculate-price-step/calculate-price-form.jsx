/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useMemo, useEffect } from "react";
import { parse } from "date-fns";
import isEqual from "lodash/isEqual";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Form from "@/components/form/form";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconDocument from "@/components/icons/document";
import NumberCounter from "@/components/number-counter/number-counter";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import CalculatePriceStepValidationSchema from "@/pages/non-resident-insurance/validations/calculate-price-step-validation-schema";
import useCalculatePriceQuery from "@/pages/non-resident-insurance/data/use-calculate-price-query";
import { useInsuranceDataContext } from "@/pages/non-resident-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import { formatDate } from "@/utils/formatting";

const createCustomerGroups = (customerGroup, insuredCount) => {
    return [
        {
            id: customerGroup?.value,
            count: insuredCount,
        },
    ];
};

const CalculatePriceForm = () => {
    const { non_resident_insurance } = usePage().props;

    const { setPriceData } = useInsuranceDataContext();
    const {
        setCalculatePriceFormData,
        calculatePriceFormData,
        setLastVisitedStep,
        insuredPersonsFormData,
        setInsuredPersonsFormData,
    } = useFormDataContext();
    const { setIsCalculatePriceValid } = useValidityContext();

    const fields = non_resident_insurance.fields || [];

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const defaultValues = useMemo(() => {
        if (calculatePriceFormData) {
            const tomorrow = new Date(
                new Date().setDate(new Date().getDate() + 1),
            ).setHours(0, 0, 0, 0);

            const {
                start_date,
                period,
                currency,
                installment,
                customer_groups,
            } = calculatePriceFormData;

            return {
                currency: fields
                    .find((f) => f.key === "currency")
                    ?.values?.find((v) => v.value === currency),
                start_date:
                    new Date(start_date).setHours(0, 0, 0, 0) < tomorrow
                        ? new Date(
                              fields.find((f) => f.key === "start_date")
                                  ?.selected,
                          ).setHours(0, 0, 0, 0)
                        : new Date(start_date).setHours(0, 0, 0, 0),
                period: fields
                    .find((f) => f.key === "period")
                    ?.values?.find((v) => v.value === period),
                insured_count: customer_groups[0].count,
                installment: fields
                    .find((f) => f.key === "installment")
                    ?.values?.find((v) => v.value === installment),
                customer_group: fields
                    .find((f) => f.key === "customer_group")
                    ?.values?.find((v) => v.value === customer_groups[0].id),
            };
        }

        const defaultFields = fields.reduce((acc, field) => {
            if (field.key === "start_date") {
                acc[field.key] =
                    new Date(field.selected).setHours(0, 0, 0, 0) ||
                    new Date().setHours(0, 0, 0, 0);
            } else if (field.key === "insured_count") {
                acc[field.key] = field.selected || 1;
            } else if (field.key && field.values && field.values.length > 0) {
                acc[field.key] =
                    field.selected !== undefined ? field.selected : undefined;
            }
            return acc;
        }, {});

        return { ...defaultFields };
    }, [calculatePriceFormData, fields]);

    const {
        register,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(CalculatePriceStepValidationSchema),
        mode: "onChange",
        defaultValues,
    });

    const calculatePriceData = useMemo(() => {
        const startDate = watch("start_date");
        const currency = watch("currency");
        const customerGroup = watch("customer_group");
        const insuredCount = watch("insured_count");
        const installment = watch("installment");
        const period = watch("period");

        return {
            installment: installment?.value,
            discounts: [],
            start_date: formatDate(startDate, "yyyy-MM-dd HH:mm:ss") || null,
            currency: currency?.value,
            period: period?.value,
            customer_groups: createCustomerGroups(customerGroup, insuredCount),
        };
    }, [
        watch("start_date"),
        watch("currency"),
        watch("customer_group"),
        watch("insured_count"),
        watch("installment"),
        watch("period"),
    ]);

    useEffect(() => {
        if (
            !calculatePriceFormData ||
            (calculatePriceFormData &&
                isEqual(calculatePriceData, calculatePriceFormData))
        ) {
            setIsFormInitialized(true);
        }

        const isFormChanged = !isEqual(
            calculatePriceData,
            calculatePriceFormData,
        );

        if (isFormInitialized && isFormChanged) {
            setCalculatePriceFormData(calculatePriceData);
            setLastVisitedStep(1);
        }
    }, [calculatePriceData, calculatePriceFormData, isFormInitialized]);

    const {
        data: priceQueryData,
        isLoading,
        isError,
        isSuccess,
    } = useCalculatePriceQuery(calculatePriceData);

    useEffect(() => {
        if (priceQueryData) {
            setPriceData(priceQueryData);
        } else {
            setPriceData(null);
        }
        const hasValidPriceData =
            isSuccess &&
            priceQueryData &&
            typeof priceQueryData === "object" &&
            Object.keys(priceQueryData).length > 0;

        setIsCalculatePriceValid(isValid && hasValidPriceData);
    }, [priceQueryData, isValid, isLoading, isError, isSuccess]);

    return (
        <Form id="non-resident-insurance-calculate-price-form">
            <BlockStack gap="300">
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
                                    wrap={true}
                                    align="flex-start"
                                    gap="800"
                                    rowGap="400"
                                >
                                    <BlockStack gap="400">
                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                                "start_date",
                                                fields,
                                                control,
                                                errors.start_date?.message,
                                            )}

                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "period",
                                                    fields,
                                                    control,
                                                    error: errors.period
                                                        ?.message,
                                                },
                                            )}
                                        </InlineStack>

                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "currency",
                                                    fields,
                                                    control,
                                                    error: errors.currency
                                                        ?.message,
                                                },
                                            )}

                                            {non_resident_insurance.fields
                                                .filter(
                                                    (field) =>
                                                        field.key ===
                                                        "installment",
                                                )
                                                .map((field) => {
                                                    return RenderFormFieldsUtils.renderSelectField(
                                                        {
                                                            fieldName:
                                                                "installment",
                                                            fields,
                                                            control,
                                                            error: errors
                                                                .installment
                                                                ?.message,
                                                        },
                                                    );
                                                })}
                                        </InlineStack>

                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "customer_group",
                                                    fields,
                                                    control,
                                                    error: errors.customer_group
                                                        ?.message,
                                                },
                                            )}

                                            <NumberCounter
                                                value={watch("insured_count")}
                                                onChange={(value) =>
                                                    setValue(
                                                        "insured_count",
                                                        value,
                                                    )
                                                }
                                                min={1}
                                                label="Брой лица"
                                            />
                                        </InlineStack>
                                    </BlockStack>
                                </InlineStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
};

export default CalculatePriceForm;
