/**
 * External dependencies
 */
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import CalculatePriceForm from "@/pages/non-resident-insurance/components/calculate-price-step/calculate-price-form";
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
//import { useNonResidentInsuranceContext } from "@/pages/non-resident-insurance/non-resident-insurance-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import { useInsuranceDataContext } from "@/pages/non-resident-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const CalculatePriceStep = () => {
    const { priceData } = useInsuranceDataContext();
    const { isCalculatePriceValid } = useValidityContext();
    const { setLastVisitedStep } = useFormDataContext();

    const handleContinue = () => {
        router.reload({
            data: {
                step: 2,
            },
            preserveScroll: false,
            onFinish: () => window.scrollTo(0, 0),
        });
        setLastVisitedStep(2);
    };

    const getOfferDetails = () => {
        if (!priceData) {
            return null;
        }

        return [
            {
                items: [
                    {
                        label: "Застраховател",
                        value: <LogoLink insurer={AXIOM_INSURER} />,
                    },
                    {
                        label: "Премия",
                        value: formatNumber(priceData.amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency == "BGN"
                                ? convertBGNToEUR(priceData.amount)
                                : "",
                        subSuffix: priceData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Данък",
                        value: formatNumber(priceData.tax, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency == "BGN"
                                ? convertBGNToEUR(priceData.tax)
                                : "",
                        subSuffix: priceData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Обща сума",
                        value: formatNumber(priceData.total_amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency == "BGN"
                                ? convertBGNToEUR(priceData.total_amount)
                                : "",
                        subSuffix: priceData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Вноски",
                        value: priceData.installments?.length || 0,
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
            },
        ];
    };

    return (
        <InsuranceStepLayout
            form={<CalculatePriceForm />}
            offerDetails={getOfferDetails()}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                disabled: !isCalculatePriceValid,
                icon: IconCheck,
            }}
            bubbleText="Нека те защитим по време на престоя ти в България. Избери периода, броя лица и вноските – Bizo ще изчисли твоята застраховка за секунди!"
        />
    );
};

export default CalculatePriceStep;
