/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";

/**
 * Internal dependencies
 */
import AppLayout from "@/layouts/app-layout/app-layout";
import Page from "@/components/page/page";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import Surface from "@/components/surface/surface";
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconCar from "@/components/icons/car";
import IconDocument from "@/components/icons/document";
import IconVignetteCheck from "@/components/icons/vignette-check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import VignetteCheckForm from "@/pages/vignette-check/components/vignette-check-form";
import VignetteCheckResults from "@/pages/vignette-check/components/vignette-check-results";
import OptInForm from "@/components/opt-in/opt-in-form";
import AdditionalServicesSection from "@/components/additional-services-section/additional-services-section";
import IconMTPLInsurance from "@/components/icons/mtpl-insurance";
import IconMVRFines from "@/components/icons/mvr-fines";
import IconVehicleInspection from "@/components/icons/vehicle-inspection";
import CaptainBizoCar from "@assets/CaptainBizoCar.png";

const VignetteCheck = () => {
    const { seo } = usePage().props;
    const [checkResults, setCheckResults] = useState(null);
    const isDataCorrect =
        checkResults && checkResults.success && !checkResults.error;

    const handleNewSearch = () => {
        setCheckResults(null);
    };

    const additionalServices = [
        {
            key: "vehicle-inspection",
            icon: IconVehicleInspection,
            title: "Провери срок на ГТП",
            description: "Увери се, че техническият ти преглед е изряден.",
            href: route("vehicle-inspection"),
        },
        {
            key: "mtpl-check",
            icon: IconMTPLInsurance,
            title: "Проверка на ГО",
            description: "Увери се, че застраховката ти е активна.",
            href: route("mtpl-check"),
        },
        {
            key: "mvr-fines-check",
            icon: IconMVRFines,
            title: "Проверка на глоби",
            description: "Увери се, че нямаш глоби от МВР.",
            href: route("mvr-fines-check"),
        },
    ];

    return (
        <Page>
            <Head title={seo?.title} />

            <BlockStack gap="600" className="bz-vignette-check-page">
                <InlineStack gap="400" blockAlign="center">
                    <Icon icon={IconVignetteCheck} size="2000" />

                    <Text variant="heading-xl">
                        Провери валидност на винетка
                    </Text>
                </InlineStack>

                <InsuranceStepLayout
                    form={
                        isDataCorrect ? (
                            <BlockStack gap="2000">
                                <Surface>
                                    <Box padding="1000">
                                        <BlockStack gap="800">
                                            <InlineStack gap="400" wrap={false}>
                                                <Icon
                                                    icon={IconDocument}
                                                    size="600"
                                                />

                                                <Text variant="heading-m">
                                                    Резултат от проверка на
                                                    винетка
                                                </Text>
                                            </InlineStack>

                                            <VignetteCheckResults
                                                results={checkResults}
                                                onNewSearch={handleNewSearch}
                                            />
                                        </BlockStack>
                                    </Box>
                                </Surface>

                                <OptInForm
                                    results={checkResults}
                                    serviceType="vignette-check"
                                />
                            </BlockStack>
                        ) : (
                            <BlockStack gap="2000">
                                <Surface>
                                    <Box padding="800">
                                        <BlockStack gap="800">
                                            <InlineStack gap="400">
                                                <Icon
                                                    icon={IconCar}
                                                    size="600"
                                                />

                                                <Text variant="heading-m">
                                                    Данни на автомобила
                                                </Text>
                                            </InlineStack>

                                            <VignetteCheckForm
                                                setCheckResults={
                                                    setCheckResults
                                                }
                                            />
                                        </BlockStack>
                                    </Box>
                                </Surface>

                                <AdditionalServicesSection
                                    services={additionalServices}
                                />
                            </BlockStack>
                        )
                    }
                    showOfferDetails={false}
                    bubbleText={
                        !isDataCorrect
                            ? "Пътят зове! Дай ми номер на превозно средство и проверявам винетката му моментално."
                            : null
                    }
                    mascotImage={isDataCorrect ? CaptainBizoCar : null}
                />
            </BlockStack>
        </Page>
    );
};

export default AppLayout.wrap(VignetteCheck);
