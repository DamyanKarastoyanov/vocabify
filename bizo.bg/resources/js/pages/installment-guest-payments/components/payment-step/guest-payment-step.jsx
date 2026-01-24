/**
 * External dependencies
 */
import { usePage, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";

/**
 * Internal dependencies
 */
import IconCheck from "@/components/icons/check";
import GuestPaymentForm from "@/pages/installment-guest-payments/components/payment-step/guest-payment-form";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import Alert from "@/components/alert/alert";
import useAlert from "@/components/alert/hooks/use-alert";
import { formatDate, formatNumber } from "@/utils/formatting";
import { useGuestPaymentDataContext } from "@/pages/installment-guest-payments/contexts/guest-payment-data-context";
import { useGuestPaymentFormContext } from "@/pages/installment-guest-payments/contexts/guest-payment-form-context";
import { useGuestPaymentValidityContext } from "@/pages/installment-guest-payments/contexts/guest-payment-validity-context";
import useGuestPaymentMutation from "@/pages/installment-guest-payments/data/use-guest-payment-mutation";

const GuestPaymentStep = () => {
    const { errors, installment_guest_payment } = usePage().props;
    const { installment } = installment_guest_payment || {};
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

            setTimeout(() => {
                showErrorAlert({
                    title: "Настъпи грешка",
                    message: errors?.message,
                    status: "error",
                    cta: {
                        label: "OK",
                        actionFun: () => {
                            closeErrorAlert();
                        },
                    },
                });
            }, 100);
        }
    }, [errors?.message]);

    const { offerData } = useGuestPaymentDataContext();
    const { paymentFormData } = useGuestPaymentFormContext();
    const { isPaymentValid } = useGuestPaymentValidityContext();

    const { mutate: processPayment, isPending } = useGuestPaymentMutation(
        installment?.id,
    );

    const handleContinue = () => {
        const isCardPayment = paymentFormData?.payment_method === "card";
        const paymentType = isCardPayment ? "card_payment" : "bank_transfer";

        processPayment(
            { payment_type: paymentType },
            {
                onSuccess: (response) => {
                    if (response.data.success) {
                        if (isCardPayment) {
                            window.location.href = response.data.redirect_url;
                        } else {
                            router.reload({
                                data: {
                                    step: 2,
                                    status: "success",
                                    payment_type: "bank_transfer",
                                    payment_details:
                                        response.data.payment_details,
                                },
                            });
                        }
                    } else {
                        showErrorAlert({
                            title: "Настъпи грешка",
                            message:
                                response.data?.error ||
                                "Настъпи грешка при обработка на плащането.",
                            status: "error",
                            cta: {
                                label: "OK",
                                actionFun: closeErrorAlert,
                            },
                        });
                    }
                },
                onError: (error) => {
                    showErrorAlert({
                        title: "Настъпи грешка",
                        message:
                            error?.response?.data?.error ||
                            "Настъпи грешка при обработка на плащането. Моля опитайте отново.",
                        status: "error",
                        cta: {
                            label: "OK",
                            actionFun: closeErrorAlert,
                        },
                    });
                },
            },
        );
    };

    const getOfferDetails = () => {
        if (!installment) return null;

        return [
            {
                items: [
                    {
                        label: "Полица",
                        value: installment.policy_number || "N/A",
                    },
                ],
            },
            {
                items: [
                    {
                        label: "Тип застраховка",
                        value: installment.insurance_type_name || "N/A",
                    },
                ],
            },
            {
                items: [
                    {
                        label: "Краен срок",
                        value: formatDate(installment.due_date, "dd.MM.yyyy"),
                    },
                ],
            },
            {
                items: [
                    {
                        label: "Сума за плащане",
                        value: formatNumber(installment.amount_due, ",", 2),
                        suffix: installment.currency || "BGN",
                    },
                ],
            },
        ];
    };
    return (
        <InsuranceStepLayout
            bubbleText="Изберете как да платите вноската си. Плащането е бързо и сигурно."
            form={<GuestPaymentForm />}
            offerDetails={getOfferDetails()}
            button={{
                text: "Към плащане",
                onClick: handleContinue,
                disabled: !isPaymentValid,
                loading: isPending,
                icon: IconCheck,
            }}
        />
    );
};

export default GuestPaymentStep;
