/**
 * External dependencies
 */
import { useMemo, useState, useEffect, useCallback } from "react";

/**
 * Internal dependencies
 */
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Surface from "@/components/surface/surface";
import TextInput from "@/components/text-input/text-input";
import PackageVisualization from "@/pages/home-insurance/components/calculate-price-step/package-visualization";
import FormLabel from "@/components/form-label/form-label";
import Icon from "@/components/icon/icon";
import IconBuilding from "@/components/icons/building";
import IconCar from "@/components/icons/car";
import IconPrimaPackage from "@/components/icons/prima-package";
import IconStandartPackage from "@/components/icons/standart-package";
import IconPremiumPackage from "@/components/icons/premium-package";
import { formatNumber } from "@/utils/formatting";

const DEFAULT_REAL_ESTATE_AMOUNT = "150000";
const DEFAULT_NON_REAL_ESTATE_AMOUNT = "30000";
const STANDARD_PACKAGE_NAME = "Стандарт";

// Icon mapping for each package type
const PACKAGE_ICONS = {
    Прима: IconPrimaPackage,
    Стандарт: IconStandartPackage,
    Премиум: IconPremiumPackage,
};

const PackagesVisualization = (props) => {
    const {
        value = { realEstatePackage: null, nonRealEstatePackage: null },
        packages = [],
        onChange,
    } = props;

    const [validationState, setValidationState] = useState({
        isRealEstateAmountValid: true,
        isNonRealEstateAmountValid: true,
    });

    const { processedRealEstatePackages, processedNonRealEstatePackages } =
        useMemo(() => {
            const realEstatePackages = packages.filter(
                (pkg) => pkg.isRealEstate,
            );
            const nonRealEstatePackages = packages.filter(
                (pkg) => !pkg.isRealEstate,
            );

            const processPackages = (packageList) => {
                return packageList.map((pkg, index) => {
                    if (index > 0) {
                        const previousPkg = packageList[index - 1];
                        const additionalRisks = pkg.risks.filter((risk) => {
                            return !previousPkg.risks.some(
                                (prevRisk) => prevRisk.code === risk.code,
                            );
                        });
                        return {
                            ...pkg,
                            previousPackageName: previousPkg.name,
                            additionalRisks,
                        };
                    }
                    return pkg;
                });
            };

            return {
                processedRealEstatePackages:
                    processPackages(realEstatePackages),
                processedNonRealEstatePackages: processPackages(
                    nonRealEstatePackages,
                ),
            };
        }, [packages]);

    useEffect(() => {
        if (
            packages.length > 0 &&
            !value.realEstatePackage &&
            !value.nonRealEstatePackage
        ) {
            const defaultRealEstatePackage = processedRealEstatePackages.find(
                (pkg) => pkg.name === STANDARD_PACKAGE_NAME,
            );
            const defaultNonRealEstatePackage =
                processedNonRealEstatePackages.find(
                    (pkg) => pkg.name === STANDARD_PACKAGE_NAME,
                );

            if (defaultRealEstatePackage || defaultNonRealEstatePackage) {
                const newValue = { ...value };

                if (defaultRealEstatePackage) {
                    newValue.realEstatePackage = {
                        id: defaultRealEstatePackage.id,
                        package_name: defaultRealEstatePackage.name,
                        amount: DEFAULT_REAL_ESTATE_AMOUNT,
                    };
                }

                if (defaultNonRealEstatePackage) {
                    newValue.nonRealEstatePackage = {
                        id: defaultNonRealEstatePackage.id,
                        package_name: defaultNonRealEstatePackage.name,
                        amount: DEFAULT_NON_REAL_ESTATE_AMOUNT,
                    };
                }

                onChange(newValue);
            }
        }
    }, [
        packages,
        processedRealEstatePackages,
        processedNonRealEstatePackages,
        value,
        onChange,
    ]);

    const validateAmount = useCallback(
        (amount, packageId) => {
            const selectedPackage = packages.find(
                (pkg) => pkg.id === packageId,
            );
            if (!selectedPackage) return false;

            if (amount === "" || amount === null || amount === undefined) {
                return false;
            }

            const numericAmount = parseFloat(amount);
            // Check if it's a valid number and within range
            return (
                !isNaN(numericAmount) &&
                numericAmount >= selectedPackage.minInsuranceAmount &&
                numericAmount <= selectedPackage.maxInsuranceAmount
            );
        },
        [packages],
    );

    const handlePackageSelect = useCallback(
        (selectedPackage) => {
            if (!selectedPackage.isActive) return;

            const packageType = selectedPackage.isRealEstate
                ? "realEstatePackage"
                : "nonRealEstatePackage";

            // Keep existing amount if there's already a package selected of this type
            // This preserves user input when switching between packages
            const currentAmount = value[packageType]?.amount;
            const defaultAmount = selectedPackage.isRealEstate
                ? DEFAULT_REAL_ESTATE_AMOUNT
                : DEFAULT_NON_REAL_ESTATE_AMOUNT;

            // Use current amount if it exists and is not empty, otherwise use default
            const amountToUse =
                currentAmount && currentAmount !== ""
                    ? currentAmount
                    : defaultAmount;

            onChange({
                ...value,
                [packageType]: {
                    id: selectedPackage.id,
                    package_name: selectedPackage.name,
                    amount: amountToUse,
                },
            });
        },
        [value, onChange],
    );

    const handleAmountChange = useCallback(
        (packageType) => (amount) => {
            const currentPackage = value[packageType];

            if (!currentPackage?.id) return;

            const isValid = validateAmount(amount, currentPackage.id);
            const validationKey =
                packageType === "realEstatePackage"
                    ? "isRealEstateAmountValid"
                    : "isNonRealEstateAmountValid";

            setValidationState((prev) => ({
                ...prev,
                [validationKey]: isValid,
            }));

            onChange({
                ...value,
                [packageType]: {
                    ...currentPackage,
                    amount,
                },
            });
        },
        [value, onChange, validateAmount],
    );

    const handleTextInputAmountChange = useCallback(
        (packageType) => (event) => {
            const rawValue = event.target.value.replace(/[^\d]/g, "");
            handleAmountChange(packageType)(rawValue);
        },
        [handleAmountChange],
    );

    const formatDisplayAmount = (amount) => {
        if (!amount) return "";
        const numericAmount = amount.toString().replace(/[^\d]/g, "");
        return formatNumber(numericAmount);
    };

    const renderPackageSection = useCallback(
        (
            title,
            packages,
            selectedPackage,
            packageType,
            isAmountValid,
            icon,
        ) => (
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="800">
                        <InlineStack gap="400" blockAlign="center">
                            {icon && (
                                <Icon
                                    icon={icon}
                                    size="600"
                                    color="brand-500"
                                />
                            )}

                            <Text variant="heading-m">{title}</Text>
                        </InlineStack>

                        <InlineStack
                            gap="600"
                            className="bz-package-visualization-stack"
                        >
                            {packages.map((pkg) => (
                                <Button
                                    key={pkg.id}
                                    variant="plain"
                                    pressed={selectedPackage?.id === pkg.id}
                                    onClick={() => handlePackageSelect(pkg)}
                                >
                                    <PackageVisualization
                                        code={pkg.code}
                                        name={pkg.name}
                                        icon={PACKAGE_ICONS[pkg.name]}
                                        tariff={pkg.tariff}
                                        maxInsuranceAmount={
                                            pkg.maxInsuranceAmount
                                        }
                                        minInsuranceAmount={
                                            pkg.minInsuranceAmount
                                        }
                                        risks={pkg.risks}
                                        additionalRisks={pkg.additionalRisks}
                                        previousPackageName={
                                            pkg.previousPackageName
                                        }
                                        amount={
                                            selectedPackage?.id === pkg.id
                                                ? selectedPackage?.amount
                                                : null
                                        }
                                        onAmountChange={
                                            selectedPackage?.id === pkg.id
                                                ? handleAmountChange(
                                                      packageType,
                                                  )
                                                : null
                                        }
                                        isSelected={
                                            selectedPackage?.id === pkg.id
                                        }
                                    />
                                </Button>
                            ))}
                        </InlineStack>

                        {selectedPackage && (
                            <BlockStack inlineAlign="start" gap="300">
                                <FormLabel invalid={!isAmountValid}>
                                    Застрахователна сума
                                </FormLabel>

                                <TextInput
                                    label="Сума на застраховане имущество"
                                    placeholder="Въведете сума"
                                    onChange={handleTextInputAmountChange(
                                        packageType,
                                    )}
                                    invalid={!isAmountValid}
                                    value={formatDisplayAmount(
                                        selectedPackage.amount,
                                    )}
                                />
                            </BlockStack>
                        )}
                    </BlockStack>
                </Box>
            </Surface>
        ),
        [handlePackageSelect, handleTextInputAmountChange],
    );

    return (
        <BlockStack gap="800">
            {renderPackageSection(
                "Недвижимо имущество",
                processedRealEstatePackages,
                value.realEstatePackage,
                "realEstatePackage",
                validationState.isRealEstateAmountValid,
                IconBuilding,
            )}

            {renderPackageSection(
                "Движимо имущество",
                processedNonRealEstatePackages,
                value.nonRealEstatePackage,
                "nonRealEstatePackage",
                validationState.isNonRealEstateAmountValid,
                IconCar,
            )}
        </BlockStack>
    );
};

export default PackagesVisualization;
