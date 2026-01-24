/**
 * External dependencies
 */
import { Head } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import AppLayout from "@/layouts/app-layout/app-layout";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import Page from "@/components/page/page";
import IconPrivacyPolicy from "@/components/icons/privacy-policy";
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";

const PrivacyPolicy = () => {
    return (
        <Page>
            <Head title="Политика за защита на личните данни" />
            <BlockStack gap="800">
                <InlineStack gap="800" blockAlign="center">
                    <Icon icon={IconPrivacyPolicy} size="2000" />
                    <Text variant="heading-xl">
                        Политика за защита на личните данни
                    </Text>
                </InlineStack>

                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="600">
                            <Text variant="body-m">
                                Тук ще бъде публикуван текстът на политиката за
                                защита на личните данни на Bizo ООД.
                            </Text>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Page>
    );
};

export default AppLayout.wrap(PrivacyPolicy);
