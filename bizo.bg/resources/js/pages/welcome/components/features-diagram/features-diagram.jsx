/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import IconDiagramWithDots from "@/components/icons/diagram-with-dots";
import IconDiagramMobile from "@/components/icons/diagram-mobile";
import IconFeatureChart from "@/components/icons/feature-chart";
import IconFeatureGlobe from "@/components/icons/feature-globe";
import IconFeatureSpeed from "@/components/icons/feature-speed";
import IconFeatureSecurity from "@/components/icons/feature-security";
import IconFeatureCommunity from "@/components/icons/feature-community";
import IconElipse from "@/components/icons/elipse";
import IconMarker from "@/components/icons/marker";

/**
 * Text features positioned to match the IconDiagramWithDots SVG
 * SVG viewBox: 1224x522, icons are now rendered as separate JSX components
 */
const features = [
    {
        id: 1,
        title: "Спести време и пари.",
        description:
            "Сравни оферти от водещи застрахователи и избери най-добрата за секунди.",
        position: { top: "15%", right: "-2%", transform: "translateX(-50%)" },
        icon: IconFeatureChart,
        maxWidth: "22.5rem",
        align: "left",
    },
    {
        id: 2,
        title: "Всичко, което може да застраховаш и още нещо.",
        position: { top: "16%", left: "29.5%", transform: "translateX(-50%)" },
        icon: IconElipse,
        maxWidth: "16.25rem",
        align: "right",
    },
    {
        id: 3,
        title: "Всичко онлайн.",
        description: "Без излишна хартия.",
        position: { top: "37%", right: "6%" },
        icon: IconFeatureGlobe,
        maxWidth: "15rem",
        align: "left",
    },
    {
        id: 4,
        title: "Най-добри цени",
        position: { bottom: "24%", left: "23.5%" },
        maxWidth: "12.5rem",
        align: "right",
        icon: IconElipse,
    },
    {
        id: 5,
        title: "Най-бързият процес за купуване на застраховка в България.",
        description: "Можеш да сключиш гражданска отговорност с няколко клика!",
        position: { bottom: "15%", right: "12%" },
        icon: IconFeatureSpeed,
        maxWidth: "21.75rem",
        align: "left",
    },
    {
        id: 6,
        title: "Поддръжка от… хора.",
        description: "Тук сме за теб.",
        position: { bottom: "37%", left: "3%" },
        icon: IconFeatureCommunity,
        maxWidth: "16rem",
        align: "right",
    },
    {
        id: 7,
        title: "Платформа удобна за всеки.",
        position: { top: "54%", right: "5%" },
        maxWidth: "12.5rem",
        align: "left",
        icon: IconElipse,
    },
    {
        id: 8,
        title: "Доверие и сигурност.",
        description: "Градим отношения с клиентите си всеки ден.",
        position: { top: "30%", left: "15%" },
        icon: IconFeatureSecurity,
        maxWidth: "15.5rem",
        align: "right",
    },
];

/**
 * Features list for mobile - simple vertical layout
 */
const featuresMobile = [
    {
        id: 1,
        title: "Доверие и сигурност.",
        description: "Градим отношения с клиентите си всеки ден.",
    },
    {
        id: 2,
        title: "Спести време и пари.",
        description:
            "Сравни оферти от водещи застрахователи и избери най-добрата за секунди.",
    },
    {
        id: 3,
        title: "Поддръжка от… хора.",
        description: "Тук сме за теб.",
    },
    {
        id: 4,
        title: "Всичко онлайн.",
        description: "Без излишна хартия.",
    },
    {
        id: 5,
        title: "Най-бързият процес за купуване на застраховка в България.",
        description: "Можеш да сключиш гражданска отговорност с няколко клика!",
    },
    {
        id: 6,
        title: "Всичко, което може да застраховаш и още нещо.",
        description: null,
    },
    {
        id: 7,
        title: "Платформа удобна за всеки.",
        description: null,
    },
    {
        id: 8,
        title: "Най-добри цени",
        description: null,
    },
];

const FeaturesDiagram = () => {
    return (
        <>
            {/* Desktop/Tablet version */}
            <section className="bz-features-diagram bz-features-diagram--desktop">
                <div className="bz-features-diagram__container">
                    {/* Background SVG with paths and center logo only */}
                    <div className="bz-features-diagram__svg-background">
                        {IconDiagramWithDots}
                    </div>

                    {/* Text labels positioned around the diagram */}
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={`bz-features-diagram__feature ${feature.align === "center" ? "bz-features-diagram__feature--centered" : ""}`}
                            data-feature-id={feature.id}
                            style={{
                                ...feature.position,
                                maxWidth: feature.maxWidth,
                            }}
                        >
                            <InlineStack
                                gap="400"
                                wrap={false}
                                blockAlign="center"
                            >
                                {feature.align == "left" && feature.icon && (
                                    <Icon size={56} icon={feature.icon} />
                                )}

                                <div
                                    className="bz-features-diagram__content"
                                    align={feature.align}
                                >
                                    <Text
                                        variant="heading-s"
                                        color="text-primary"
                                    >
                                        {feature.title}
                                    </Text>
                                    {feature.description && (
                                        <Text
                                            variant="body-m"
                                            color="text-secondary"
                                        >
                                            {feature.description}
                                        </Text>
                                    )}
                                </div>

                                {feature.align == "right" && feature.icon && (
                                    <Icon size={56} icon={feature.icon} />
                                )}
                            </InlineStack>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mobile version */}
            <section className="bz-features-diagram bz-features-diagram--mobile">
                <div className="bz-features-diagram__mobile-svg-background">
                    {IconDiagramMobile}
                </div>

                <div className="bz-features-diagram__mobile-container">
                    <BlockStack gap="400">
                        {featuresMobile.map((feature) => (
                            <div
                                key={feature.id}
                                className="bz-features-diagram__mobile-feature"
                            >
                                <InlineStack
                                    gap="400"
                                    wrap={false}
                                    blockAlign="start"
                                >
                                    <div className="bz-features-diagram__mobile-icon">
                                        <Icon icon={IconMarker} size="600" />
                                    </div>
                                    <BlockStack gap="0">
                                        <Text
                                            variant="heading-s"
                                            color="text-primary"
                                        >
                                            {feature.title}
                                        </Text>
                                        {feature.description && (
                                            <Text
                                                variant="body-m"
                                                color="text-secondary"
                                            >
                                                {feature.description}
                                            </Text>
                                        )}
                                    </BlockStack>
                                </InlineStack>
                            </div>
                        ))}
                    </BlockStack>
                </div>
            </section>
        </>
    );
};

export default FeaturesDiagram;
