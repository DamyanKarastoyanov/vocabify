/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";

const AdditionalServicesSection = (props) => {
    const { services = [] } = props;

    if (!services || services.length === 0) {
        return null;
    }

    return (
        <BlockStack gap="600" className="bz-additional-services-section">
            <Text variant="heading-l">Допълнителни услуги</Text>

            <InlineStack
                gap="600"
                className="bz-additional-services-section__cards"
            >
                {services.map((service, index) => {
                    const cardContent = (
                        <Surface className="bz-additional-services-section__card">
                            <Box paddingBlock="800" paddingInline="600">
                                <BlockStack gap="600">
                                    {service.icon && (
                                        <Box>
                                            <Icon
                                                icon={service.icon}
                                                size="3200"
                                                className="bz-additional-services-section__icon"
                                            />
                                        </Box>
                                    )}

                                    {service.title && (
                                        <Text
                                            variant="heading-m"
                                            color="text-primary"
                                        >
                                            {service.title}
                                        </Text>
                                    )}

                                    {service.description && (
                                        <Text
                                            variant="body-m"
                                            color="text-secondary"
                                        >
                                            {service.description}
                                        </Text>
                                    )}
                                </BlockStack>
                            </Box>
                        </Surface>
                    );

                    if (service.href) {
                        return (
                            <Link
                                key={service.key || index}
                                href={service.href}
                                className="bz-additional-services-section__card-link"
                            >
                                {cardContent}
                            </Link>
                        );
                    }

                    if (service.onClick) {
                        return (
                            <Box
                                key={service.key || index}
                                className="bz-additional-services-section__card-wrapper"
                                onClick={service.onClick}
                            >
                                {cardContent}
                            </Box>
                        );
                    }

                    return (
                        <Box
                            key={service.key || index}
                            className="bz-additional-services-section__card-wrapper"
                        >
                            {cardContent}
                        </Box>
                    );
                })}
            </InlineStack>
        </BlockStack>
    );
};

export default AdditionalServicesSection;
