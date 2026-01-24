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
import IconMTPLInsurance from "@/components/icons/mtpl-insurance";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import IconVehicleInspection from "@/components/icons/vehicle-inspection";
import VehicleInspectionForm from "@/pages/vehicle-inspection/components/vehicle-inspection-form";
import VehicleInspectionResults from "@/pages/vehicle-inspection/components/vehicle-inspection-results";
import OptInForm from "@/components/opt-in/opt-in-form";
import AdditionalServicesSection from "@/components/additional-services-section/additional-services-section";
import IconVignetteCheck from "@/components/icons/vignette-check";
import IconMVRFines from "@/components/icons/mvr-fines";
import CaptainBizoCar from "@assets/CaptainBizoCar.png";

const VehicleInspection = () => {
    const { seo } = usePage().props;
    const [inspectionResults, setInspectionResults] = useState(null);
    const isDataCorrect =
        inspectionResults?.success && !inspectionResults.raw_html;

    const handleNewSearch = () => {
        setInspectionResults(null);
    };

    const additionalServices = [
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

            <BlockStack gap="600" className="bz-vehicle-inspection-page">
                <InlineStack gap="400" blockAlign="center">
                    <Icon icon={IconVehicleInspection} size="2000" />

                    <Text variant="heading-xl">
                        Провери валидност на годишен технически преглед
                    </Text>
                </InlineStack>

                <InsuranceStepLayout
                    form={
                        <Box className="bz-vehicle-inspection-card">
                            {isDataCorrect ? (
                                <BlockStack gap="2000">
                                    <Surface>
                                        <Box padding="1000">
                                            <BlockStack gap="800">
                                                <InlineStack
                                                    gap="400"
                                                    wrap={false}
                                                >
                                                    <Icon
                                                        icon={IconDocument}
                                                        size="600"
                                                    />

                                                    <Text variant="heading-m">
                                                        Резултат от проверката
                                                        на ГТП
                                                    </Text>
                                                </InlineStack>

                                                <VehicleInspectionResults
                                                    results={inspectionResults}
                                                    onNewSearch={
                                                        handleNewSearch
                                                    }
                                                />
                                            </BlockStack>
                                        </Box>
                                    </Surface>

                                    <OptInForm
                                        results={inspectionResults}
                                        serviceType="vehicle-inspection"
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
                                                        Попълни данните
                                                    </Text>
                                                </InlineStack>

                                                <VehicleInspectionForm
                                                    setInspectionResults={
                                                        setInspectionResults
                                                    }
                                                />
                                            </BlockStack>
                                        </Box>
                                    </Surface>

                                    <AdditionalServicesSection
                                        services={additionalServices}
                                    />
                                </BlockStack>
                            )}
                        </Box>
                    }
                    showOfferDetails={false}
                    bubbleText={
                        !isDataCorrect
                            ? "Въведи номер на превозното средство и кода, който виждаш — останалото е моя работа!"
                            : null
                    }
                    mascotImage={isDataCorrect ? CaptainBizoCar : null}
                />
            </BlockStack>
        </Page>
    );
};

export default AppLayout.wrap(VehicleInspection);
