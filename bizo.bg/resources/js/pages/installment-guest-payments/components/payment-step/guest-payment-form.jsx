/**
 * External dependencies
 */
import { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import IconPayment from "@/components/icons/payment";
import Surface from "@/components/surface/surface";
import InlineStack from "@/components/inline-stack/inline-stack";
import Box from "@/components/box/box";
import { RadioGroup, Option } from "@/components/radio-group";
import { useGuestPaymentFormContext } from "@/pages/installment-guest-payments/contexts/guest-payment-form-context";
import { useGuestPaymentValidityContext } from "@/pages/installment-guest-payments/contexts/guest-payment-validity-context";
import GuestPaymentFormValidationSchema from "@/pages/installment-guest-payments/validations/guest-payment-form-validation-schema";

const GuestPaymentForm = () => {
    const { installment_guest_payment } = usePage().props;
    const { setPaymentFormData, paymentFormData } =
        useGuestPaymentFormContext();
    const { setIsPaymentValid } = useGuestPaymentValidityContext();

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const paymentMethodOptions =
        installment_guest_payment?.valid_field_values?.payment_method;

    const defaultValues = useMemo(() => {
        return {
            payment_method:
                paymentFormData?.payment_method ||
                paymentMethodOptions[0]?.value,
        };
    }, [paymentFormData, paymentMethodOptions]);

    const {
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(GuestPaymentFormValidationSchema),
        mode: "onChange",
        defaultValues,
    });

    const formData = useMemo(() => {
        const paymentMethod = watch("payment_method");

        return {
            payment_method: paymentMethod || null,
        };
    }, [watch("payment_method")]);

    useEffect(() => {
        if (
            !paymentFormData ||
            (paymentFormData &&
                JSON.stringify(formData) == JSON.stringify(paymentFormData))
        ) {
            setIsFormInitialized(true);
        }

        const isFormChanged =
            JSON.stringify(formData) !== JSON.stringify(paymentFormData);

        if (isFormInitialized && isFormChanged) {
            setPaymentFormData(formData);
        }
    }, [formData, paymentFormData, isFormInitialized]);

    useEffect(() => {
        setIsPaymentValid(isValid);
    }, [isValid]);

    const selectedPaymentMethod = watch("payment_method");

    const renderBankTransferText = () => (
        <Text variant="body-s">
            След завършване на процеса, ще получите указания за банковия превод.
        </Text>
    );

    const renderCardText = () => (
        <Text variant="body-s">
            Картовите плащания се обработват от Банка ДСК – международна
            компания, която е специализирана в сигурни разплащания. Данните се
            предават по защитена, криптирана връзка и не се съхраняват след като
            плащането бъде завършено.
        </Text>
    );

    return (
        <Form id="payment-form">
            <BlockStack gap="800">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconPayment} size="600" />
                                <Text variant="heading-m">
                                    Начин на плащане
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                <RadioGroup
                                    name="payment_method"
                                    value={selectedPaymentMethod}
                                    onChange={(value) =>
                                        setValue("payment_method", value)
                                    }
                                    orientation="vertical"
                                    error={errors.payment_method?.message}
                                >
                                    {paymentMethodOptions.map((option) => (
                                        <div key={option.value}>
                                            <Option value={option.value}>
                                                {option.label}
                                            </Option>

                                            <div>
                                                {selectedPaymentMethod ===
                                                    "card" &&
                                                    option.value === "card" &&
                                                    renderCardText()}
                                                {selectedPaymentMethod ===
                                                    "bank_transfer" &&
                                                    option.value ===
                                                        "bank_transfer" &&
                                                    renderBankTransferText()}
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
};

export default GuestPaymentForm;
