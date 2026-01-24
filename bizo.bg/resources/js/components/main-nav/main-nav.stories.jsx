/**
 * External dependencies
 */
import { useMemo } from "react";

/**
 * Internal dependencies
 */
import Box from "@/components/box/box";
import MainNav from "@/components/main-nav/main-nav";
import MainNavVariantEnum from "@/components/main-nav/main-nav-variant-enum";

export default {
    title: "Global/MainNav",
    component: MainNav,
    argTypes: {
        mainNavItemVariant: {
            options: [MainNavVariantEnum.FULL, MainNavVariantEnum.COMPACT],
            control: { type: "radio" },
        },
    },
};

export const Default = {
    render: (args) => {
        const navItems = [
            { children: "Начало", key: "index", current: true },
            {
                children: "Застраховки",
                key: "insurances",
                subNav: [
                    { children: "Гражданска отговорност", key: "insurance" },
                    {
                        children: "Имотна застраховка",
                        key: "property-insurance",
                    },
                    { children: "Авто каско", key: "car-insurance" },
                    { children: "Здравна застраховка", key: "life-insurance" },
                ],
            },

            { children: "Услуги", key: "services" },
            { children: "Контакти", key: "contacts" },
            { children: "BG", key: "bg" },
        ];

        const mapNavItems = (items) => (
            <MainNav.List>
                {items.map((item) => (
                    <MainNav.Item key={item.key} current={item.current}>
                        <MainNav.ItemLink href="#">
                            {item.children}
                        </MainNav.ItemLink>

                        {item.subNav && mapNavItems(item.subNav)}
                    </MainNav.Item>
                ))}
            </MainNav.List>
        );

        const mainNavItems = useMemo(() => mapNavItems(navItems), [navItems]);

        return (
            <Box width="fit-content">
                <MainNav variant={args.mainNavItemVariant}>
                    {mainNavItems}
                </MainNav>
            </Box>
        );
    },
};
