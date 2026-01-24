import React from "react";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Icon from "@/components/icon/icon";
import IconShield from "@/components/icons/shield";
import IconPayment from "@/components/icons/payment";
import IconEnvelope from "@/components/icons/envelope";
import IconSettings from "@/components/icons/settings";
import IconUser from "@/components/icons/user";
import { previewLinks } from "@/pages/admin/email-test/constants/preview-links";

const PreviewLinksSection = () => {
    const linkGroups = [
        {
            icon: IconShield,
            label: "Имейли за полици:",
            links: previewLinks.insurance,
        },
        {
            icon: IconPayment,
            label: "Имейли за плащания:",
            links: previewLinks.payment,
        },
        {
            icon: IconEnvelope,
            label: "Имейли за услуги:",
            links: previewLinks.services,
        },
        {
            icon: IconSettings,
            label: "Имейли за администратори:",
            links: previewLinks.admin,
        },
        {
            icon: IconUser,
            label: "Имейли за автентикация:",
            links: previewLinks.auth,
        },
    ];

    return (
        <BlockStack gap="500">
            <Box
                paddingInlineStart="400"
                dangerouslySetInlineStyle={{
                    __style: {
                        borderLeft: "4px solid var(--bz-color-brand-500)",
                    },
                }}
            >
                <Text variant="heading-s" color="text-primary">
                    Преглед на имейли
                </Text>
            </Box>
            {linkGroups.map((group, groupIndex) => (
                <InlineStack
                    key={groupIndex}
                    gap="300"
                    wrap
                    blockAlign="center"
                >
                    <InlineStack gap="200" blockAlign="center" wrap={false}>
                        <Icon icon={group.icon} size="900" color="brand-500" />
                        <Text
                            variant="body-m"
                            fontWeight="semibold"
                            color="text-primary"
                        >
                            {group.label}
                        </Text>
                    </InlineStack>
                    {group.links.map((link, index) => (
                        <Button
                            key={index}
                            href={link.url}
                            variant="outline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.label}
                        </Button>
                    ))}
                </InlineStack>
            ))}
        </BlockStack>
    );
};

export default PreviewLinksSection;
