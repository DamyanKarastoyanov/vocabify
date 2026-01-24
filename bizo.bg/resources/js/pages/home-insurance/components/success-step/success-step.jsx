/**
 * External dependencies
 */
import { useEffect } from "react";
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
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { formatNumber } from "@/utils/formatting";

const SuccessStep = () => {
    const { home_insurance, auth } = usePage().props;
    const {
        policy: policyData,
        currency,
        debit_note_url,
        policy_url,
    } = home_insurance;

    const user = auth.user?.id || null;

    const route = useRoute();
    const {
        payment_details,
        policy_number,
        currency: routeCurrency,
        first_installment,
        installments_count,
    } = route().params;

    const { resetFormData } = useFormDataContext();

    useEffect(() => {
        resetFormData();
    }, [policyData]);

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
                    disabled={!policyData}
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

                {policyData.status !== 5 && (
                    <Button
                        variant="plain"
                        onClick={() => handleDownloadPolicy()}
                        disabled={!policyData}
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

    const renderSuccessStep = () => {
        return (
            <Box className="bz-insurance-step-five-page-holder">
                <Surface>
                    <Box className="bz-insurance-step-five-holder">
                        <BlockStack gap="800">
                            <InlineStack align="center" blockAlign="center">
                                <Icon size="2800" icon={IconSuccessCheck} />
                            </InlineStack>

                            {policyData ? (
                                <Box>
                                    <BlockStack
                                        gap="800"
                                        align="center"
                                        inlineAlign="center"
                                    >
                                        {policyData.status == 5 ? (
                                            <>
                                                <Box className="bz-insurance-text-details-holder">
                                                    <Text
                                                        variant="body-l"
                                                        fontWeight="semibold"
                                                    >
                                                        Успешно заплати{" "}
                                                        {
                                                            policyData
                                                                .installments[0]
                                                                .total_amount
                                                        }{" "}
                                                        {currency}
                                                        {Number(
                                                            policyData
                                                                .installments
                                                                .length,
                                                        ) !== 1 &&
                                                            ` - 1 от ${policyData.installments.length} вноски`}
                                                        , но полицата още не е
                                                        издадена.
                                                    </Text>
                                                </Box>

                                                {renderDownloadButtons()}

                                                <Box className="bz-insurance-text-details-holder-secondary">
                                                    <BlockStack
                                                        gap="300"
                                                        inlineAlign="start"
                                                    >
                                                        <Text variant="body-s">
                                                            Всичко с плащането е
                                                            наред, но заради
                                                            временен технически
                                                            проблем не успяхме
                                                            да издадем полицата
                                                            веднага.
                                                        </Text>

                                                        <Text variant="body-s">
                                                            Не се тревожи — наш
                                                            човек ще прегледа
                                                            случая и ще я издаде
                                                            ръчно възможно
                                                            най-скоро.
                                                        </Text>

                                                        <Text variant="body-s">
                                                            Ще получиш имейл с
                                                            всичко необходимо
                                                            веднага щом е
                                                            готова.
                                                        </Text>

                                                        <Text variant="body-s">
                                                            Междувременно можеш
                                                            да свалиш дебитната
                                                            нота от бутона
                                                            по-горе — тя е
                                                            официално
                                                            потвърждение, че
                                                            плащането е успешно.
                                                        </Text>

                                                        {user === null &&
                                                            policyData
                                                                .installments
                                                                .length > 1 && (
                                                                <InlineStack gap="100">
                                                                    <Text
                                                                        variant="body-s"
                                                                        fontWeight="bold"
                                                                    >
                                                                        Важно:
                                                                    </Text>

                                                                    <Text variant="body-s">
                                                                        На
                                                                        посочения
                                                                        от теб
                                                                        имейл
                                                                        адрес ще
                                                                        получаваш
                                                                        информация
                                                                        и
                                                                        напомняния
                                                                        за
                                                                        предстоящи
                                                                        плащания
                                                                        по
                                                                        твоята
                                                                        полица.
                                                                    </Text>
                                                                </InlineStack>
                                                            )}
                                                    </BlockStack>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <Box className="bz-insurance-text-details-holder">
                                                    <Text
                                                        variant="body-l"
                                                        fontWeight="semibold"
                                                    >
                                                        Успешно заплати{" "}
                                                        {
                                                            policyData
                                                                .installments[0]
                                                                .total_amount
                                                        }{" "}
                                                        {currency}
                                                        {Number(
                                                            policyData
                                                                .installments
                                                                .length,
                                                        ) !== 1 &&
                                                            ` - 1 от ${policyData.installments.length} вноски`}{" "}
                                                        по застраховката си.
                                                    </Text>
                                                </Box>

                                                {policyData.status !== 5 && (
                                                    <Box className="bz-insurance-step-five-policy-number-holder">
                                                        <InlineStack
                                                            gap="300"
                                                            align="center"
                                                            blockAlign="center"
                                                        >
                                                            <Text variant="heading-s">
                                                                Номер на полица
                                                            </Text>

                                                            <Text variant="body-m">
                                                                {
                                                                    policyData.policy_number
                                                                }
                                                            </Text>
                                                        </InlineStack>
                                                    </Box>
                                                )}

                                                {renderDownloadButtons()}

                                                <Box className="bz-insurance-text-details-holder-secondary">
                                                    <BlockStack
                                                        gap="300"
                                                        inlineAlign="start"
                                                    >
                                                        <Text variant="body-s">
                                                            Ще изпратим
                                                            потвърждение за
                                                            твоята застраховка и
                                                            всички важни
                                                            документи на
                                                            посочения от теб
                                                            имейл. Моля, провери
                                                            внимателно входящата
                                                            си поща, както и
                                                            папка „Спам", ако не
                                                            откриеш съобщението
                                                            до няколко минути.
                                                        </Text>

                                                        <Text variant="body-s">
                                                            В своя профил в
                                                            bizo.bg можеш по
                                                            всяко време:
                                                        </Text>

                                                        <BlockStack
                                                            gap="100"
                                                            inlineAlign="start"
                                                        >
                                                            <Text variant="body-s">
                                                                • да преглеждаш
                                                                активната си
                                                                полица и нейното
                                                                покритие;
                                                            </Text>
                                                            <Text variant="body-s">
                                                                • да управляваш
                                                                и следиш
                                                                плащанията си;
                                                            </Text>
                                                            <Text variant="body-s">
                                                                • да изтегляш
                                                                документи;
                                                            </Text>
                                                            <Text variant="body-s">
                                                                • да обновяваш
                                                                личните си
                                                                данни;
                                                            </Text>
                                                            <Text variant="body-s">
                                                                • да подаваш
                                                                заявки и да
                                                                следиш своя
                                                                застрахователен
                                                                статус.
                                                            </Text>
                                                        </BlockStack>

                                                        <Text variant="body-s">
                                                            Ако все още нямаш
                                                            профил, можеш да се
                                                            регистрираш бързо и
                                                            лесно сега, за да
                                                            имаш пълен контрол и
                                                            достъп до
                                                            застраховката си по
                                                            всяко време.
                                                        </Text>

                                                        <Text variant="body-s">
                                                            При въпроси или
                                                            нужда от съдействие,
                                                            нашият екип е на
                                                            разположение да ти
                                                            помогне.
                                                        </Text>
                                                    </BlockStack>
                                                </Box>
                                            </>
                                        )}

                                        <div className="bz-notification-card">
                                            <div className="bz-notification-card__accent" />
                                            <div className="bz-notification-card__content">
                                                <Icon
                                                    icon={IconInfo}
                                                    size="600"
                                                    color="brand-500"
                                                />

                                                {(() => {
                                                    const startDate = new Date(
                                                        policyData.start_date,
                                                    );
                                                    const endDate = new Date(
                                                        policyData.end_date,
                                                    );
                                                    const daysDifference =
                                                        Math.ceil(
                                                            (endDate -
                                                                startDate) /
                                                                (1000 *
                                                                    60 *
                                                                    60 *
                                                                    24),
                                                        );
                                                    const costPerDay =
                                                        formatNumber(
                                                            policyData.total_amount /
                                                                daysDifference,
                                                            ",",
                                                            2,
                                                        );
                                                    return (
                                                        <Text
                                                            variant="body-s"
                                                            className="bz-notification-card__text"
                                                        >
                                                            Току-що си купи
                                                            застраховка за
                                                            по-малко от{" "}
                                                            {costPerDay}{" "}
                                                            {currency} на ден!
                                                            Супер сделка, нали?
                                                        </Text>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </BlockStack>
                                </Box>
                            ) : (
                                <BlockStack gap="800">
                                    <Box className="bz-insurance-text-details-holder">
                                        <Text
                                            variant="body-l"
                                            fontWeight="semibold"
                                        >
                                            Очакваме банков превод на стойност{" "}
                                            {first_installment.total_amount}{" "}
                                            {routeCurrency}
                                            {Number(installments_count) !== 1 &&
                                                ` - 1 от ${installments_count} вноски`}{" "}
                                            по твоята застраховка.
                                        </Text>
                                    </Box>

                                    <Box className="bz-insurance-text-details-holder-secondary">
                                        <BlockStack
                                            gap="800"
                                            inlineAlign="start"
                                        >
                                            <Text variant="body-s">
                                                Ще получиш имейл с всички
                                                инструкции, но ето ги и тук за
                                                твое удобство:
                                            </Text>

                                            <BlockStack
                                                gap="200"
                                                inlineAlign="start"
                                            >
                                                <Text variant="body-s">
                                                    IBAN: {payment_details.iban}
                                                </Text>

                                                <Text variant="body-s">
                                                    Банка:{" "}
                                                    {payment_details.bank}
                                                </Text>

                                                <Text variant="body-s">
                                                    BIC: {payment_details.bic}
                                                </Text>

                                                <Text variant="body-s">
                                                    Титуляр на сметката:{" "}
                                                    {
                                                        payment_details.account_holder
                                                    }
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
                                                        В полето „Основание за
                                                        плащане" посочи номера
                                                        на полицата:{" "}
                                                        {policy_number}
                                                    </Text>
                                                </div>
                                            </div>
                                        </BlockStack>
                                    </Box>
                                </BlockStack>
                            )}

                            <InlineStack align="center" blockAlign="center">
                                {user === null ? (
                                    <InlineStack gap="100">
                                        <Button
                                            variant="primary"
                                            href={route("login")}
                                        >
                                            Вход
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            href={route("register")}
                                        >
                                            Регистрирай се
                                        </Button>
                                    </InlineStack>
                                ) : (
                                    <Button
                                        variant="primary"
                                        href={
                                            route("policies.index") +
                                            "?filter=insurance_type%3AИмуществена%20застраховка"
                                        }
                                    >
                                        Виж своите полици
                                    </Button>
                                )}
                            </InlineStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </Box>
        );
    };

    return (
        <InsuranceStepLayout
            form={renderSuccessStep()}
            showOfferDetails={false}
            mascotImage={CaptainBizoShield}
        />
    );
};

export default SuccessStep;
