/**
 * External dependencies
 */
import { usePage, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";

/**
 * Internal dependencies
 */
import IconCheck from "@/components/icons/check";
import PaymentForm from "./payment-form";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import Alert from "@/components/alert/alert";
import useAlert from "@/components/alert/hooks/use-alert";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const PaymentStep = (props) => {
    const { errors } = usePage().props;
    const lastShownErrorRef = useRef(null);

    const { showAlert: showErrorAlert, closeAlert: closeErrorAlert } = useAlert(
        Alert,
        {
            duration: Infinity,
            style: {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            },
        },
    );

    useEffect(() => {
        if (
            errors &&
            errors.message &&
            errors.message !== lastShownErrorRef.current
        ) {
            lastShownErrorRef.current = errors.message;

            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                showErrorAlert({
                    title: "Настъпи грешка",
                    message: errors?.message,
                    status: "error",
                    cta: {
                        label: "OK",
                        actionFun: () => {
                            router.reload({
                                data: {
                                    ...route().params,
                                    errors: null,
                                },
                            });
                            closeErrorAlert();
                        },
                    },
                });
            }, 100);
        }
    }, [errors?.message]);

    const {
        insuranceType,
        useInsuranceDataContext,
        useFormDataContext,
        useValidityContext,
        useCreatePolicyMutation,
        useProcessPaymentMutation,
        nextStepNumber = null,
        bubbleText = null,
    } = props;

    const { offerData } = useInsuranceDataContext();
    const { paymentFormData } = useFormDataContext();
    const { isPaymentValid } = useValidityContext();

    const { mutate: processPayment, isPending } = useProcessPaymentMutation(
        offerData.id,
    );

    const { mutate: createPolicy, isPending: isCreatingPolicy } =
        useCreatePolicyMutation();

    const handleContinue = () => {
        if (paymentFormData.payment_method === "card") {
            if (!offerData?.id) return;

            processPayment(
                {},
                {
                    onSuccess: (response) => {
                        // Use window.location.href for external payment gateway URLs
                        window.location.href = response.data.redirect_url;
                    },
                    onError: (error) => {
                        showErrorAlert({
                            title: "Настъпи грешка",
                            message:
                                error?.response?.data?.error ||
                                "Настъпи грешка при обработка на плащането. Моля опитайте отново.",
                            cta: {
                                label: "OK",
                                actionFun: () => {
                                    router.reload({
                                        data: {
                                            ...route().params,
                                            errors: null,
                                        },
                                    });
                                    closeErrorAlert();
                                },
                            },
                        });
                    },
                },
            );
        } else {
            createPolicy(
                { offer_id: offerData.id },
                {
                    onSuccess: (response) => {
                        router.reload({
                            data: {
                                step: nextStepNumber,
                                payment_details: response.data.payment_details,
                                policy_number: response.data.policy_number,
                                currency: response.data.currency,
                                first_installment:
                                    response.data.installments[0],
                                installments_count:
                                    response.data.installments.length,
                            },
                            preserveScroll: false,
                            onFinish: () => window.scrollTo(0, 0),
                        });
                    },
                    onError: (error) => {
                        showErrorAlert({
                            title: "Настъпи грешка",
                            message:
                                error?.response?.data?.error ||
                                "Настъпи грешка при създаване на полица. Моля опитайте отново.",
                            cta: {
                                label: "OK",
                                actionFun: () => {
                                    router.reload({
                                        data: {
                                            ...route().params,
                                            errors: null,
                                        },
                                    });
                                    closeErrorAlert();
                                },
                            },
                        });
                    },
                },
            );
        }
    };

    const getOfferDetails = () => {
        if (!offerData) return null;

        const details = [
            {
                items: [
                    {
                        label: "Обща сума",
                        value: formatNumber(
                            insuranceType === "mtpl_insurance"
                                ? offerData.total_price
                                : offerData.total_amount,
                            ",",
                            2,
                        ),
                        suffix: offerData.currency,
                        subValue:
                            offerData.currency === "BGN"
                                ? convertBGNToEUR(
                                      insuranceType === "mtpl_insurance"
                                          ? offerData.total_price
                                          : offerData.total_amount,
                                  )
                                : null,
                        subSuffix: offerData.currency === "BGN" ? "EUR" : null,
                    },
                ],
            },
        ];

        if (insuranceType !== "mtpl_insurance") {
            details[0].items.unshift(
                {
                    label: "Застраховател",
                    value: <LogoLink insurer={AXIOM_INSURER} />,
                },
                {
                    label: "Премия",
                    value: formatNumber(offerData.amount, ",", 2),
                    suffix: offerData.currency,
                    subValue:
                        offerData.currency === "BGN"
                            ? convertBGNToEUR(offerData.amount)
                            : null,
                    subSuffix: offerData.currency === "BGN" ? "EUR" : null,
                },
                {
                    label: "Данък",
                    value: formatNumber(offerData.tax, ",", 2),
                    suffix: offerData.currency,
                    subValue:
                        offerData.currency === "BGN"
                            ? convertBGNToEUR(offerData.tax)
                            : null,
                    subSuffix: offerData.currency === "BGN" ? "EUR" : null,
                },
            );
        }

        if (insuranceType !== "travel_insurance" && offerData.installments) {
            details.push({
                items: [
                    {
                        label: "Вноски",
                        value: offerData.installments.length,
                    },
                ],
            });
        }

        if (offerData.installments && offerData.installments.length > 0) {
            details.push({
                items: [
                    {
                        label: "За плащане сега",
                        value: formatNumber(
                            insuranceType === "mtpl_insurance"
                                ? offerData.installments[0].total_bgn
                                : offerData.installments[0].total_amount,
                            ",",
                            2,
                        ),
                        suffix: offerData.currency,
                        subValue:
                            offerData.currency === "BGN"
                                ? convertBGNToEUR(
                                      insuranceType === "mtpl_insurance"
                                          ? offerData.installments[0].total_bgn
                                          : offerData.installments[0]
                                                .total_amount,
                                  )
                                : null,
                        subSuffix: offerData.currency === "BGN" ? "EUR" : null,
                    },
                ],
            });
        }

        return details;
    };

    return (
        <InsuranceStepLayout
            bubbleText={bubbleText}
            form={
                <PaymentForm
                    insuranceType={insuranceType}
                    useFormDataContext={useFormDataContext}
                    useValidityContext={useValidityContext}
                    stepNumber={nextStepNumber - 1}
                />
            }
            offerDetails={getOfferDetails()}
            button={{
                text: "Плащане",
                onClick: handleContinue,
                disabled: !isPaymentValid,
                loading: isPending || isCreatingPolicy,
                icon: IconCheck,
            }}
        />
    );
};

export default PaymentStep;
