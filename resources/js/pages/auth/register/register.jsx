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

const Register = (props) => {
    const { errors: serverErrors = {} } = props;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required.';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters.';
        } else if (formData.name.trim().length > 255) {
            newErrors.name = 'Name must not exceed 255 characters.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'Please confirm your password.';
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (name === 'password_confirmation' && formData.password) {
            if (value !== formData.password) {
                setErrors((prev) => ({
                    ...prev,
                    password_confirmation: 'Passwords do not match.',
                }));
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.password_confirmation;
                    return newErrors;
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/register',
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
            <Head title="Register" />
            <Box className="auth-register">
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
                            Create Account
                        </Text>

                        <Box
                            as="form"
                            onSubmit={handleSubmit}
                            className="auth-register__form"
                        >
                            <BlockStack gap="500">
                                <BlockStack gap="300">
                                    <FormLabel htmlFor="name" required>
                                        Name
                                    </FormLabel>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        error={displayErrors.name}
                                        disabled={isSubmitting}
                                        autoComplete="name"
                                    />
                                </BlockStack>

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
                                        autoComplete="new-password"
                                    />
                                </BlockStack>

                                <BlockStack gap="300">
                                    <FormLabel htmlFor="password_confirmation" required>
                                        Confirm Password
                                    </FormLabel>
                                    <TextInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        error={displayErrors.password_confirmation}
                                        disabled={isSubmitting}
                                        autoComplete="new-password"
                                    />
                                </BlockStack>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    width="100%"
                                >
                                    Register
                                </Button>
                            </BlockStack>
                        </Box>

                        <InlineStack align="center" blockAlign="center" gap="300">
                            <Text variant="body-m" color="text-secondary">
                                Already have an account?
                            </Text>
                            <Text
                                as="a"
                                href="/login"
                                variant="body-m"
                                color="text-primary"
                                className="auth-register__login-link"
                            >
                                Log in
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Box>
        </>
    );
};

export default Layout.wrap(Register);
