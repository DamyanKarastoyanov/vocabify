/**
 * External dependencies
 */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { usePage } from "@inertiajs/react";
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
import paymentValidationSchema from "@/components/payment-step/payment-validation-schema";
import { RadioGroup, Option } from "@/components/radio-group";

const PaymentForm = (props) => {
    const {
        insuranceType = "travel_insurance",
        useFormDataContext,
        useValidityContext,
        stepNumber,
    } = props;
    const page = usePage();
    const insuranceData = page.props[insuranceType];

    const { setPaymentFormData, paymentFormData, setLastVisitedStep } =
        useFormDataContext();
    const { setIsPaymentValid } = useValidityContext();

    const fields = insuranceData?.fields || [];

    const paymentMethodField = fields.find(
        (field) => field.key === "payment_method",
    );
    const paymentMethodOptions = paymentMethodField?.values || [];

    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const defaultValues = useMemo(() => {
        const values = fields.reduce((acc, field) => {
            if (field.key && field.values && field.values.length > 0) {
                acc[field.key] =
                    field.selected?.value || field.selected || undefined;
            }
            return acc;
        }, {});

        // Initialize from context if available, otherwise use first option or selected value
        values.payment_method =
            paymentFormData?.payment_method?.value ||
            paymentFormData?.payment_method ||
            values.payment_method ||
            (paymentMethodOptions.length > 0
                ? paymentMethodOptions[0].value
                : undefined);

        return values;
    }, [fields, paymentMethodOptions, paymentFormData]);

    const {
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(paymentValidationSchema),
        mode: "onChange",
        defaultValues,
    });

    const formData = useMemo(() => {
        const paymentMethod = watch("payment_method");

        const data = {
            payment_method: paymentMethod || null,
        };

        return data;
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
            setLastVisitedStep(stepNumber);
        }
    }, [formData, paymentFormData, isFormInitialized]);

    useEffect(() => {
        setIsPaymentValid(isValid);
    }, [isValid]);

    const selectedPaymentMethod = watch("payment_method");

    const renderCardBankText = () => (
        <Text variant="body-s">
            След завършване на процеса, ще получиш номер на полицата и указания
            за банковия превод.
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
                                                    renderCardBankText()}
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

export default PaymentForm;
