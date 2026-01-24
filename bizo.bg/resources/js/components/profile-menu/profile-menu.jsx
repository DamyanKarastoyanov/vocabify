/**
 * External dependencies
 */
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import IconUser from "@/components/icons/user";
import Icon from "@/components/icon/icon";
import IconRightArrow from "@/components/icons/right-arrow";
import Menu from "@/components/menu/menu";
import IconButton from "@/components/icon-button/icon-button";
import IconMenu from "@/components/icons/menu";
import BlockStack from "@/components/block-stack/block-stack";
import SideNavigation from "@/components/side-navigation/side-navigation";
import Divider from "@/components/divider/divider";
import { ensureIndexHash, stripHash } from "@/utils/hash-utils";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

const ProfileMenu = (props) => {
    const { name } = props;
    const { mainNavItems, profileMenuItems } = useNavigationContext();

    const renderSimpleMenuItem = (item) => {
        return (
            <Menu.Item
                key={item.key}
                onClick={() =>
                    router.visit(route(item.href), { onFinish: stripHash })
                }
            >
                <InlineStack
                    align="space-between"
                    blockAlign="center"
                    gap="300"
                    className="bz-profile-menu__navigation-menu-item"
                >
                    <Text variant="heading-s">{item.title}</Text>
                </InlineStack>
            </Menu.Item>
        );
    };

    const NestedMenuItem = ({ item }) => {
        const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

        return (
            <>
                <Menu.Item
                    key={item.key}
                    hasSubChildren
                    onClick={() => {
                        setIsSubMenuOpen((prev) => !prev);
                    }}
                >
                    <InlineStack
                        align="space-between"
                        blockAlign="center"
                        gap="300"
                        className="bz-profile-menu__navigation-menu-item"
                    >
                        <Text variant="heading-s">{item.title}</Text>
                        {item.children ? (
                            <Icon
                                icon={IconRightArrow}
                                className={`bz-profile-menu__navigation-menu-item-arrow-${isSubMenuOpen ? "up" : "down"}-icon`}
                                size="300"
                            />
                        ) : null}
                    </InlineStack>
                </Menu.Item>
                {isSubMenuOpen && (
                    <>
                        {item.children.map((child) => (
                            <Menu.Item
                                key={child.key}
                                onClick={() =>
                                    router.visit(route(child.href), {
                                        onFinish: stripHash,
                                    })
                                }
                            >
                                <Link>
                                    <InlineStack
                                        blockAlign="center"
                                        gap="300"
                                        wrap={false}
                                        className="item-title-holder"
                                    >
                                        {child.icon && (
                                            <Icon
                                                icon={child.icon}
                                                className="item-title-holder-icon"
                                                size="500"
                                            />
                                        )}
                                        <Text>{child.title}</Text>
                                    </InlineStack>
                                </Link>
                            </Menu.Item>
                        ))}
                    </>
                )}
            </>
        );
    };

    const renderProfileMenuItem = (item) => {
        return (
            <Menu.Item
                key={item.key}
                onClick={() => {
                    // we need unique handling on logout
                    if (item.href === "logout") {
                        router.post(route("logout"));
                    } else {
                        router.visit(route(item.href), {
                            onFinish: ensureIndexHash,
                        });
                    }
                }}
            >
                <InlineStack blockAlign="center" gap="300">
                    <Icon icon={item.icon} size="500" />

                    <Text fontWeight="regular">{item.title}</Text>
                </InlineStack>
            </Menu.Item>
        );
    };

    return (
        <InlineStack gap="300" blockAlign="center" className="bz-profile-menu">
            <BlockStack>
                <Menu placement="bottom-middle">
                    <Menu.Trigger>
                        <IconButton
                            className="bz-profile-menu__navigation-icon"
                            icon={IconMenu}
                            size="500"
                        />
                    </Menu.Trigger>
                    <Menu.Popover className="bz-profile-menu__navigation-menu">
                        <BlockStack className="bz-profile-menu__navigation-menu-list">
                            <Menu.List>
                                {mainNavItems.map((item) =>
                                    item.children ? (
                                        <NestedMenuItem
                                            key={item.key}
                                            item={item}
                                        />
                                    ) : (
                                        renderSimpleMenuItem(item)
                                    ),
                                )}

                                <Divider className="bz-profile-menu__navigation-menu-divider" />

                                <SideNavigation variant="mobile" />
                            </Menu.List>
                        </BlockStack>
                    </Menu.Popover>
                </Menu>
            </BlockStack>
            <Menu>
                <Menu.Trigger>
                    <InlineStack
                        blockAlign="center"
                        gap="300"
                        className="bz-profile-menu__user-navigation"
                    >
                        <Icon icon={IconUser} size="800" />

                        <Text fontWeight="light" variant="heading-s">
                            {name}
                        </Text>
                    </InlineStack>
                </Menu.Trigger>
                <Menu.Popover className="bz-profile-menu__user-navigation-menu">
                    <Menu.List>
                        {profileMenuItems.map((item) =>
                            renderProfileMenuItem(item),
                        )}
                    </Menu.List>
                </Menu.Popover>
            </Menu>
        </InlineStack>
    );
};

export default ProfileMenu;
