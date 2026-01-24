/**
 * External dependencies
 */
import { usePage } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import BlockStack from "@/components/block-stack/block-stack";
import IconSuccessCheck from "@/components/icons/success-check";
import Icon from "@/components/icon/icon";
import IconDownload from "@/components/icons/download";
import IconInfo from "@/components/icons/info";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import CaptainBizoShield from "@assets/CaptainBizoShield.png";

const SuccessStep = (props) => {
    const { paymentType } = props;
    const { installment_guest_payment, auth } = usePage().props;
    const { installment } = installment_guest_payment || {};
    const route = useRoute();
    const { debit_note_url, payment_details, policy_url } = route().params;

    const user = auth.user?.id || null;
    const isCardPayment = paymentType === "card_payment";

    const handleDownloadPolicy = () => {
        if (policy_url) {
            window.open(policy_url);
        }
    };

    const handleDownloadDebitNote = () => {
        if (debit_note_url) {
            window.open(debit_note_url);
        }
    };

    const renderDownloadButtons = () => {
        return (
            <InlineStack
                className="bz-insurance-step-five-download-buttons"
                gap="200"
                align="center"
                blockAlign="center"
            >
                <Button
                    width="200px"
                    variant="plain"
                    onClick={() => handleDownloadDebitNote()}
                    disabled={!debit_note_url}
                >
                    <Box padding="200">
                        <BlockStack gap="100">
                            <Icon
                                icon={IconDownload}
                                size="1000"
                                color="brand-500"
                            />

                            <Text variant="body-s">Дебитна нота</Text>
                        </BlockStack>
                    </Box>
                </Button>

                {policy_url && (
                    <Button
                        variant="plain"
                        onClick={() => handleDownloadPolicy()}
                    >
                        <Box padding="200">
                            <BlockStack gap="100">
                                <Icon
                                    icon={IconDownload}
                                    size="1000"
                                    color="brand-500"
                                />

                                <Text variant="body-s">Полица</Text>
                            </BlockStack>
                        </Box>
                    </Button>
                )}
            </InlineStack>
        );
    };

    const renderCardPaymentContent = () => {
        return (
            <BlockStack gap="800" align="center" inlineAlign="center">
                <Box className="bz-insurance-text-details-holder">
                    <Text variant="body-l" fontWeight="semibold">
                        Успешно плати {installment?.amount_due}{" "}
                        {installment?.currency || "BGN"} по твоята застраховка.
                    </Text>
                </Box>

                {installment?.policy_status !== 5 && (
                    <Box className="bz-insurance-step-five-policy-number-holder">
                        <InlineStack
                            gap="300"
                            align="center"
                            blockAlign="center"
                        >
                            <Text variant="heading-s">Номер на полица</Text>

                            <Text variant="body-m">
                                {installment?.policy_number}
                            </Text>
                        </InlineStack>
                    </Box>
                )}

                {renderDownloadButtons()}
                {user ? (
                    <InlineStack align="center" blockAlign="center">
                        <Button
                            variant="primary"
                            href={route("policies.index")}
                        >
                            Виж своите полици
                        </Button>
                    </InlineStack>
                ) : (
                    <>
                        <Box className="bz-insurance-text-details-holder-secondary">
                            <BlockStack gap="300" inlineAlign="start">
                                <Text variant="body-s">
                                    Ще изпратим потвърждение за плащането на
                                    посочения от теб имейл. Моля, провери
                                    внимателно входящата си поща, както и папка
                                    „Спам", ако не откриеш съобщението до
                                    няколко минути.
                                </Text>

                                <Text variant="body-s">
                                    В своя профил в bizo.bg можеш по всяко
                                    време:
                                </Text>

                                <BlockStack gap="100" inlineAlign="start">
                                    <Text variant="body-s">
                                        • да преглеждаш активната си полица и
                                        нейното покритие;
                                    </Text>
                                    <Text variant="body-s">
                                        • да управляваш и следиш плащанията си;
                                    </Text>
                                    <Text variant="body-s">
                                        • да изтегляш документи;
                                    </Text>
                                    <Text variant="body-s">
                                        • да обновяваш личните си данни;
                                    </Text>
                                    <Text variant="body-s">
                                        • да подаваш заявки и да следиш своя
                                        застрахователен статус.
                                    </Text>
                                </BlockStack>

                                <Text variant="body-s">
                                    Ако все още нямаш профил, можеш да се
                                    регистрираш бързо и лесно сега, за да имаш
                                    пълен контрол и достъп до застраховката си
                                    по всяко време.
                                </Text>

                                <Text variant="body-s">
                                    При въпроси или нужда от съдействие, нашият
                                    екип е на разположение да ти помогне.
                                </Text>
                            </BlockStack>
                        </Box>

                        <InlineStack align="center" blockAlign="center">
                            <InlineStack gap="100">
                                <Button variant="primary" href={route("login")}>
                                    Вход
                                </Button>

                                <Button
                                    variant="secondary"
                                    href={route("register")}
                                >
                                    Регистрирай се
                                </Button>
                            </InlineStack>
                        </InlineStack>
                    </>
                )}
            </BlockStack>
        );
    };

    const renderBankTransferContent = () => {
        return (
            <BlockStack gap="800">
                <Box className="bz-insurance-text-details-holder">
                    <Text variant="body-l" fontWeight="semibold">
                        Очакваме банков превод на стойност{" "}
                        {installment?.amount_due}{" "}
                        {installment?.currency || "BGN"} по твоята застраховка.
                    </Text>
                </Box>

                <Box className="bz-insurance-text-details-holder-secondary">
                    <BlockStack gap="800" inlineAlign="start">
                        <Text variant="body-s">
                            Ще получиш имейл с всички инструкции, но ето ги и
                            тук за твое удобство:
                        </Text>

                        <BlockStack gap="200" inlineAlign="start">
                            <Text variant="body-s">
                                IBAN: {payment_details?.iban}
                            </Text>

                            <Text variant="body-s">
                                Банка: {payment_details?.bank}
                            </Text>

                            <Text variant="body-s">
                                BIC: {payment_details?.bic}
                            </Text>

                            <Text variant="body-s">
                                Титуляр на сметката:{" "}
                                {payment_details?.account_holder}
                            </Text>
                        </BlockStack>

                        <div className="bz-notification-card">
                            <div className="bz-notification-card__accent" />
                            <div className="bz-notification-card__content">
                                <Icon
                                    icon={IconInfo}
                                    size="600"
                                    color="brand-500"
                                />

                                <Text
                                    variant="body-s"
                                    className="bz-notification-card__text"
                                >
                                    В полето „Основание за плащане" посочете
                                    номера на полицата:{" "}
                                    {installment?.policy_number}
                                </Text>
                            </div>
                        </div>
                    </BlockStack>
                </Box>
            </BlockStack>
        );
    };

    const renderSuccessContent = () => {
        return (
            <Box className="bz-insurance-step-five-page-holder">
                <Surface>
                    <Box className="bz-insurance-step-five-holder">
                        <BlockStack gap="800">
                            <InlineStack align="center" blockAlign="center">
                                <Icon size="2800" icon={IconSuccessCheck} />
                            </InlineStack>

                            <Box>
                                {isCardPayment
                                    ? renderCardPaymentContent()
                                    : renderBankTransferContent()}
                            </Box>
                        </BlockStack>
                    </Box>
                </Surface>
            </Box>
        );
    };

    const bubbleText = isCardPayment
        ? "Готово! Плащането е успешно и вноската ти е отбелязана."
        : "Още една крачка и всичко е готово! Завършете плащането по банков път.";

    return (
        <InsuranceStepLayout
            bubbleText={bubbleText}
            form={renderSuccessContent()}
            showOfferDetails={false}
            mascotImage={CaptainBizoShield}
        />
    );
};

export default SuccessStep;
