/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import BlockStack from "@/components/block-stack/block-stack";

const PolicyCta = () => {
    const route = useRoute();

    return (
        <section className="bz-policy-cta">
            <div className="bz-policy-cta__container">
                <div className="bz-policy-cta__content">
                    <BlockStack gap="300">
                        <Text variant="heading-xl">
                            Полица на един клик разстояние
                        </Text>

                        <Text variant="body-l" color="gray-400">
                            Онлайн полица за минута-две, Bizo прави
                            застраховането бързо и добре!
                        </Text>

                        <Link href={route("register")}>
                            <Button>Създай профил</Button>
                        </Link>
                    </BlockStack>
                </div>

                <div className="bz-policy-cta__device">
                    {/* iPad device mockup placeholder */}
                    <div className="bz-policy-cta__ipad" />
                </div>
            </div>
        </section>
    );
};

export default PolicyCta;
