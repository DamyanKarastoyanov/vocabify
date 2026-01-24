/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import AppLayout from "@/layouts/app-layout/app-layout";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import SideNavigation from "@/components/side-navigation/side-navigation";
import Page from "@/components/page/page";
import HeaderBar from "@/components/header-bar/header-bar";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

const AuthenticatedLayout = (props) => {
    const { headerbarTitle } = props;
    const { sideNavigationItems, setHeaderBarTitle } = useNavigationContext();
    const { children } = props;
    const { url } = usePage();
    const route = useRoute();

    const getActiveItemByUrl = () => {
        const currentRouteName = route().current();
        return (
            sideNavigationItems.find(
                (item) => item.href === currentRouteName,
            ) || null
        );
    };

    const [activeItem, setActiveItem] = useState(getActiveItemByUrl());

    useEffect(() => {
        const matched = getActiveItemByUrl();
        setActiveItem(matched);
        if (!matched?.title) {
            setHeaderBarTitle(headerbarTitle);
        }
    }, [url, sideNavigationItems, headerbarTitle]);

    const handleSelectItem = (item) => {
        setActiveItem(item);
    };

    return (
        <Page>
            <Head title={activeItem?.title || headerbarTitle} />

            <InlineStack
                gap="1200"
                className="bz-authenticated-layout"
                blockAlign="start"
                wrap={false}
            >
                <SideNavigation
                    activeItem={activeItem}
                    handleSelectItem={handleSelectItem}
                />

                <BlockStack
                    className="bz-authenticated-layout__right-section"
                    gap="800"
                >
                    <HeaderBar activeItem={activeItem} />

                    <BlockStack
                        className="bz-authenticated-layout__main-content"
                        gap="400"
                    >
                        {children}
                    </BlockStack>
                </BlockStack>
            </InlineStack>
        </Page>
    );
};

AuthenticatedLayout.wrap = (Component, options = {}) => {
    const { headerbarTitle } = options;
    Component.layout = (page) => (
        <AppLayout>
            <AuthenticatedLayout headerbarTitle={headerbarTitle}>
                {page}
            </AuthenticatedLayout>
        </AppLayout>
    );

    return Component;
};

export default AuthenticatedLayout;
