/**
 * External dependencies
 */
import { useState } from 'react';
import axios from 'axios';

/**
 * Internal dependencies
 */
import Layout from '@/layouts/layout/layout';
import Box from '@/components/box/box';
import BlockStack from '@/components/block-stack/block-stack';
import Text from '@/components/text/text';
import Button from '@/components/button/button';
import { validateDatasetImport } from '@/pages/dataset-import/validations/dataset-import-validation';

const DatasetImport = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        name: '',
        target_language_code: '',
        content: '',
        middle_language_code: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setResult(null);

        const validationErrors = validateDatasetImport(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post('/datasets', data);
            setResult(response.data);
            setData({
                name: '',
                target_language_code: '',
                content: '',
                middle_language_code: '',
            });
            setErrors({});
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ submit: error.response?.data?.message || 'An error occurred during import.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box className="dataset-import" padding="800" maxWidth="960px" dangerouslySetInlineStyle={{ __style: { margin: '0 auto' } }}>
            <BlockStack gap="600">
                <Text as="h1" variant="heading-l" fontWeight="bold" color="text-primary">
                    Import Dataset
                </Text>

                <Box as="form" onSubmit={handleSubmit} className="dataset-import__form">
                    <BlockStack gap="500">
                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <Text as="label" variant="body-m" fontWeight="semibold" color="text-primary" htmlFor="name">
                                    Dataset Name
                                </Text>
                                <Box
                                    as="input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="dataset-import__input"
                                    required
                                />
                                {errors.name && (
                                    <Text variant="body-s" color="text-error">
                                        {errors.name}
                                    </Text>
                                )}
                            </BlockStack>
                        </Box>

                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <Text as="label" variant="body-m" fontWeight="semibold" color="text-primary" htmlFor="target_language_code">
                                    Target Language Code
                                </Text>
                                <Box
                                    as="input"
                                    type="text"
                                    id="target_language_code"
                                    name="target_language_code"
                                    value={data.target_language_code}
                                    onChange={(e) => setData({ ...data, target_language_code: e.target.value })}
                                    className="dataset-import__input"
                                    placeholder="e.g., ja, en, es"
                                    required
                                />
                                {errors.target_language_code && (
                                    <Text variant="body-s" color="text-error">
                                        {errors.target_language_code}
                                    </Text>
                                )}
                            </BlockStack>
                        </Box>

                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <Text as="label" variant="body-m" fontWeight="semibold" color="text-primary" htmlFor="middle_language_code">
                                    Middle Language Code
                                </Text>
                                <Box
                                    as="input"
                                    type="text"
                                    id="middle_language_code"
                                    name="middle_language_code"
                                    value={data.middle_language_code}
                                    onChange={(e) => setData({ ...data, middle_language_code: e.target.value })}
                                    className="dataset-import__input"
                                    placeholder="e.g., en"
                                    required
                                />
                                {errors.middle_language_code && (
                                    <Text variant="body-s" color="text-error">
                                        {errors.middle_language_code}
                                    </Text>
                                )}
                            </BlockStack>
                        </Box>

                        <Box className="dataset-import__field">
                            <BlockStack gap="200">
                                <Text as="label" variant="body-m" fontWeight="semibold" color="text-primary" htmlFor="content">
                                    Dataset Content
                                </Text>
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
                                <Box
                                    as="textarea"
                                    id="content"
                                    name="content"
                                    value={data.content}
                                    onChange={(e) => setData({ ...data, content: e.target.value })}
                                    className="dataset-import__textarea"
                                    rows={15}
                                    required
                                />
                                {errors.content && (
                                    <Text variant="body-s" color="text-error">
                                        {errors.content}
                                    </Text>
                                )}
                            </BlockStack>
                        </Box>

                        {errors.submit && (
                            <Box className="dataset-import__error">
                                <Text variant="body-m" color="text-error">
                                    {errors.submit}
                                </Text>
                            </Box>
                        )}

                        <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
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
                                    <strong>Dataset:</strong> {result.dataset_name} (ID: {result.dataset_id})
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
                                                <Text key={index} variant="body-s" color="text-error">
                                                    Line {error.line}: {error.reason}
                                                </Text>
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
