/**
 * External dependencies
 */
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import CalculatePriceForm from "@/pages/travel-insurance/components/calculate-price-step/calculate-price-form";
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import { useFormDataContext } from "@/pages/travel-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/travel-insurance/contexts/insurance-data-context";
import { useValidityContext } from "@/pages/travel-insurance/contexts/validity-context";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const CalculatePrice = () => {
    const { setLastVisitedStep } = useFormDataContext();
    const { priceData } = useInsuranceDataContext();
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

    const getPriceDetails = () => {
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
                        label: "За плащане сега",
                        value: formatNumber(priceData.total_amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.total_amount)
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
            offerDetails={getPriceDetails()}
            isError={!isCalculatePriceValid}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                disabled: !isCalculatePriceValid,
                icon: IconCheck,
            }}
            bubbleText="Bizo e с теб навсякъде, за да пътуваш без притеснения. Попълни датите и дестинацията, избери покритието и допълнителните рискове. Аз ще калкулирам най-подходящата защита за твоето пътуване."
        />
    );
};

export default CalculatePrice;
