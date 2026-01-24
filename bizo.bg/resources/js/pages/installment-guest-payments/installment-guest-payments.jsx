/**
 * External dependencies
 */
import { usePage } from "@inertiajs/react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import AppLayout from "@/layouts/app-layout/app-layout";
import Page from "@/components/page/page";
import InlineStack from "@/components/inline-stack/inline-stack";
import Spinner from "@/components/spinner/spinner";
import { GuestPaymentDataContext } from "@/pages/installment-guest-payments/contexts/guest-payment-data-context";
import { GuestPaymentFormContext } from "@/pages/installment-guest-payments/contexts/guest-payment-form-context";
import { GuestPaymentValidityContext } from "@/pages/installment-guest-payments/contexts/guest-payment-validity-context";

const GuestPaymentStep = lazy(
    () =>
        import("@/pages/installment-guest-payments/components/payment-step/guest-payment-step"),
);
const SuccessStep = lazy(
    () =>
        import("@/pages/installment-guest-payments/components/success-step/success-step"),
);

const InstallmentGuestPayment = () => {
    const { errors: routeErrors, installment_guest_payment } = usePage().props;
    const { step } = installment_guest_payment || { step: 1 };
    const route = useRoute();
    const { status, payment_type } = route().params;

    // Context states
    const [offerData, setOfferData] = useState(null);
    const [paymentFormData, setPaymentFormData] = useState(null);
    const [lastVisitedStep, setLastVisitedStep] = useState(1);
    const [isPaymentValid, setIsPaymentValid] = useState(false);

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
        false,
    );

    const lastShownErrorRef = useRef(null);

    useEffect(() => {
        if (
            routeErrors &&
            routeErrors.message &&
            routeErrors.message !== lastShownErrorRef.current
        ) {
            lastShownErrorRef.current = routeErrors.message;

            setTimeout(() => {
                showErrorAlert({
                    title: "Настъпи грешка",
                    message: routeErrors?.message,
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
    }, [routeErrors?.message]);

    const viewComponent = () => {
        const steps = {
            1: GuestPaymentStep,
            2: SuccessStep,
        };

        const StepComponent = steps[step];

        return StepComponent ? (
            <StepComponent paymentType={payment_type} />
        ) : null;
    };

    // Default payment form view using PaymentStepWrapper
    return (
        <Page>
            <GuestPaymentDataContext.Provider
                value={{ offerData, setOfferData }}
            >
                <GuestPaymentFormContext.Provider
                    value={{
                        paymentFormData,
                        setPaymentFormData,
                        lastVisitedStep,
                        setLastVisitedStep,
                    }}
                >
                    <GuestPaymentValidityContext.Provider
                        value={{ isPaymentValid, setIsPaymentValid }}
                    >
                        <Suspense
                            fallback={
                                <InlineStack align="center" blockAlign="center">
                                    <Spinner />
                                </InlineStack>
                            }
                        >
                            {viewComponent()}
                        </Suspense>
                    </GuestPaymentValidityContext.Provider>
                </GuestPaymentFormContext.Provider>
            </GuestPaymentDataContext.Provider>
        </Page>
    );
};

export default AppLayout.wrap(InstallmentGuestPayment);
