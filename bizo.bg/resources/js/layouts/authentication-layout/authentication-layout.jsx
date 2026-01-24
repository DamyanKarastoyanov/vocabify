/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Page from "@/components/page/page";
import AppLayout from "@/layouts/app-layout/app-layout";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";

const AuthenticationLayout = (props) => {
    const { children, title } = props;

    return (
        <Page>
            <Head title={title || ""} />

            <BlockStack gap="600" className="bz-authentication-layout">
                {title && (
                    <Text variant="heading-m" align="center">
                        {title || ""}
                    </Text>
                )}

                {children}
            </BlockStack>
        </Page>
    );
};

AuthenticationLayout.wrap = (Component, title) => {
    Component.layout = (page) => (
        <AppLayout>
            <AuthenticationLayout title={title}>{page}</AuthenticationLayout>
        </AppLayout>
    );

    return Component;
};

export default AuthenticationLayout;
