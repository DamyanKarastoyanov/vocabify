/**
 * External dependencies
 */
import { useState } from "react";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import Button from "@/components/button/button";
import captainBizo from "@assets/CaptainBizo.png";
import IconPlateNumber from "@/components/icons/plate-number";
import Icon from "@/components/icon/icon";
import IconInstagram from "@/components/icons/instagram";
import IconFacebook from "@/components/icons/facebook";
import IconLinkedIn from "@/components/icons/linkedin";
import IconSocialX from "@/components/icons/social-x";
import HeroMobile from "./hero-mobile";

const Hero = () => {
    const route = useRoute();
    const [carNumber, setCarNumber] = useState("");

    const handleStartMTPLInsurance = () => {
        if (carNumber.trim()) {
            Object.keys(localStorage).forEach((key) => {
                if (key.includes("mtpl_insurance")) {
                    localStorage.removeItem(key);
                }
            });
            localStorage.setItem(
                "mtpl_insurance_form_data",
                JSON.stringify({
                    vehicleDataFormData: {
                        number: carNumber.trim(),
                        talon: "",
                    },
                }),
            );
            router.visit(route("mtpl-insurance"));
        }
    };

    return (
        <>
            {/* Desktop version */}
            <div className="bz-hero bz-hero--desktop">
                <div className="bz-hero__container">
                    <div className="bz-hero__content">
                        <BlockStack gap="1400">
                            <BlockStack gap="600">
                                <BlockStack>
                                    <InlineStack gap="200">
                                        <Text
                                            variant="heading-2xl"
                                            color="white"
                                        >
                                            Bizo - твоят{" "}
                                        </Text>

                                        <Text
                                            variant="heading-2xl"
                                            color="brand-600"
                                        >
                                            експерт{" "}
                                        </Text>
                                    </InlineStack>
                                    <Text variant="heading-2xl" color="white">
                                        в застраховането
                                    </Text>
                                </BlockStack>

                                <Box className="bz-hero__content-box">
                                    <Text variant="body-l" color="white">
                                        В Bizo.bg ще откриеш бързи и изгодни
                                        застраховки онлайн – лесен начин да
                                        сравниш оферти от водещи застрахователи
                                        и да сключиш полицата си за минути,
                                        изцяло дигитално.
                                    </Text>
                                </Box>
                            </BlockStack>

                            <BlockStack gap="300">
                                <Text
                                    variant="body-l"
                                    color="white"
                                    fontWeight="semibold"
                                >
                                    Започни с Гражданска отговорност
                                </Text>

                                <InlineStack gap="200" wrap={false}>
                                    <div className="bz-hero__input-wrapper">
                                        <div className="bz-hero__input-prefix">
                                            <Icon
                                                icon={IconPlateNumber}
                                                size="1300"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            className="bz-hero__input"
                                            placeholder="Номер на автомобила"
                                            value={carNumber}
                                            onChange={(e) =>
                                                setCarNumber(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleStartMTPLInsurance();
                                                }
                                            }}
                                        />
                                    </div>

                                    <Button onClick={handleStartMTPLInsurance}>
                                        Сравни цените
                                    </Button>
                                </InlineStack>
                            </BlockStack>
                        </BlockStack>
                    </div>

                    <div className="bz-hero__mascot">
                        <img src={captainBizo} alt="Captain Bizo" />
                    </div>
                </div>

                <div className="bz-hero__social">
                    <div className="bz-hero__social-line" />
                    <a href="#" className="bz-hero__social-icon">
                        <Icon icon={IconInstagram} size="400" color="white" />
                    </a>
                    <a href="#" className="bz-hero__social-icon">
                        <Icon icon={IconFacebook} size="400" color="white" />
                    </a>
                    <a href="#" className="bz-hero__social-icon">
                        <Icon icon={IconLinkedIn} size="400" color="white" />
                    </a>
                    <a href="#" className="bz-hero__social-icon">
                        <Icon icon={IconSocialX} size="400" color="white" />
                    </a>
                </div>
            </div>

            {/* Mobile version */}
            <HeroMobile />
        </>
    );
};

export default Hero;
