/**
 * External dependencies
 */
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import CalculatePriceForm from "@/pages/home-insurance/components/calculate-price-step/calculate-price-form";
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import { useInsuranceDataContext } from "@/pages/home-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const CalculatePriceStep = () => {
    const { priceData } = useInsuranceDataContext();
    const { setLastVisitedStep } = useFormDataContext();
    const { isCalculatePriceValid } = useValidityContext();

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
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.amount)
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                    },
                    {
                        label: "Данък",
                        value: formatNumber(priceData.tax, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.tax)
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
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
            },
        ];
    };

    return (
        <InsuranceStepLayout
            bubbleText="Домът ти заслужава защита, която пасва на теб. Определи срока, броя вноски и пакета, а аз ще се погрижа за останалото – бързо, ясно и сигурно."
            form={<CalculatePriceForm />}
            offerDetails={getOfferDetails()}
            isError={!isCalculatePriceValid}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                disabled: !isCalculatePriceValid,
                icon: IconCheck,
            }}
        />
    );
};

export default CalculatePriceStep;
