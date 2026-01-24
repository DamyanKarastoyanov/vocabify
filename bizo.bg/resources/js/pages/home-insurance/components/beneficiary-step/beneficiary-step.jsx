/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRef } from "react";

/**
 * Internal dependencies
 */
import IconCheck from "@/components/icons/check";
import BeneficiaryForm from "@/pages/home-insurance/components/beneficiary-step/beneficiary-form";
import useGetOfferMutation from "@/pages/home-insurance/data/use-get-offer-mutation";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Text from "@/components/text/text";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/home-insurance/contexts/insurance-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import { formatDate, formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const formatDisplayAmount = (amount) => {
    if (!amount) return "";
    const numericAmount = amount.toString().replace(/[^\d]/g, "");
    return formatNumber(numericAmount);
};

const BeneficiaryStep = () => {
    const {
        calculatePriceFormData,
        propertyDetailsFormData,
        policyHolderFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setOfferData, priceData } = useInsuranceDataContext();
    const { isBeneficiaryValid } = useValidityContext();

    const { mutate, isPending } = useGetOfferMutation();
    const formRef = useRef();

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const handleContinue = (
        calculatePriceFormData,
        propertyDetailsFormData,
        policyHolderFormData,
    ) => {
        if (!isBeneficiaryValid) {
            if (formRef.current?.triggerErrors) {
                formRef.current.triggerErrors();
            }
            return;
        }
        const getOfferData = {
            ...calculatePriceFormData,
            ...policyHolderFormData,
            property_address: propertyDetailsFormData.property.address,
            property_post_code: propertyDetailsFormData.property.post_code,
            property_town_id: propertyDetailsFormData.property.town_id,
            property_size: propertyDetailsFormData.property.property_size,
        };

        mutate(getOfferData, {
            onSuccess: (response) => {
                setOfferData(response.data);
                router.reload({
                    data: {
                        step: 4,
                    },
                    preserveScroll: false,
                    onFinish: () => window.scrollTo(0, 0),
                });
                setLastVisitedStep(4);
            },
            onError: (error) => {
                showAlert({
                    title: <Text color="green-500">Възникна грешка</Text>,
                    message:
                        error?.response?.data?.message ||
                        "Възникна грешка при получаване на оферта. Моля, опитайте отново.",
                    closable: true,
                    hideable: true,
                });
            },
        });
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
                    label: "Обща стойност",
                    value: formatNumber(priceData.total_amount, ",", 2),
                    suffix: priceData.currency == "BGN" ? "BGN" : "EUR",
                    subValue:
                        priceData.currency === "BGN"
                            ? convertBGNToEUR(priceData.total_amount)
                            : null,
                    subSuffix: priceData.currency == "BGN" ? "EUR" : "BGN",
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
                    suffix: priceData.currency == "BGN" ? "BGN" : "EUR",
                    subValue:
                        priceData.currency === "BGN"
                            ? convertBGNToEUR(
                                  priceData.installments[0].total_amount,
                              )
                            : null,
                    subSuffix: priceData.currency == "BGN" ? "EUR" : null,
                },
            ],
        });

        return details;
    };

    return (
        <InsuranceStepLayout
            bubbleText="Ако има трето лице по полицата, сега е момента да го включиш в нея. Останалото е в мои ръце."
            form={<BeneficiaryForm ref={formRef} />}
            offerDetails={getOfferDetails()}
            button={{
                text: "Към плащане",
                onClick: () =>
                    handleContinue(
                        calculatePriceFormData,
                        propertyDetailsFormData,
                        policyHolderFormData,
                    ),
                loading: isPending,
                icon: IconCheck,
            }}
        />
    );
};

export default BeneficiaryStep;
