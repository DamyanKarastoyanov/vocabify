import React from "react";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";

const EmailTemplateSelector = (props) => {
    const { availableEmails, selectedEmail, onSelect } = props;

    return (
        <BlockStack gap="500">
            <Box
                paddingInlineStart="400"
                dangerouslySetInlineStyle={{
                    __style: {
                        borderLeft: "4px solid var(--bz-color-brand-500)",
                    },
                }}
            >
                <Text variant="heading-s" color="text-primary">
                    Избери шаблон за имейл
                </Text>
            </Box>
            <div className="grid">
                {availableEmails.map((email, index) => (
                    <Box
                        key={index}
                        className="radio-item"
                        paddingBlock="400"
                        paddingInline="400"
                        borderRadius="300"
                        cursor="pointer"
                        dangerouslySetInlineStyle={{
                            __style: {
                                border: "2px solid var(--bz-color-border-subtle)",
                            },
                        }}
                    >
                        <InlineStack gap="300" blockAlign="center">
                            <input
                                type="radio"
                                name="email"
                                id={`email-${index}`}
                                value={email}
                                checked={selectedEmail === email}
                                onChange={(e) => onSelect(e.target.value)}
                                style={{ cursor: "pointer" }}
                            />
                            <label
                                htmlFor={`email-${index}`}
                                style={{
                                    cursor: "pointer",
                                    flex: 1,
                                }}
                            >
                                <Text variant="body-m" color="text-primary">
                                    {email}
                                </Text>
                            </label>
                        </InlineStack>
                    </Box>
                ))}
            </div>
        </BlockStack>
    );
};

export default EmailTemplateSelector;
