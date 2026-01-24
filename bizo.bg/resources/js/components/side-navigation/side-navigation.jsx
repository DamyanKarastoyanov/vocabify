/**
 * External dependencies
 */
import React from "react";
import { Link, router } from "@inertiajs/react";
/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import MainNav from "@/components/main-nav/main-nav";
import Menu from "@/components/menu/menu";
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";
import { ensureIndexHash, withIndexHash } from "@/utils/hash-utils";
import IconCaretRight from "@/components/icons/caret-right";

const SideNavigation = (props) => {
    const { activeItem, handleSelectItem, variant = "desktop" } = props;
    const { sideNavigationItems, mainNavItems } = useNavigationContext();

    const mainNavItemKeys = new Set(mainNavItems.map((navItem) => navItem.key));

    const handleRedirect = (item, options = {}) => {
        const { applyIndexHash = true } = options;
        if (applyIndexHash) {
            router.visit(route(item.href), {
                onFinish: ensureIndexHash,
            });
        } else {
            router.visit(route(item.href));
        }
        handleSelectItem(item);
    };

    const renderMainNavList = (list) => {
        if (list.length === 0) {
            return null;
        }

        const MenuWrapper = ({ children, item }) => {
            if (!item.children?.length) {
                return children;
            }

            return (
                <Menu placement="right-start" triggerEventType="hover">
                    <Menu.Trigger asChild>{children}</Menu.Trigger>
                    <Menu.Popover>
                        <Menu.List>
                            {item.children.map((child) => {
                                return (
                                    <Menu.Item
                                        key={child.key}
                                        onClick={() =>
                                            handleRedirect(child, {
                                                applyIndexHash: false,
                                            })
                                        }
                                    >
                                        <InlineStack
                                            blockAlign="center"
                                            gap="300"
                                        >
                                            <Icon
                                                icon={child.icon}
                                                size="500"
                                            />
                                            <Text variant="body-m">
                                                {child.title}
                                            </Text>
                                        </InlineStack>
                                    </Menu.Item>
                                );
                            })}
                        </Menu.List>
                    </Menu.Popover>
                </Menu>
            );
        };

        return (
            <BlockStack>
                <MainNav.List>
                    {list.map((item) => {
                        return (
                            <MenuWrapper item={item} key={item.key}>
                                <MainNav.Item
                                    onClick={() => handleRedirect(item)}
                                    current={activeItem?.key === item.key}
                                >
                                    <MainNav.ItemLink>
                                        <InlineStack
                                            align="start"
                                            blockAlign="center"
                                            gap="400"
                                            className="bz-main-nav__item-link-content"
                                        >
                                            <Icon
                                                className="bz-main-nav__item-page-icon"
                                                icon={item.icon}
                                                size="400"
                                            />

                                            <Text
                                                variant="heading-s"
                                                weight="bold"
                                            >
                                                {item.title}
                                            </Text>

                                            {item.children && (
                                                <Icon
                                                    className="bz-main-nav__item-submenu-icon"
                                                    icon={IconCaretRight}
                                                    size="400"
                                                />
                                            )}
                                        </InlineStack>
                                    </MainNav.ItemLink>
                                </MainNav.Item>
                            </MenuWrapper>
                        );
                    })}
                </MainNav.List>
            </BlockStack>
        );
    };

    const renderSandwichMenu = (list) => {
        return (
            <>
                {list.map((item) => {
                    if (mainNavItemKeys.has(item.key)) {
                        return null;
                    }
                    return (
                        <Menu.Item key={`${item.key}_item`}>
                            <Link href={withIndexHash(route(item.href))}>
                                <InlineStack
                                    blockAlign="center"
                                    gap="300"
                                    className="bz-side-navigation-menu-item"
                                    wrap={false}
                                >
                                    <Icon icon={item.icon} size="500" />

                                    <Text variant="heading-s">
                                        {item.title}
                                    </Text>
                                </InlineStack>
                            </Link>
                        </Menu.Item>
                    );
                })}
            </>
        );
    };

    if (variant === "desktop") {
        return (
            <BlockStack className="bz-side-navigation__container" gap="200">
                <MainNav className="bz-side-navigation-main-nav">
                    {renderMainNavList(sideNavigationItems)}
                </MainNav>
            </BlockStack>
        );
    } else {
        return <>{renderSandwichMenu(sideNavigationItems)}</>;
    }
};

export default SideNavigation;
