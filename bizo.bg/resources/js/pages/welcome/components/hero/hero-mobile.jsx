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
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import captainBizo from "@assets/CaptainBizo.png";
import IconPlateNumber from "@/components/icons/plate-number";
import Icon from "@/components/icon/icon";

const HeroMobile = () => {
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
        <div className="bz-hero bz-hero--mobile">
            <div className="bz-hero__container">
                {/* Mascot at the top for mobile */}
                <div className="bz-hero__mascot">
                    <img src={captainBizo} alt="Captain Bizo" />
                </div>

                <div className="bz-hero__content">
                    <BlockStack gap="600" align="center">
                        <BlockStack gap="700" align="center">
                            <BlockStack gap="100">
                                <Text
                                    variant="heading-2xl"
                                    color="white"
                                    align="center"
                                >
                                    Bizo - твоят
                                </Text>
                                <Text
                                    variant="heading-2xl"
                                    color="white"
                                    align="center"
                                >
                                    <Text
                                        variant="heading-2xl"
                                        color="brand-500"
                                        as="span"
                                        align="center"
                                    >
                                        експерт{" "}
                                    </Text>
                                    в
                                </Text>
                                <Text
                                    variant="heading-2xl"
                                    color="white"
                                    align="center"
                                >
                                    застраховането
                                </Text>
                            </BlockStack>

                            <Text
                                variant="body-l"
                                color="white"
                                fontWeight="semibold"
                                align="center"
                            >
                                Започни с Гражданска отговорност
                            </Text>
                        </BlockStack>

                        <BlockStack gap="400" align="center">
                            <div className="bz-hero__input-wrapper">
                                <div className="bz-hero__input-prefix">
                                    <Icon icon={IconPlateNumber} size="800" />
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

                            <Button
                                onClick={handleStartMTPLInsurance}
                                fullWidth
                            >
                                Сравни цените
                            </Button>
                        </BlockStack>
                    </BlockStack>
                </div>
            </div>
        </div>
    );
};

export default HeroMobile;
