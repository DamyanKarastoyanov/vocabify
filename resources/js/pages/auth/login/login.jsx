/**
 * External dependencies
 */
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Internal dependencies
 */
import Layout from '@/layouts/layout/layout';
import Box from '@/components/box/box';
import BlockStack from '@/components/block-stack/block-stack';
import Button from '@/components/button/button';
import Text from '@/components/text/text';
import TextInput from '@/components/text-input/text-input';
import FormLabel from '@/components/form-label/form-label';
import InlineStack from '@/components/inline-stack/inline-stack';

const Login = (props) => {
    const { errors: serverErrors = {}, status } = props;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/login',
            formData,
            {
                onError: (pageErrors) => {
                    setErrors(pageErrors);
                    setIsSubmitting(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const displayErrors = { ...errors, ...serverErrors };

    return (
        <>
            <Head title="Login" />
            <Box className="auth-login">
                <Box
                    maxWidth="400px"
                    width="100%"
                    dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}
                    paddingBlockStart="800"
                    paddingBlockEnd="800"
                    paddingInlineStart="600"
                    paddingInlineEnd="600"
                >
                    <BlockStack gap="600">
                        <Text
                            as="h1"
                            variant="heading-l"
                            fontWeight="bold"
                            align="center"
                        >
                            Login
                        </Text>

                        {status && (
                            <Box
                                padding="400"
                                backgroundColor="surface-100"
                                borderRadius="400"
                            >
                                <Text variant="body-m" color="text-primary">
                                    {status}
                                </Text>
                            </Box>
                        )}

                        <Box
                            as="form"
                            onSubmit={handleSubmit}
                            className="auth-login__form"
                        >
                            <BlockStack gap="500">
                                <BlockStack gap="300">
                                    <FormLabel htmlFor="email" required>
                                        Email
                                    </FormLabel>
                                    <TextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        error={displayErrors.email}
                                        disabled={isSubmitting}
                                        autoComplete="email"
                                    />
                                </BlockStack>

                                <BlockStack gap="300">
                                    <FormLabel htmlFor="password" required>
                                        Password
                                    </FormLabel>
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        error={displayErrors.password}
                                        disabled={isSubmitting}
                                        autoComplete="current-password"
                                    />
                                </BlockStack>

                                <InlineStack align="start" blockAlign="center" gap="300">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    <FormLabel htmlFor="remember">
                                        Remember me
                                    </FormLabel>
                                </InlineStack>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    width="100%"
                                >
                                    Login
                                </Button>
                            </BlockStack>
                        </Box>

                        <InlineStack align="center" blockAlign="center" gap="300">
                            <Text variant="body-m" color="text-secondary">
                                Don't have an account?
                            </Text>
                            <Text
                                as="a"
                                href="/register"
                                variant="body-m"
                                color="text-primary"
                                className="auth-login__register-link"
                            >
                                Sign up
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Box>
        </>
    );
};

export default Layout.wrap(Login);
