/**
 * External dependencies
 */
import { usePage, router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import classNames from "classnames";
import { useState, useEffect } from "react";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import IconLogoDark from "@/components/icons/logo-dark";
import Box from "@/components/box/box";
import AppMainNav from "@/components/app-main-nav/app-main-nav";
import ProfileButtons from "@/components/profile-buttons/profile-buttons";
import ProfileMenu from "@/components/profile-menu/profile-menu";
import IconButton from "@/components/icon-button/icon-button";
import LanguagePicker from "@/components/language-picker/language-picker";
import Divider from "@/components/divider/divider";
import DividerOrientationEnum from "@/components/divider/divider-orientation-enum";
import BlockStack from "@/components/block-stack/block-stack";
import Icon from "@/components/icon/icon";
import IconMenu from "@/components/icons/menu";
import IconUser from "@/components/icons/user";
import IconCaretDown from "@/components/icons/caret-down";
import IconCaretUp from "@/components/icons/caret-up";
import IconLeftArrowPlain from "@/components/icons/left-arrow-plain";
import Text from "@/components/text/text";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

const AppBar = () => {
    const { auth } = usePage().props;
    const route = useRoute();
    const { mainNavItems, mobileNavigationItems, profileMenuItems } =
        useNavigationContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenuItems, setExpandedMenuItems] = useState({});
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isProfileDropdownOpen &&
                !event.target.closest(".bz-app-bar__mobile-profile-wrapper")
            ) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const isAuthenticated = Boolean(auth.user?.id);
    const isHomePage = usePage().url === "/";

    const profileMenuProps = isAuthenticated
        ? {
              name: `${auth.user.first_name || ""} ${auth.user.last_name || ""}`,
          }
        : null;

    const toggleMenuItem = (key) => {
        setExpandedMenuItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleMenuItemClick = (item) => {
        if (item.children) {
            toggleMenuItem(item.key);
        } else {
            router.visit(route(item.href));
            setIsMobileMenuOpen(false);
        }
    };

    const handleSubItemClick = (child) => {
        router.visit(route(child.href));
        setIsMobileMenuOpen(false);
    };

    const handleProfileMenuItemClick = (item) => {
        if (item.href === "logout") {
            router.post(route("logout"));
        } else {
            router.visit(route(item.href));
        }
        setIsProfileDropdownOpen(false);
    };

    return (
        <Box className="bz-app-bar">
            {/* Mobile Header Layout */}
            <div className="bz-app-bar__mobile">
                <IconButton
                    icon={IconMenu}
                    onClick={() => {
                        setIsMobileMenuOpen(true);
                        setIsProfileDropdownOpen(false);
                    }}
                    aria-label="Open menu"
                    variant="tertiary"
                    size="600"
                />

                <IconButton
                    icon={IconLogoDark}
                    onClick={() => router.visit("/")}
                    aria-label="Go to home"
                    size="1800"
                />

                <div className="bz-app-bar__mobile-profile-wrapper">
                    <IconButton
                        icon={IconUser}
                        onClick={() => {
                            if (isAuthenticated) {
                                setIsProfileDropdownOpen(
                                    !isProfileDropdownOpen,
                                );
                            } else {
                                router.visit("/login");
                            }
                        }}
                        aria-label={
                            isAuthenticated ? "Open profile menu" : "Login"
                        }
                        variant="tertiary"
                        size="800"
                    />
                    {isAuthenticated && isProfileDropdownOpen && (
                        <div className="bz-app-bar__mobile-profile-dropdown">
                            {profileMenuItems.map((item) => (
                                <button
                                    key={item.key}
                                    className="bz-app-bar__mobile-profile-menu-item"
                                    onClick={() =>
                                        handleProfileMenuItemClick(item)
                                    }
                                >
                                    {item.icon && (
                                        <Icon
                                            icon={item.icon}
                                            size="500"
                                            className="bz-app-bar__mobile-profile-menu-item-icon"
                                        />
                                    )}
                                    <Text>{item.title}</Text>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Full-screen Mobile Menu */}
            <div
                className={classNames("bz-app-bar__mobile-fullscreen-menu", {
                    "bz-app-bar__mobile-fullscreen-menu--open":
                        isMobileMenuOpen,
                })}
            >
                {/* Menu Header */}
                <div className="bz-app-bar__mobile-fullscreen-menu-header">
                    <IconButton
                        icon={IconLeftArrowPlain}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                        variant="tertiary"
                        size="400"
                    />

                    <IconButton
                        icon={IconLogoDark}
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.visit("/");
                        }}
                        aria-label="Go to home"
                        size="1800"
                    />

                    <div className="bz-app-bar__mobile-fullscreen-menu-header-spacer" />
                </div>

                {/* Menu Content */}
                <div className="bz-app-bar__mobile-fullscreen-menu-content">
                    <BlockStack gap="0">
                        {mobileNavigationItems.map((item) => (
                            <div
                                key={item.key}
                                className="bz-app-bar__mobile-menu-section"
                            >
                                {/* Main menu item */}
                                <button
                                    className="bz-app-bar__mobile-menu-item"
                                    onClick={() => handleMenuItemClick(item)}
                                >
                                    <Text variant="heading-s">
                                        {item.title}
                                    </Text>
                                    {item.children && (
                                        <Icon
                                            icon={
                                                expandedMenuItems[item.key]
                                                    ? IconCaretUp
                                                    : IconCaretDown
                                            }
                                            size="500"
                                            className="bz-app-bar__mobile-menu-item-arrow"
                                        />
                                    )}
                                </button>

                                {/* Sub-items */}
                                {item.children &&
                                    expandedMenuItems[item.key] && (
                                        <div className="bz-app-bar__mobile-menu-subitems">
                                            {item.children.map((child) => (
                                                <button
                                                    key={child.key}
                                                    className="bz-app-bar__mobile-menu-subitem"
                                                    onClick={() =>
                                                        handleSubItemClick(
                                                            child,
                                                        )
                                                    }
                                                >
                                                    {child.icon && (
                                                        <Icon
                                                            icon={child.icon}
                                                            size="800"
                                                            className="bz-app-bar__mobile-menu-subitem-icon"
                                                        />
                                                    )}
                                                    <Text>{child.title}</Text>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </BlockStack>
                </div>

                {/* Language Picker at Bottom 
                <div className="bz-app-bar__mobile-fullscreen-menu-footer">
                    <LanguagePicker variant="flags" />
                </div>*/}
            </div>

            {/* Desktop/Tablet Header Layout */}
            <InlineStack
                align="space-between"
                gap="600"
                wrap={false}
                className="bz-app-bar__desktop"
            >
                <InlineStack
                    blockAlign="center"
                    align="left"
                    gap="1000"
                    wrap={false}
                >
                    <IconButton
                        icon={IconLogoDark}
                        onClick={() => router.visit("/")}
                        size="1800"
                    />

                    <div className="bz-app-bar__desktop-nav">
                        <AppMainNav key={usePage().url} />
                    </div>
                </InlineStack>

                <InlineStack gap="600" blockAlign="center" wrap={false}>
                    {/*<div className="bz-app-bar__language-picker">
                        <LanguagePicker />
                    </div>

                    <Divider orientation={DividerOrientationEnum.VERTICAL} /> */}

                    {/* Desktop Profile Buttons */}
                    <div className="bz-app-bar__profile">
                        {isAuthenticated ? (
                            <ProfileMenu {...profileMenuProps} />
                        ) : (
                            <ProfileButtons />
                        )}
                    </div>
                </InlineStack>
            </InlineStack>
        </Box>
    );
};

export default AppBar;
