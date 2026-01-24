/**
 * External dependencies
 */
import { useRef } from "react";
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import { useInsuranceDataContext } from "@/pages/home-insurance/contexts/insurance-data-context";
import { formatDate, formatNumber } from "@/utils/formatting";
import PropertyDetailsForm from "@/pages/home-insurance/components/property-details-step/property-details-form";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const formatDisplayAmount = (amount) => {
    if (!amount) return "";
    const numericAmount = amount.toString().replace(/[^\d]/g, "");
    return formatNumber(numericAmount);
};

const PropertyDetailsStep = () => {
    const { priceData } = useInsuranceDataContext();
    const { calculatePriceFormData, setLastVisitedStep } = useFormDataContext();
    const { isPropertyDetailsValid } = useValidityContext();
    const formRef = useRef();

    const handleContinue = () => {
        if (!isPropertyDetailsValid) {
            if (formRef.current?.triggerErrors) {
                formRef.current.triggerErrors();
            }
            return;
        }
        router.reload({
            data: {
                step: 3,
            },
            preserveScroll: false,
            onFinish: () => window.scrollTo(0, 0),
        });
        setLastVisitedStep(3);
    };

    const getOfferDetails = () => {
        if (!calculatePriceFormData) return null;

        const details = [
            {
                items: [
                    {
                        label: "Застраховател",
                        value: <LogoLink insurer={AXIOM_INSURER} />,
                    },
                ],
            },
        ];

        if (calculatePriceFormData?.packages?.length > 0) {
            calculatePriceFormData.packages.forEach((current_package) => {
                details.push({
                    items: [
                        {
                            label: current_package.package_type,
                            value: formatDisplayAmount(
                                current_package.insurance_amount,
                            ),
                            suffix: priceData.currency,
                            subValue:
                                priceData.currency === "BGN"
                                    ? convertBGNToEUR(
                                          current_package.insurance_amount,
                                      )
                                    : null,
                            subSuffix:
                                priceData.currency === "BGN" ? "EUR" : null,
                        },
                    ],
                });
            });
        }

        details.push({
            items: [
                {
                    label: "Начална дата",
                    value: formatDate(
                        calculatePriceFormData?.start_date,
                        "dd/MM/yyyy",
                    ),
                },
                {
                    label: "Обща сума",
                    value: formatNumber(priceData.total_amount, ",", 2),
                    suffix: priceData.currency,
                    subValue:
                        priceData.currency === "BGN"
                            ? convertBGNToEUR(priceData.total_amount)
                            : null,
                    subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                },
                {
                    label: "Вноски",
                    value: priceData.installments.length,
                },
                {
                    label: "За плащане сега",
                    value: formatNumber(
                        priceData.installments[0].total_amount,
                        ",",
                        2,
                    ),
                    suffix: priceData.currency,
                    subValue:
                        priceData.currency === "BGN"
                            ? convertBGNToEUR(
                                  priceData.installments[0].total_amount,
                              )
                            : null,
                    subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                },
            ],
        });

        return details;
    };

    return (
        <InsuranceStepLayout
            bubbleText="Нека уточним къде се намира твоето имущество. Попълни адреса, а аз ще подготвя идеалната оферта за теб."
            form={<PropertyDetailsForm ref={formRef} />}
            offerDetails={getOfferDetails()}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                icon: IconCheck,
            }}
        />
    );
};

export default PropertyDetailsStep;
