/**
 * External dependencies
 */
import { useRoute } from "ziggy-js";
import { Link } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import MainNav from "@/components/main-nav/main-nav";
import Icon from "@/components/icon/icon";
import IconCaretDown from "@/components/icons/caret-down";
import Text from "@/components/text/text";
import BlockStack from "../block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Box from "@/components/box/box";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

/**
 * @type {Object[]}
 */

const AppMainNav = (props) => {
    const route = useRoute();
    const { mainNavItems } = useNavigationContext();

    const resolveNavigationItemHref = (item) => {
        if (item.href) {
            return item.route_params
                ? route(item.href, item.route_params)
                : route(item.href);
        }

        return "";
    };

    const render = (navigation_items) => {
        const updatedItems = navigation_items.map((item) => {
            if (item.href !== "") {
                const itemPathname = new URL(
                    resolveNavigationItemHref(item),
                    window.location.origin,
                ).pathname;
                item.current =
                    window.location.pathname.indexOf(itemPathname) !== -1;
            }

            if (item.children && item.children.length > 0) {
                item.children = item.children.map((child) => {
                    if (child.href !== "") {
                        const childPathname = new URL(
                            resolveNavigationItemHref(child),
                            window.location.origin,
                        ).pathname;
                        child.current =
                            window.location.pathname.indexOf(childPathname) !==
                            -1;

                        if (child.current) {
                            item.current = true;
                        }
                    }

                    return child;
                });
            }

            return item;
        });

        return (
            <MainNav.List>
                {updatedItems.map((item) => (
                    <MainNav.Item
                        key={item.key}
                        current={item.current}
                        onClick={item.onClick}
                    >
                        <MainNav.ItemLink
                            target={item.target}
                            href={resolveNavigationItemHref(item) || "#"}
                            icon={item.icon}
                            onClick={
                                item.children
                                    ? (e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                      }
                                    : undefined
                            }
                        >
                            {item.title}
                            {item.children && (
                                <Icon
                                    icon={IconCaretDown}
                                    color="brand-600"
                                    size="400"
                                />
                            )}
                        </MainNav.ItemLink>

                        {item.children && (
                            <MainNav.Popper>
                                <BlockStack>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.key}
                                            href={resolveNavigationItemHref(
                                                child,
                                            )}
                                            onClick={() => {
                                                if (
                                                    typeof document !==
                                                        "undefined" &&
                                                    document.activeElement &&
                                                    typeof document
                                                        .activeElement.blur ===
                                                        "function"
                                                ) {
                                                    document.activeElement.blur();
                                                }
                                            }}
                                        >
                                            <Box
                                                paddingInline="600"
                                                paddingBlock="200"
                                            >
                                                <InlineStack
                                                    gap="400"
                                                    align="start"
                                                >
                                                    <Icon
                                                        size="1100"
                                                        icon={child.icon}
                                                        color="purple-500"
                                                    />

                                                    <Text variant="body-m">
                                                        {child.title}
                                                    </Text>
                                                </InlineStack>
                                            </Box>
                                        </Link>
                                    ))}
                                </BlockStack>
                            </MainNav.Popper>
                        )}
                    </MainNav.Item>
                ))}
            </MainNav.List>
        );
    };

    return <MainNav {...props}>{render(mainNavItems)}</MainNav>;
};

export default AppMainNav;
