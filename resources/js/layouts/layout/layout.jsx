/**
 * External dependencies
 */
import { usePage, router, Link } from '@inertiajs/react';

/**
 * Internal dependencies
 */
import Box from '@/components/box/box';
import BlockStack from '@/components/block-stack/block-stack';
import InlineStack from '@/components/inline-stack/inline-stack';
import Text from '@/components/text/text';
import Button from '@/components/button/button';

const Layout = (props) => {
    const { children } = props;
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <Box minHeight="100vh" backgroundColor="surface-0" className="layout" width="100%" dangerouslySetInlineStyle={{ __style: { display: 'flex', flexDirection: 'column' } }}>
            {/* Header */}
            <Box as="header" className="layout-header" backgroundColor="surface-800" paddingBlockStart="400" paddingBlockEnd="400" paddingInlineStart="800" paddingInlineEnd="800">
                <Box maxWidth="1280px" width="100%" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                    <InlineStack align="space-between" blockAlign="center" gap="400">
                        <InlineStack align="start" blockAlign="center" gap="300">
                            <Box className="layout-header__logo">
                                <Text as="span" variant="heading-m" fontWeight="bold" color="text-inverse">
                                    Vocabify
                                </Text>
                            </Box>
                            <InlineStack gap="400" className="layout-header__nav">
                                {user && (
                                    <Link href="/datasets" className="layout-header__nav-link">
                                        <Text variant="body-m" color="text-inverse">
                                            Database
                                        </Text>
                                    </Link>
                                )}
                                <Link href="#" className="layout-header__nav-link">
                                    <Text variant="body-m" color="text-inverse">
                                        Research
                                    </Text>
                                </Link>
                                <Link href="#" className="layout-header__nav-link">
                                    <Text variant="body-m" color="text-inverse">
                                        About
                                    </Text>
                                </Link>
                                <Link href="#" className="layout-header__nav-link">
                                    <Text variant="body-m" color="text-inverse">
                                        Blog
                                    </Text>
                                </Link>
                            </InlineStack>
                        </InlineStack>
                        <InlineStack gap="300">
                            {user ? (
                                <>
                                    <Text variant="body-m" color="text-inverse" className="layout-header__user-name">
                                        {user.name}
                                    </Text>
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.post('/logout');
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit('/login');
                                        }}
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit('/register');
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </InlineStack>
                    </InlineStack>
                </Box>
            </Box>

            {/* Main Content */}
            <Box as="main" className="layout-main" dangerouslySetInlineStyle={{ __style: { flex: '1 1 auto' } }}>
                {children}
            </Box>

            {/* Footer */}
            <Box as="footer" className="layout-footer" backgroundColor="surface-900" paddingBlockStart="800" paddingBlockEnd="800" paddingInlineStart="800" paddingInlineEnd="800">
                <Box maxWidth="1280px" width="100%" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
                    <BlockStack gap="600">
                        <InlineStack gap="800" align="start" className="layout-footer__links">
                            <BlockStack gap="300">
                                <Text variant="body-m" fontWeight="semibold" color="text-inverse">About</Text>
                                <BlockStack gap="200">
                                    <Text as="a" href="#" variant="body-s" className="layout-footer__link">Company</Text>
                                    <Text as="a" href="#" variant="body-s" className="layout-footer__link">Careers</Text>
                                </BlockStack>
                            </BlockStack>
                            <BlockStack gap="300">
                                <Text variant="body-m" fontWeight="semibold" color="text-inverse">Support</Text>
                                <BlockStack gap="200">
                                    <Text as="a" href="#" variant="body-s" className="layout-footer__link">Help Center</Text>
                                    <Text as="a" href="#" variant="body-s" className="layout-footer__link">FAQs</Text>
                                </BlockStack>
                            </BlockStack>
                            <BlockStack gap="300">
                                <Text variant="body-m" fontWeight="semibold" color="text-inverse">Legal</Text>
                                <BlockStack gap="200">
                                    <Text as="a" href="#" variant="body-s" className="layout-footer__link">Privacy Policy</Text>
                                    <Text as="a" href="#" variant="body-s" className="layout-footer__link">Terms of Service</Text>
                                </BlockStack>
                            </BlockStack>
                        </InlineStack>
                        <InlineStack align="space-between" blockAlign="center" gap="400">
                            <Text variant="body-s" color="text-inverse" className="layout-footer__copyright">
                                ©2024 Vocabify. All rights reserved.
                            </Text>
                            <InlineStack gap="300" className="layout-footer__social">
                                <Text as="a" href="#" variant="body-m" color="text-inverse" className="layout-footer__social-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </Text>
                                <Text as="a" href="#" variant="body-m" color="text-inverse" className="layout-footer__social-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </Text>
                                <Text as="a" href="#" variant="body-m" color="text-inverse" className="layout-footer__social-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </Text>
                            </InlineStack>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Box>
        </Box>
    );
};

Layout.wrap = (Component) => {
    Component.layout = (page) => <Layout>{page}</Layout>;

    return Component;
};

export default Layout;
