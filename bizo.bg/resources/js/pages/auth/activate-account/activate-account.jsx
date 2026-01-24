/**
 * External dependencies
 */
import { Head } from "@inertiajs/react";

/**
 * Internal dependencies
 */

import BlockStack from "@/components/block-stack/block-stack";
import Page from "@/components/page/page";
import Surface from "@/components/surface/surface";
import AppLayout from "@/layouts/app-layout/app-layout";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import IconEnvelope from "@/components/icons/envelope";
import Icon from "@/components/icon/icon";
import Box from "@/components/box/box";

const ActivateAccount = () => {
    return (
        <Page>
            <Head title="Email Verification" />

            <BlockStack gap="600" className="bz-activate-account-message">
                <Surface>
                    <Box padding="1000">
                        <InlineStack rowGap="600" wrap={false} gap="400">
                            <Icon icon={IconEnvelope} size="2000" />

                            <Text variant="body-m" align="center">
                                Имейл за активиране на акаунта е изпратен на
                                вашия имейл адрес. Моля, проверете вашата поща и
                                следвайте инструкциите за активиране на вашия
                                акаунт.
                            </Text>
                        </InlineStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Page>
    );
};

export default AppLayout.wrap(ActivateAccount);
