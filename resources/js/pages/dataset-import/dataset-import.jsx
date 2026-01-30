/**
 * External dependencies
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * Internal dependencies
 */
import Layout from '@/layouts/layout/layout';
import Box from '@/components/box/box';
import BlockStack from '@/components/block-stack/block-stack';
import Text from '@/components/text/text';
import Button from '@/components/button/button';
import FormLabel from '@/components/form-label/form-label';
import TextInput from '@/components/text-input/text-input';
import InlineError from '@/components/inline-error/inline-error';
import httpClient from '@/data/http-client';
import { validateDatasetImport } from '@/pages/dataset-import/validations/dataset-import-validation';

const defaultValues = {
    name: '',
    target_language_code: '',
    content: '',
    middle_language_code: '',
};

/** Splits register() so ref is passed as inputRef (avoids React's "ref is not a prop" warning). */
function spreadRegister(registerFn, name) {
    const { ref, ...rest } = registerFn(name);
    return { inputRef: ref, ...rest };
}

const DatasetImport = () => {
    const [result, setResult] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = useForm({
        defaultValues,
    });

    const contentRegister = register('content');
    const { ref: contentRef, ...contentRegisterProps } = contentRegister;

    const onSubmit = async (data) => {
        setResult(null);

        const validationErrors = validateDatasetImport(data);
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([field, message]) => {
                setError(field, { type: 'manual', message });
            });
            return;
        }

        try {
            const response = await httpClient.post('/datasets', data);
            setResult(response.data);
            reset(defaultValues);
        } catch (error) {
            if (error.response?.data?.line_errors) {
                setResult({
                    dataset_name: data.name,
                    line_errors: error.response.data.line_errors,
                });
                setError('root', {
                    type: 'manual',
                    message: error.response?.data?.message || 'Import failed due to validation errors.',
                });
            } else if (error.response?.data?.errors) {
                const raw = error.response.data.errors;
                Object.entries(raw).forEach(([field, messages]) => {
                    const message = Array.isArray(messages) ? messages[0] : messages;
                    setError(field, { type: 'manual', message });
                });
            } else {
                setError('root', {
                    type: 'manual',
                    message: error.response?.data?.message || 'An error occurred during import.',
                });
            }
        }
    };

    return (
        <Box className="dataset-import" padding="800" maxWidth="960px" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
            <BlockStack gap="600">
                <Text as="h1" variant="heading-l" fontWeight="bold" color="text-primary">
                    Import Dataset
                </Text>

                <Box as="form" onSubmit={handleSubmit(onSubmit)} className="dataset-import__form" noValidate>
                    <BlockStack gap="500">
                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <FormLabel htmlFor="name">Dataset Name</FormLabel>
                                <TextInput
                                    id="name"
                                    placeholder="e.g. JLPT N5 vocab"
                                    invalid={!!errors.name?.message}
                                    {...spreadRegister(register, 'name')}
                                />
                                {errors.name?.message && (
                                    <InlineError>{errors.name.message}</InlineError>
                                )}
                            </BlockStack>
                        </Box>

                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <FormLabel htmlFor="target_language_code">Target language code</FormLabel>
                                <Text variant="body-s" color="text-secondary">
                                    2–5 letter code (e.g. ja, en, es) — not the full language name
                                </Text>
                                <TextInput
                                    id="target_language_code"
                                    placeholder="e.g. ja, en, es"
                                    invalid={!!errors.target_language_code?.message}
                                    {...spreadRegister(register, 'target_language_code')}
                                />
                                {errors.target_language_code?.message && (
                                    <InlineError>{errors.target_language_code.message}</InlineError>
                                )}
                            </BlockStack>
                        </Box>

                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <FormLabel htmlFor="middle_language_code">Middle language code</FormLabel>
                                <Text variant="body-s" color="text-secondary">
                                    2–5 letter code (e.g. en) — not the full language name
                                </Text>
                                <TextInput
                                    id="middle_language_code"
                                    placeholder="e.g. en"
                                    invalid={!!errors.middle_language_code?.message}
                                    {...spreadRegister(register, 'middle_language_code')}
                                />
                                {errors.middle_language_code?.message && (
                                    <InlineError>{errors.middle_language_code.message}</InlineError>
                                )}
                            </BlockStack>
                        </Box>

                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <FormLabel htmlFor="content">Dataset Content</FormLabel>
                                <Text variant="body-s" color="text-secondary">
                                    Format: reading,kanji,native[,middle][ | tag1,tag2,tag3]
                                </Text>
                                <Text variant="body-s" color="text-secondary">
                                    Examples:
                                </Text>
                                <Box as="pre" className="dataset-import__format-examples" padding="300" backgroundColor="surface-100" borderRadius="200" fontSize="12px">
                                    {`たべる,食べる,ям,to eat | verb,jlpt-n5
ねこ,猫,котка | noun,jlpt-n5,topic
いぬ,犬,куче,to run
みず,水,вода`}
                                </Box>
                                <textarea
                                    id="content"
                                    className="dataset-import__textarea"
                                    rows={15}
                                    placeholder="Paste your lines here. Format: reading,kanji,native[,middle][ | tag1,tag2]"
                                    ref={contentRef}
                                    {...contentRegisterProps}
                                />
                                {errors.content?.message && (
                                    <InlineError>{errors.content.message}</InlineError>
                                )}
                            </BlockStack>
                        </Box>

                        {errors.root?.message && (
                            <Box className="dataset-import__error">
                                <InlineError variant="body-m">{errors.root.message}</InlineError>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Import Dataset
                        </Button>
                    </BlockStack>
                </Box>

                {result && (
                    <Box className="dataset-import__result" padding="600" backgroundColor="surface-100" borderRadius="400">
                        <BlockStack gap="400">
                            <Text as="h2" variant="heading-m" fontWeight="bold" color="text-primary">
                                Import Results
                            </Text>
                            <BlockStack gap="300">
                                <Text variant="body-m" color="text-primary">
                                    <strong>Dataset:</strong> {result.dataset_name}
                                </Text>
                                <Text variant="body-m" color="text-success">
                                    <strong>Imported:</strong> {result.imported_count} words
                                </Text>
                                {result.skipped_count > 0 && (
                                    <Text variant="body-m" color="text-warning">
                                        <strong>Skipped:</strong> {result.skipped_count} lines
                                    </Text>
                                )}
                                {result.line_errors && result.line_errors.length > 0 && (
                                    <Box className="dataset-import__errors">
                                        <BlockStack gap="200">
                                            <Text variant="body-m" fontWeight="semibold" color="text-error">
                                                Line Errors:
                                            </Text>
                                            {result.line_errors.slice(0, 10).map((error, index) => (
                                                <BlockStack key={index} gap="100">
                                                    <Text variant="body-s" color="text-error">
                                                        Line {error.line}: {error.reason}
                                                    </Text>
                                                    {error.content && (
                                                        <Box
                                                            as="pre"
                                                            padding="200"
                                                            backgroundColor="surface-200"
                                                            borderRadius="100"
                                                            fontSize="12px"
                                                            fontFamily="monospace"
                                                            overflow="auto"
                                                        >
                                                            {error.content}
                                                        </Box>
                                                    )}
                                                </BlockStack>
                                            ))}
                                            {result.line_errors.length > 10 && (
                                                <Text variant="body-s" color="text-secondary">
                                                    ... and {result.line_errors.length - 10} more errors
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </Box>
                                )}
                            </BlockStack>
                        </BlockStack>
                    </Box>
                )}
            </BlockStack>
        </Box>
    );
};

export default Layout.wrap(DatasetImport);
