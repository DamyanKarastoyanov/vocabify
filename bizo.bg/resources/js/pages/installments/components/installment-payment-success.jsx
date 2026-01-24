/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import Surface from "@/components/surface/surface";
import Button from "@/components/button/button";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";

const InstallmentPaymentSuccess = () => {
    const route = useRoute();

    const {
        payment_type,
        payment_details,
        policy_number,
        current_installment_amount,
        current_installment_sequence,
        installments_count,
        currency,
    } = route().params;

    const getBankTransferText = () => {
        return (
            <Surface>
                <Box padding="400" align="center">
                    <BlockStack gap="300">
                        <Text variant="body-l">
                            Очаква се плащане по банков път за{" "}
                            {current_installment_amount} {currency} -{" "}
                            {current_installment_sequence} от{" "}
                            {installments_count}{" "}
                            {Number(installments_count) === 1
                                ? "вноска"
                                : "вноски"}{" "}
                            по вашата застраховка.
                        </Text>

                        <Text variant="body-l">
                            Ще получите имейл с инструкциите по-долу:
                        </Text>

                        <BlockStack gap="200">
                            <Text>IBAN: {payment_details.iban}</Text>

                            <Text>Банка: {payment_details.bank}</Text>

                            <Text>BIC: {payment_details.bic}</Text>

                            <Text>
                                Титуляр на сметката:{" "}
                                {payment_details.account_holder}
                            </Text>
                        </BlockStack>

                        <Text variant="body-l">
                            Моля, посочете като основание за плащане номер на
                            полица: {policy_number}
                        </Text>
                    </BlockStack>
                </Box>
            </Surface>
        );
    };

    const getCardPaymentText = () => {
        return (
            <Surface>
                <Box padding="400" align="center">
                    <BlockStack gap="300">
                        <Text variant="body-l">
                            Плащането по полица с номер {policy_number} е
                            успешно!
                        </Text>

                        <Text variant="body-l">
                            Преведохте {current_installment_amount} {currency} -{" "}
                            {current_installment_sequence} от{" "}
                            {installments_count}{" "}
                            {Number(installments_count) === 1
                                ? "вноска"
                                : "вноски"}{" "}
                            по вашата застраховка.
                        </Text>
                    </BlockStack>
                </Box>
            </Surface>
        );
    };

    return (
        <BlockStack gap="400">
            {payment_type === "bank_transfer"
                ? getBankTransferText()
                : getCardPaymentText()}

            <InlineStack align="flex-end">
                <Button
                    variant="primary"
                    onClick={() => router.visit(route("installments.index"))}
                >
                    Към плащания
                </Button>
            </InlineStack>
        </BlockStack>
    );
};

export default InstallmentPaymentSuccess;
