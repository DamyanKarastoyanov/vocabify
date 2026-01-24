/**
 * External dependencies
 */
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Box from "@/components/box/box";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import BlockStack from "@/components/block-stack/block-stack";
import CaptainBizoCar from "@assets/CaptainBizoCar.png";

const CarInsurance = () => {
    return (
        <section className="bz-car-insurance">
            <div className="bz-car-insurance__container">
                <Box className="bz-car-insurance__content">
                    <BlockStack gap="600">
                        <Text variant="heading-xl" color="text-primary">
                            Нова кола?
                        </Text>

                        <Text variant="body-l" color="text-secondary">
                            Сключи гражданска застраховка още сега и карай
                            спокойно.
                            <br />
                            <br />С Bizo сключваш задължителна гражданска
                            отговорност за всяка марка и модел автомобил –
                            бързо, изгодно и изцяло онлайн. Покритието важи при
                            щети, причинени на трети лица при ПТП, така че
                            шофираш спокойно и със защита зад гърба си.
                        </Text>

                        <Box>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    router.visit(route("mtpl-insurance"))
                                }
                            >
                                Започни
                            </Button>
                        </Box>
                    </BlockStack>
                </Box>

                <div className="bz-car-insurance__mascot">
                    <img
                        src={CaptainBizoCar}
                        alt="Captain Bizo with car"
                        className="bz-car-insurance__mascot-image"
                    />
                </div>
            </div>
        </section>
    );
};

export default CarInsurance;
