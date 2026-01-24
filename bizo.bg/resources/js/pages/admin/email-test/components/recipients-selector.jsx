import React from "react";
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";

const RecipientsSelector = (props) => {
    const {
        fields,
        register,
        errors,
        availableRecipients,
        selectedRecipients,
        loading,
        onToggleAllRecipients,
        onToggleRecipient,
    } = props;

    const modifiedFields = fields.map((field) => {
        if (field.key === "email") {
            return {
                ...field,
                isRequired: selectedRecipients.length === 0,
            };
        }
        return field;
    });

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
                    Избери получатели
                </Text>
            </Box>
            <BlockStack gap="400">
                <Text variant="body-m" color="text-secondary">
                    Изпрати към персонализиран имейл адрес:
                </Text>
                <BlockStack gap="300">
                    <Box style={{ width: "25%" }}>
                        {RenderFormFieldsUtils.renderTextField(
                            "email",
                            modifiedFields,
                            register,
                            errors.email?.message,
                        )}
                    </Box>
                </BlockStack>
            </BlockStack>
            {availableRecipients.length > 0 && (
                <>
                    <Box>
                        <Button
                            variant="plain"
                            onClick={onToggleAllRecipients}
                            type="button"
                        >
                            Избери всички / Премахни всички
                        </Button>
                    </Box>
                    <div className="grid">
                        {availableRecipients.map((recipient, index) => (
                            <Box
                                key={index}
                                className="checkbox-item"
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
                                        type="checkbox"
                                        name="recipients[]"
                                        id={`recipient-${index}`}
                                        value={recipient}
                                        checked={selectedRecipients.includes(
                                            recipient,
                                        )}
                                        onChange={() =>
                                            onToggleRecipient(recipient)
                                        }
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                    <label
                                        htmlFor={`recipient-${index}`}
                                        style={{
                                            cursor: "pointer",
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            variant="body-m"
                                            color="text-primary"
                                        >
                                            {recipient}
                                        </Text>
                                    </label>
                                </InlineStack>
                            </Box>
                        ))}
                    </div>
                </>
            )}
        </BlockStack>
    );
};

export default RecipientsSelector;
