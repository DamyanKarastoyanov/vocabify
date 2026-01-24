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
import IconMVRFines from "@/components/icons/mvr-fines";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import MVRFinesCheckForm from "@/pages/mvr-fines-check/components/mvr-fines-check-form";
import MVRFinesCheckResults from "@/pages/mvr-fines-check/components/mvr-fines-check-results";
import OptInForm from "@/components/opt-in/opt-in-form";
import AdditionalServicesSection from "@/components/additional-services-section/additional-services-section";
import IconMTPLInsurance from "@/components/icons/mtpl-insurance";
import IconVignetteCheck from "@/components/icons/vignette-check";
import IconVehicleInspection from "@/components/icons/vehicle-inspection";
import CaptainBizoShield from "@assets/CaptainBizoShield.png";

const MVRFinesCheck = () => {
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
            key: "vignette-check",
            icon: IconVignetteCheck,
            title: "Проверка на винетка",
            description: "Увери се, че винетката ти е валидна.",
            href: route("vignette-check"),
        },
    ];

    return (
        <Page>
            <Head title={seo?.title} />

            <BlockStack gap="600" className="bz-mvr-fines-check-page">
                <InlineStack gap="400" blockAlign="center">
                    <Icon icon={IconMVRFines} size="2000" />

                    <Text variant="heading-xl">Провери глоби от МВР</Text>
                </InlineStack>

                <InsuranceStepLayout
                    form={
                        isDataCorrect ? (
                            <BlockStack gap="2000">
                                <Surface>
                                    <Box padding="1000">
                                        <BlockStack gap="800">
                                            <InlineStack gap="400">
                                                <Icon
                                                    icon={IconDocument}
                                                    size="600"
                                                />

                                                <Text variant="heading-m">
                                                    Резултат от проверка за
                                                    глоби
                                                </Text>
                                            </InlineStack>

                                            <MVRFinesCheckResults
                                                results={checkResults}
                                                onNewSearch={handleNewSearch}
                                            />
                                        </BlockStack>
                                    </Box>
                                </Surface>

                                <OptInForm
                                    results={checkResults}
                                    serviceType="mvr-fines-check"
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

                                            <MVRFinesCheckForm
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
                            ? "По-добре да знаеш навреме. Въведи данните и проверявам в КАТ за глоби."
                            : null
                    }
                    mascotImage={isDataCorrect ? CaptainBizoShield : null}
                />
            </BlockStack>
        </Page>
    );
};

export default AppLayout.wrap(MVRFinesCheck);
