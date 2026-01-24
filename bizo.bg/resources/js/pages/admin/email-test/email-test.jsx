import { useState, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import emailTestValidationSchema from "@/pages/admin/email-test/validation/email-test-validation-schema";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Icon from "@/components/icon/icon";
import IconEnvelope from "@/components/icons/envelope";
import Form from "@/components/form/form";
import EmailTestAlert from "@/pages/admin/email-test/components/email-test-alert";
import EmailTestWarning from "@/pages/admin/email-test/components/email-test-warning";
import EmailTemplateSelector from "@/pages/admin/email-test/components/email-template-selector";
import PreviewLinksSection from "@/pages/admin/email-test/components/preview-links-section";
import RecipientsSelector from "@/pages/admin/email-test/components/recipients-selector";

const EmailTest = (props) => {
    const {
        availableEmails,
        availableRecipients,
        hasPolicies,
        hasInstallments,
    } = props;
    const { emailTesting } = usePage().props;
    const { fields } = emailTesting || [];

    const [selectedEmail, setSelectedEmail] = useState(availableEmails[0]);
    const [selectedRecipients, setSelectedRecipients] = useState(
        availableRecipients.length > 0 ? [availableRecipients[0]] : [],
    );
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });

    const {
        register,
        formState: { errors, isValid },
        watch,
    } = useForm({
        defaultValues: useMemo(() => {
            return fields.reduce((acc, field) => {
                const { key, selected } = field || {};
                if (key) {
                    acc[key] = selected || "";
                }
                return acc;
            }, {});
        }, [fields]),
        resolver: yupResolver(emailTestValidationSchema),
        mode: "onChange",
    });

    const customEmail = watch("email") || "";

    const toggleAllRecipients = (e) => {
        e.preventDefault();
        const allRecipients = [...availableRecipients];
        if (selectedRecipients.length === allRecipients.length) {
            setSelectedRecipients([]);
        } else {
            setSelectedRecipients([...allRecipients]);
        }
    };

    const toggleRecipient = (email) => {
        if (selectedRecipients.includes(email)) {
            setSelectedRecipients(
                selectedRecipients.filter((e) => e !== email),
            );
        } else {
            setSelectedRecipients([...selectedRecipients, email]);
        }
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, type, message });
        setTimeout(() => {
            setAlert({ show: false, type: "", message: "" });
        }, 5000);
    };

    const sendEmail = async (recipients) => {
        setLoading(true);

        try {
            const response = await axios.post("/admin/email-test/send", {
                email: selectedEmail,
                recipients: recipients,
            });

            if (response.data.status === "success") {
                showAlert(response.data.message, "success");
            } else {
                showAlert(
                    response.data.message || "Неуспешно изпращане на имейл",
                    "error",
                );
            }
        } catch (error) {
            showAlert(
                "Грешка в мрежата: " +
                    (error.response?.data?.message || error.message),
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleMainFormSubmit = async (e) => {
        e.preventDefault();

        const recipients = [...selectedRecipients];

        if (isValid) {
            recipients.push(customEmail.trim());
        }

        if (recipients.length === 0) {
            showAlert(
                "Моля, добавете поне един имейл адрес на получател",
                "error",
            );
            return;
        }

        await sendEmail(recipients);
    };

    return (
        <>
            <Head title="Тестване на имейли - Bizo Admin" />

            <Box
                className="email-test-page"
                backgroundColor="surface-100"
                minHeight="100vh"
                paddingBlock="800"
                paddingInline="800"
            >
                <Box
                    className="email-test-container"
                    backgroundColor="surface-0"
                    borderRadius="400"
                    paddingBlock="800"
                    paddingInline="800"
                    maxWidth="1200px"
                    dangerouslySetInlineStyle={{
                        __style: {
                            margin: "0 auto",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                        },
                    }}
                >
                    <BlockStack gap="600">
                        <BlockStack gap="200">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon
                                    icon={IconEnvelope}
                                    size="1600"
                                    color="brand-500"
                                />
                                <Text
                                    as="h1"
                                    variant="heading-2xl"
                                    color="text-primary"
                                >
                                    Тестване на имейли
                                </Text>
                            </InlineStack>
                            <Text variant="body-m" color="text-secondary">
                                Тествайте шаблони за застрахователни имейли
                            </Text>
                        </BlockStack>

                        {!hasPolicies && (
                            <EmailTestWarning message="Не са намерени полици в системата. Тестването на имейли изисква поне една полица. Моля, създайте първо полица." />
                        )}

                        {!hasInstallments && (
                            <EmailTestWarning message="Не са намерени вноски в системата. Тестването на имейли за плащания изисква поне една вноска. Моля, създайте първо вноска." />
                        )}

                        <Form onSubmit={handleMainFormSubmit}>
                            <BlockStack gap="800">
                                <BlockStack gap="500">
                                    <EmailTemplateSelector
                                        availableEmails={availableEmails}
                                        selectedEmail={selectedEmail}
                                        onSelect={setSelectedEmail}
                                    />
                                </BlockStack>

                                <RecipientsSelector
                                    fields={fields}
                                    register={register}
                                    errors={errors}
                                    availableRecipients={availableRecipients}
                                    selectedRecipients={selectedRecipients}
                                    loading={loading}
                                    onToggleAllRecipients={toggleAllRecipients}
                                    onToggleRecipient={toggleRecipient}
                                />

                                <InlineStack gap="400">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={
                                            !isValid &&
                                            selectedRecipients.length === 0
                                        }
                                        loading={loading}
                                    >
                                        Изпрати имейл
                                    </Button>
                                    <Button
                                        href="/dashboard"
                                        variant="secondary"
                                    >
                                        Назад към таблото
                                    </Button>
                                </InlineStack>

                                <Box
                                    paddingBlock="800"
                                    paddingInline="0"
                                    dangerouslySetInlineStyle={{
                                        __style: {
                                            position: "relative",
                                        },
                                    }}
                                >
                                    <Box
                                        dangerouslySetInlineStyle={{
                                            __style: {
                                                height: "3px",
                                                background:
                                                    "linear-gradient(to right, transparent 0%, var(--bz-color-brand-300) 20%, var(--bz-color-brand-500) 50%, var(--bz-color-brand-300) 80%, transparent 100%)",
                                                borderRadius: "2px",
                                                boxShadow:
                                                    "0 2px 4px rgba(0, 0, 0, 0.08)",
                                            },
                                        }}
                                    />
                                </Box>

                                <Box paddingBlockStart="0" paddingInline="0">
                                    <PreviewLinksSection />
                                </Box>
                            </BlockStack>
                        </Form>
                        <EmailTestAlert alert={alert} />
                    </BlockStack>
                </Box>
            </Box>
        </>
    );
};

export default EmailTest;
