/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

const InsuranceCard = ({ id, title, label, icon: IconComponent, href }) => {
    const words = title.split(" ");
    let first, second;

    if (words.length > 2) {
        // If more than 2 words, first contains first 2 words, second contains the rest
        first = words.slice(0, 2).join(" ");
        second = words.slice(2).join(" ");
    } else {
        // If 2 or fewer words, keep original behavior
        [first, second] = words;
    }

    return (
        <Link href={href} className="bz-insurance-card">
            <div className="bz-insurance-card__header">
                <div className="bz-insurance-card__icon">{IconComponent}</div>
                <span className="bz-insurance-card__id">{id}</span>
            </div>

            <BlockStack gap="300">
                <BlockStack gap="100">
                    <Text variant="heading-m" color="text-primary">
                        {first}
                    </Text>

                    <Text variant="heading-m" color="text-primary">
                        {second}
                    </Text>
                </BlockStack>

                <Text variant="body-m" color="text-secondary">
                    {label}
                </Text>
            </BlockStack>
        </Link>
    );
};

const InsuranceCards = () => {
    const { mainNavItems } = useNavigationContext();
    const insuranceData = mainNavItems[1].children;

    return (
        <section className="bz-insurance-cards">
            <div className="bz-insurance-cards__container">
                <BlockStack gap="600">
                    <Text variant="heading-xl">Застраховане</Text>

                    <div className="bz-insurance-cards__grid">
                        {insuranceData.map((insurance, index) => {
                            const { key, ...insuranceProps } = insurance;
                            return (
                                <InsuranceCard
                                    key={key}
                                    id={"0" + (index + 1)}
                                    {...insuranceProps}
                                />
                            );
                        })}
                    </div>
                </BlockStack>
            </div>
        </section>
    );
};

export default InsuranceCards;
