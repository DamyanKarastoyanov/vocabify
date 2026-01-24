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

const AdminLayout = (props) => {
    const { sideNavigationItems } = useNavigationContext();
    const { children } = props;
    const route = useRoute();

    const getActiveItemByUrl = () => {
        const currentRouteName = route().current();
        return sideNavigationItems.find(
            (item) => item.href === currentRouteName,
        );
    };

    const [activeItem, setActiveItem] = useState(getActiveItemByUrl());

    useEffect(() => {
        setActiveItem(getActiveItemByUrl());
    }, [sideNavigationItems]);

    const handleSelectItem = (item) => {
        setActiveItem(item);
    };

    return (
        <Page>
            <Head title={activeItem?.title || "Администратор"} />

            <InlineStack
                gap="700"
                className="bz-admin-layout"
                blockAlign="start"
                wrap={false}
            >
                <SideNavigation
                    activeItem={activeItem}
                    handleSelectItem={handleSelectItem}
                />

                <BlockStack
                    className="bz-admin-layout__right-section"
                    gap="800"
                >
                    <HeaderBar activeItem={activeItem} />

                    <BlockStack
                        className="bz-admin-layout__main-content"
                        gap="400"
                    >
                        {children}
                    </BlockStack>
                </BlockStack>
            </InlineStack>
        </Page>
    );
};

AdminLayout.wrap = (Component) => {
    Component.layout = (page) => (
        <AppLayout>
            <AdminLayout>{page}</AdminLayout>
        </AppLayout>
    );

    return Component;
};

export default AdminLayout;
