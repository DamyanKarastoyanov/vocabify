/**
 * External dependencies
 */
import { Link, usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconLogoDark from "@/components/icons/logo-dark";
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import IconInstagram from "@/components/icons/instagram";
import IconFacebook from "@/components/icons/facebook";
import IconLinkedIn from "@/components/icons/linkedin";
import IconSocialX from "@/components/icons/social-x";
import Box from "@/components/box/box";

const Footer = () => {
    const { copyright } = usePage().props;

    return (
        <footer className="bz-footer">
            <div className="bz-footer__container">
                <div className="bz-footer__main">
                    <div className="bz-footer__left">
                        <BlockStack gap="400">
                            <BlockStack>
                                <Icon icon={IconLogoDark} size="1800" />
                                <Text variant="heading-s" color="text-primary">
                                    Бързи и Изгодни Застраховки Онлайн.
                                </Text>
                            </BlockStack>

                            <InlineStack gap="200">
                                <div className="bz-footer__social-icon">
                                    <Icon
                                        icon={IconInstagram}
                                        size="600"
                                        color="brand-500"
                                    />
                                </div>
                                <div className="bz-footer__social-icon">
                                    <Icon
                                        icon={IconFacebook}
                                        size="600"
                                        color="brand-500"
                                    />
                                </div>
                                <div className="bz-footer__social-icon">
                                    <Icon
                                        icon={IconLinkedIn}
                                        size="600"
                                        color="brand-500"
                                    />
                                </div>
                                <div className="bz-footer__social-icon">
                                    <Icon
                                        icon={IconSocialX}
                                        size="600"
                                        color="brand-500"
                                    />
                                </div>
                            </InlineStack>
                        </BlockStack>
                    </div>

                    <div className="bz-footer__right">
                        <BlockStack gap="300">
                            <Text variant="heading-m" color="text-primary">
                                Застраховане
                            </Text>
                            <BlockStack gap="100">
                                <Link href={route("mtpl-insurance")}>
                                    <Text
                                        variant="body-m"
                                        color="text-secondary"
                                        wrap={false}
                                    >
                                        Гражданска отговорност
                                    </Text>
                                </Link>

                                <Link href={route("home-insurance")}>
                                    <Text
                                        variant="body-m"
                                        color="text-secondary"
                                        wrap={false}
                                    >
                                        Застраховка имущество
                                    </Text>
                                </Link>

                                <Link href={route("non-resident-insurance")}>
                                    <Text
                                        variant="body-m"
                                        color="text-secondary"
                                        wrap={false}
                                    >
                                        Медицинска застраховка за чужденци
                                    </Text>
                                </Link>

                                <Link href={route("travel-insurance")}>
                                    <Text
                                        variant="body-m"
                                        color="text-secondary"
                                        wrap={false}
                                    >
                                        Застраховка при пътуване в чужбина
                                    </Text>
                                </Link>
                            </BlockStack>
                        </BlockStack>

                        <BlockStack gap="300">
                            <Text variant="heading-m" color="text-primary">
                                За нас
                            </Text>
                            <BlockStack gap="100">
                                <Text variant="body-m" color="text-secondary">
                                    За bizo
                                </Text>
                                <Text variant="body-m" color="text-secondary">
                                    Контакти
                                </Text>
                                <Link href={route("register")}>
                                    <Text
                                        variant="body-m"
                                        color="text-secondary"
                                    >
                                        Регистрация
                                    </Text>
                                </Link>
                            </BlockStack>
                        </BlockStack>
                    </div>
                </div>

                <div className="bz-footer__divider" />

                <div className="bz-footer__bottom">
                    <Text variant="body-xs" color="text-secondary">
                        {copyright}
                    </Text>
                    <InlineStack gap="600" blockAlign="center">
                        <Box>
                            <Link href={route("terms-and-conditions")}>
                                <Text variant="body-xs" color="brand-500">
                                    Общи условия
                                </Text>
                            </Link>
                        </Box>

                        <div className="bz-footer__dot" />

                        <Box>
                            <Link href={route("privacy-policy")}>
                                <Text variant="body-xs" color="brand-500">
                                    Политика за лични данни
                                </Text>
                            </Link>
                        </Box>
                    </InlineStack>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
