/**
 * External dependencies
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Box from "@/components/box/box";
import Surface from "@/components/surface/surface";
import paymentTypeValidationSchema from "@/pages/installments/validations/payment-type-validation-schema";
import useProcessPaymentMutation from "@/pages/installments/data/use-process-payment-mutation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import InstallmentBankTransfer from "./installment-payment-success";
import { RadioGroup, Option } from "@/components/radio-group";

const paymentTypeOptions = [
    {
        value: "card_payment",
        label: "Плащане с карта",
    },
    {
        value: "bank_transfer",
        label: "Банков превод",
    },
];

const PaymentTypeForm = (props) => {
    const { installmentId, onClose } = props;

    const { errors: routeErrors } = usePage().props;

    const { mutate: processPayment, isPending } =
        useProcessPaymentMutation(installmentId);

    const [isBankTransfer, setIsBankTransfer] = useState(false);

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
    ); // Changed to false to prevent auto-dismissing

    const lastShownErrorRef = useRef(null);

    useEffect(() => {
        if (
            routeErrors &&
            routeErrors.message &&
            routeErrors.message !== lastShownErrorRef.current
        ) {
            lastShownErrorRef.current = routeErrors.message;

            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                showErrorAlert({
                    title: "Настъпи грешка",
                    message: routeErrors?.message,
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
    }, [routeErrors?.message]);

    const {
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(paymentTypeValidationSchema),
        mode: "onChange",
        defaultValues: {
            payment_type: paymentTypeOptions[0].value,
        },
    });

    const selectedPaymentType = watch("payment_type");

    const handleFormSubmit = (data) => {
        processPayment(
            { payment_type: data.payment_type },
            {
                onSuccess: (response) => {
                    if (response.data.success) {
                        if (data.payment_type === "bank_transfer") {
                            router.reload({
                                data: {
                                    status: "success",
                                    payment_type: data.payment_type,
                                    payment_details:
                                        response.data.payment_details,
                                    policy_number: response.data.policy_number,
                                    currency: response.data.currency,
                                    current_installment_amount:
                                        response.data
                                            .current_installment_amount,
                                    current_installment_sequence:
                                        response.data
                                            .current_installment_sequence,
                                    installments_count:
                                        response.data.installments_count,
                                },
                            });
                        } else {
                            window.location.href = response.data.redirect_url;
                        }
                    } else {
                        showErrorAlert({
                            title: "Настъпи грешка",
                            message: "Моля опитайте отново.",
                            status: "error",
                            closable: true,
                        });
                    }
                },
                onError: (error) => {
                    showErrorAlert({
                        title: "Настъпи грешка",
                        message:
                            error?.response?.data?.error ||
                            "Моля опитайте отново.",
                        status: "error",
                        closable: true,
                    });
                },
            },
        );
    };

    const renderCardText = () => (
        <Text variant="body-s" color="subdued">
            Картовите плащания се обработват от Банка ДСК – международна
            компания, специализирана в сигурни разплащателни услуги. Вашите
            данни се предават чрез защитена криптирана връзка и не се съхраняват
            след извършване на плащането.
        </Text>
    );

    const renderBankTransferText = () => (
        <Text variant="body-s" color="subdued">
            След като завършите процеса, ще получите номер на полица и указания
            за банковия превод.
        </Text>
    );

    if (isBankTransfer) {
        return <InstallmentBankTransfer policyNumber={policyNumber} />;
    }

    return (
        <BlockStack gap="500">
            <BlockStack gap="400">
                <Box className="bz-policies-form-fields-title">
                    <Text variant="heading-s">Изберете начин на плащане</Text>
                </Box>

                <Surface>
                    <Box padding="400">
                        <Form
                            id="payment-type-form"
                            onSubmit={handleSubmit(handleFormSubmit)}
                        >
                            <BlockStack gap="400">
                                <RadioGroup
                                    name="payment_type"
                                    value={selectedPaymentType}
                                    onChange={(value) =>
                                        setValue("payment_type", value)
                                    }
                                    orientation="vertical"
                                    error={errors.payment_type?.message}
                                >
                                    {paymentTypeOptions.map((option) => (
                                        <div key={option.value}>
                                            <Option value={option.value}>
                                                {option.label}
                                            </Option>

                                            <div
                                                style={{
                                                    marginTop: "8px",
                                                    marginLeft: "24px",
                                                }}
                                            >
                                                {selectedPaymentType ===
                                                    "card_payment" &&
                                                    option.value ===
                                                        "card_payment" &&
                                                    renderCardText()}
                                                {selectedPaymentType ===
                                                    "bank_transfer" &&
                                                    option.value ===
                                                        "bank_transfer" &&
                                                    renderBankTransferText()}
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </BlockStack>
                        </Form>
                    </Box>
                </Surface>
            </BlockStack>

            <InlineStack align="flex-end" gap="300">
                <Button
                    variant="primary"
                    type="submit"
                    form="payment-type-form"
                    disabled={!isValid}
                >
                    <Text>Към плащане</Text>
                </Button>

                <Button variant="secondary" onClick={onClose}>
                    <Text>Назад</Text>
                </Button>
            </InlineStack>
        </BlockStack>
    );
};

export default PaymentTypeForm;
