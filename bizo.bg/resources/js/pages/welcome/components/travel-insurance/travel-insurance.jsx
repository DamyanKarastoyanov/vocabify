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
import CaptainBizoShield from "@assets/CaptainBizoShield.png";

const TravelInsurance = () => {
    return (
        <section className="bz-travel-insurance">
            <div className="bz-travel-insurance__container">
                <div className="bz-travel-insurance__mascot">
                    <img
                        src={CaptainBizoShield}
                        alt="Captain Bizo"
                        className="bz-travel-insurance__mascot-image"
                    />
                </div>

                <Box className="bz-travel-insurance__content">
                    <BlockStack gap="600">
                        <BlockStack gap="200">
                            <Text variant="heading-xl" color="text-primary">
                                Не можем да ти
                            </Text>

                            <Text variant="heading-xl" color="text-primary">
                                продадем крила, но сме
                            </Text>

                            <Text variant="heading-xl" color="text-primary">
                                близо.
                            </Text>
                        </BlockStack>

                        <Text variant="body-l" color="text-secondary">
                            Застраховай следващото си пътуване с bizo и се
                            чувствай подсигурен.
                        </Text>

                        <Box>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    router.visit(route("travel-insurance"))
                                }
                            >
                                Започни
                            </Button>
                        </Box>
                    </BlockStack>
                </Box>
            </div>
        </section>
    );
};

export default TravelInsurance;
