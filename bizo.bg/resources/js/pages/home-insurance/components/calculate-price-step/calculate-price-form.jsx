/**
 * External dependencies
 */
import { useState, useEffect, useMemo, useCallback } from "react";
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
import IconCalendar from "@/components/icons/calendar";
import useCalculatePriceQuery from "@/pages/home-insurance/data/use-calculate-price-query";
import PackagesVisualization from "@/pages/home-insurance/components/calculate-price-step/packages-visualization";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import CalculatePriceStepValidationSchema from "@/pages/home-insurance/validations/calculate-price-step-validation-schema";
import { useInsuranceDataContext } from "@/pages/home-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import { formatDate } from "@/utils/formatting";

function CalculatePriceForm() {
    const { home_insurance } = usePage().props;
    const { setPriceData, setPolicyData } = useInsuranceDataContext();
    const {
        setCalculatePriceFormData,
        calculatePriceFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setIsCalculatePriceValid } = useValidityContext();

    const fields = home_insurance.fields || [];

    const defaultValues = useMemo(() => {
        if (calculatePriceFormData) {
            const tomorrow = new Date(
                new Date().setDate(new Date().getDate() + 1),
            ).setHours(0, 0, 0, 0);
            const { currency, installment, start_date, period } =
                calculatePriceFormData;
            return {
                currency: fields
                    .find((f) => f.key === "currency")
                    ?.values?.find((v) => v.value === currency),
                installment: fields
                    .find((f) => f.key === "installment")
                    ?.values?.find((v) => v.value === installment),
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
            };
        }

        return fields.reduce((acc, field) => {
            if (field.key === "start_date") {
                acc[field.key] =
                    new Date(field.selected).setHours(0, 0, 0, 0) ||
                    new Date().setHours(0, 0, 0, 0);
            } else if (field.key && field.values && field.values.length > 0) {
                acc[field.key] = field.selected ? field.selected : undefined;
            }
            return acc;
        }, {});
    }, [fields]);

    const [isDiscountSelected, setIsDiscountSelected] = useState(false);
    const [selectedPackages, setSelectedPackages] = useState(() => {
        if (calculatePriceFormData?.packages) {
            const allRealEstatePackages = home_insurance.fields
                .filter((field) => field.key === "packages")[0]
                ?.values.filter((v) => v.isRealEstate == true);

            const allNonRealEstatePackages = home_insurance.fields
                .filter((field) => field.key === "packages")[0]
                ?.values.filter((v) => v.isRealEstate == false);

            const realEstate = calculatePriceFormData.packages.find((p) =>
                allRealEstatePackages.find((r) => r.id === p.id),
            );
            const nonRealEstate = calculatePriceFormData.packages.find((p) =>
                allNonRealEstatePackages.find((r) => r.id === p.id),
            );

            return {
                realEstatePackage: realEstate
                    ? {
                          id: realEstate.id,
                          amount: realEstate.insurance_amount.toString(),
                          package_name: realEstate.package_name,
                      }
                    : null,
                nonRealEstatePackage: nonRealEstate
                    ? {
                          id: nonRealEstate.id,
                          amount: nonRealEstate.insurance_amount.toString(),
                          package_name: nonRealEstate.package_name,
                      }
                    : null,
            };
        }
        return {
            realEstatePackage: null,
            nonRealEstatePackage: null,
        };
    });

    const handleSelectedPackagesChange = (currentPackages) => {
        setSelectedPackages(currentPackages);
    };

    const getFormattedPackages = useCallback(() => {
        const packages = [];
        if (
            selectedPackages.realEstatePackage?.id &&
            selectedPackages.realEstatePackage?.amount &&
            selectedPackages.realEstatePackage?.package_name
        ) {
            packages.push({
                id: parseInt(selectedPackages.realEstatePackage.id),
                insurance_amount: parseFloat(
                    selectedPackages.realEstatePackage.amount,
                ),
                package_name: selectedPackages.realEstatePackage.package_name,
                package_type: "Движимо имущество",
            });
        }
        if (
            selectedPackages.nonRealEstatePackage?.id &&
            selectedPackages.nonRealEstatePackage?.amount &&
            selectedPackages.nonRealEstatePackage?.package_name
        ) {
            packages.push({
                id: parseInt(selectedPackages.nonRealEstatePackage.id),
                package_id: parseInt(selectedPackages.nonRealEstatePackage.id),
                insurance_amount: parseFloat(
                    selectedPackages.nonRealEstatePackage.amount,
                ),
                package_name:
                    selectedPackages.nonRealEstatePackage.package_name,
                package_type: "Недвижимо имущество",
            });
        }
        return packages;
    }, [selectedPackages]);

    const getFormattedDiscounts = useCallback(() => {
        if (!isDiscountSelected) return [];

        return (
            home_insurance.fields
                .filter((field) => field.key === "discounts")[0]
                ?.values.map((discount) => ({
                    id: parseInt(discount.id),
                    discount: parseFloat(discount.value),
                })) || []
        );
    }, [isDiscountSelected, home_insurance.fields]);

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

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const calculatePriceData = useMemo(() => {
        const currency = watch("currency");
        const installment = watch("installment");
        const startDate = watch("start_date");
        const period = watch("period");

        const packages = getFormattedPackages();

        return {
            currency: currency?.value || null,
            installment: installment?.value
                ? parseInt(installment.value)
                : null,
            start_date: formatDate(startDate, "yyyy-MM-dd HH:mm:ss") || null,
            period: period?.value ? parseInt(period.value) : null,
            packages: packages,
            discounts: getFormattedDiscounts(),
        };
    }, [
        watch("currency"),
        watch("installment"),
        watch("start_date"),
        watch("period"),
        selectedPackages,
        isDiscountSelected,
        getFormattedPackages,
        getFormattedDiscounts,
    ]);

    useEffect(() => {
        const hasChanged =
            JSON.stringify(calculatePriceData) !==
            JSON.stringify(calculatePriceFormData);
        setCalculatePriceFormData(calculatePriceData);
        if (hasChanged) {
            setLastVisitedStep(1);
        }
    }, [calculatePriceData]);

    const {
        data: priceQueryData,
        isLoading,
        isError,
    } = useCalculatePriceQuery(calculatePriceData);

    useEffect(() => {
        if (isLoading) {
            setPolicyData(null);
        }
    }, [isLoading, setPolicyData]);

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
        <Form id="home-insurance-step-one-form">
            <BlockStack gap="800">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon
                                    icon={IconCalendar}
                                    size="600"
                                    color="blue-200"
                                />

                                <Text variant="heading-m">
                                    Срок на застраховката
                                </Text>
                            </InlineStack>

                            <InlineStack
                                gap="600"
                                rowGap="300"
                                align="space-between"
                            >
                                {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                    "start_date",
                                    fields,
                                    control,
                                    errors.start_date?.message,
                                    {
                                        minDate: new Date(
                                            new Date().setDate(
                                                new Date().getDate() + 1,
                                            ),
                                        ),
                                    },
                                )}

                                {RenderFormFieldsUtils.renderSelectField({
                                    fieldName: "period",
                                    onChangeHandler: (value) => {
                                        const periodValue = Number.parseInt(
                                            value?.value ?? "",
                                            10,
                                        );
                                        const isUnderOneYear =
                                            periodValue !== 1; // 1 година
                                        if (!isUnderOneYear) return;
                                        const oneInstallmentOption = fields
                                            .find(
                                                (f) => f.key === "installment",
                                            )
                                            .values.find(
                                                (opt) => opt.value === 1,
                                            );
                                        setValue(
                                            "installment",
                                            oneInstallmentOption,
                                        );
                                    },
                                    fields,
                                    control,
                                    error: errors.period?.message,
                                })}

                                {RenderFormFieldsUtils.renderSelectField({
                                    fieldName: "currency",
                                    fields,
                                    control,
                                    error: errors.currency?.message,
                                })}

                                {home_insurance.fields
                                    .filter(
                                        (field) => field.key === "installment",
                                    )
                                    .map((field) => {
                                        return RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName: "installment",
                                                onRenderHandler: (field) => {
                                                    const periodValue =
                                                        Number.parseInt(
                                                            watch("period")
                                                                ?.value ?? "",
                                                            10,
                                                        );
                                                    const isExactlyOneYear =
                                                        periodValue === 1;
                                                    field.isEnabled =
                                                        isExactlyOneYear;

                                                    return field;
                                                },
                                                fields,
                                                control,
                                                error: errors.installment
                                                    ?.message,
                                            },
                                        );
                                    })}
                            </InlineStack>
                        </BlockStack>
                    </Box>
                </Surface>

                <PackagesVisualization
                    packages={
                        home_insurance.fields.filter(
                            (field) => field.key === "packages",
                        )[0]?.values
                    }
                    onChange={handleSelectedPackagesChange}
                    value={selectedPackages}
                    error={errors.selectedPackages?.message}
                />

                {/* home_insurance.fields.filter(
                    (field) => field.key === "discounts",
                ).length > 0 && (
                        <Surface>
                            <Box padding="600">
                                <BlockStack gap="300">
                                    {home_insurance.fields
                                        .filter(
                                            (field) => field.key === "discounts",
                                        )
                                        .map((field) => {
                                            return field.values.map((value) => {
                                                return (
                                                    <>
                                                        <Text
                                                            variant="heading-m"
                                                            color="blue-200"
                                                        >
                                                            Отстъпки
                                                        </Text>
                                                        <Checkbox
                                                            label={
                                                                value.description
                                                            }
                                                            checked={
                                                                isDiscountSelected
                                                            }
                                                            onChange={() => {
                                                                setIsDiscountSelected(
                                                                    !isDiscountSelected,
                                                                );
                                                            }}
                                                        />
                                                    </>
                                                );
                                            });
                                        })}
                                </BlockStack>
                            </Box>
                        </Surface>
                    ) */}
            </BlockStack>
        </Form>
    );
}

export default CalculatePriceForm;
