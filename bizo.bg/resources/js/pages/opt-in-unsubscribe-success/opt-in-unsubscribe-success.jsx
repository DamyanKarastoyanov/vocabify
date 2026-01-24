/**
 * External dependencies
 */
import { Head } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

/**
 * Internal dependencies
 */
import Page from "@/components/page/page";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import Button from "@/components/button/button";
import IconSuccessCheck from "@/components/icons/success-check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import CaptainBizoUnsubscribing from "@assets/CaptainBizoUnsubscribing.png";
import useResubscribeOptInMutation from "./data/use-resubscribe-opt-in-mutation";
import AppLayout from "@/layouts/app-layout/app-layout";

const OptInUnsubscribeSuccess = (props) => {
    const { unsubscribedUser } = usePage().props;
    const route = useRoute();
    const { mutate: resubscribeOptIn } = useResubscribeOptInMutation();
    const [isResubscribed, setIsResubscribed] = useState(false);

    const onResubscribe = () => {
        resubscribeOptIn(
            {
                email: unsubscribedUser.email,
            },
            {
                onSuccess: () => {
                    setIsResubscribed(true);
                },
                onError: (e) => {
                    console.log(e.response.data.message);
                },
            },
        );
    };

    const onGoToWelcomePage = () => {
        router.visit(route("welcome"));
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
                                <BlockStack
                                    gap="800"
                                    align="center"
                                    inlineAlign="center"
                                >
                                    <Text variant="heading-xl" align="center">
                                        {isResubscribed
                                            ? "Успешно възстановяване на абонамент"
                                            : "Успешно отписване"}
                                    </Text>

                                    <Text variant="body-l" align="center">
                                        {isResubscribed
                                            ? "Отново ще получавате имейли от Bizo.bg за напомняния за сроковете по вашите автомобили."
                                            : "Вече няма да получавате имейли от Bizo.bg за напомняния за сроковете по вашите автомобили."}
                                    </Text>

                                    <BlockStack
                                        gap="400"
                                        align="center"
                                        inlineAlign="center"
                                    >
                                        {!isResubscribed && (
                                            <Text
                                                variant="body-m"
                                                align="center"
                                            >
                                                Отписали сте се по грешка?
                                            </Text>
                                        )}

                                        <Button
                                            onClick={
                                                !isResubscribed
                                                    ? onResubscribe
                                                    : onGoToWelcomePage
                                            }
                                            variant="outline"
                                        >
                                            <Text
                                                variant="body-m"
                                                color="brand-500"
                                            >
                                                {!isResubscribed
                                                    ? "Абонирай се отново"
                                                    : "Към началната страница"}
                                            </Text>
                                        </Button>
                                    </BlockStack>
                                </BlockStack>
                            </Box>
                        </BlockStack>
                    </Box>
                </Surface>
            </Box>
        );
    };

    return (
        <Page>
            <Head title="Успешно отписване" />
            <InsuranceStepLayout
                form={renderSuccessContent()}
                showOfferDetails={false}
                mascotImage={CaptainBizoUnsubscribing}
            />
        </Page>
    );
};

export default AppLayout.wrap(OptInUnsubscribeSuccess);
