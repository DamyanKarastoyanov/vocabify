/**
 * External dependencies
 */
import { useState } from "react";

/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import IconX from "@/components/icons/x";
import IconButton from "@/components/icon-button/icon-button";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Icon from "@/components/icon/icon";
import IconWarning from "@/components/icons/warning";
import IconCheckFat from "@/components/icons/check-fat";
import Button from "@/components/button/button";
import Checkbox from "@/components/checkbox/checkbox";

const Alert = (props) => {
    const {
        message,
        title,
        status,
        statusIconColor,
        hideable,
        closable,
        cta,
        checkBox,
        onClose,
    } = props;

    const [isChecked, setIsChecked] = useState(checkBox?.defaultValue || false);

    const STATUS_ICONS = {
        warning: {
            icon: IconWarning,
            iconColor: statusIconColor ?? "system-warning",
        },
        success: {
            icon: IconCheckFat,
            iconColor: statusIconColor ?? "system-confirmation",
        },
        error: {
            icon: IconWarning,
            iconColor: statusIconColor ?? "system-error",
        },
    };

    const { icon: StatusIcon, iconColor } = STATUS_ICONS[status] || {};

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        if (checkBox && checkBox.onChange) {
            checkBox.onChange(checked);
        }
    };

    return (
        <BlockStack gap="400">
            {title && (
                <InlineStack
                    gap="200"
                    align="space-between"
                    blockAlign="center"
                    wrap={false}
                >
                    <InlineStack align="left" blockAlign="center" gap="200">
                        {StatusIcon && (
                            <Icon
                                icon={StatusIcon}
                                size="600"
                                color={iconColor}
                            />
                        )}

                        <Text as="div" color="purple-500" variant="heading-m">
                            {title}
                        </Text>
                    </InlineStack>
                    {closable && (
                        <IconButton size="400" icon={IconX} onClick={onClose} />
                    )}
                </InlineStack>
            )}

            <InlineStack align="space-between" wrap={false}>
                <Text as="div" color="purple-500" variant="body-m">
                    {message}
                </Text>
                {closable && !title && (
                    <IconButton size="400" icon={IconX} onClick={onClose} />
                )}
            </InlineStack>

            {(hideable || cta || checkBox) && (
                <InlineStack
                    align={
                        (hideable && cta) || (checkBox && cta)
                            ? "space-between"
                            : "flex-end"
                    }
                    blockAlign="center"
                >
                    {hideable && (
                        <InlineStack
                            gap="500"
                            align="flex-end"
                            blockAlign="center"
                        >
                            <Button variant="outline" onClick={onClose}>
                                Отмени
                            </Button>
                        </InlineStack>
                    )}

                    {checkBox && (
                        <InlineStack blockAlign="center" gap="200">
                            <Checkbox
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <Text as="span" color="purple-500">
                                {checkBox.label}
                            </Text>
                        </InlineStack>
                    )}

                    {cta && (
                        <InlineStack
                            gap="500"
                            align="flex-end"
                            blockAlign="center"
                        >
                            <Button
                                onClick={() => {
                                    cta.actionFun(isChecked);
                                }}
                                disabled={cta.disabled}
                            >
                                {cta.label}
                            </Button>
                        </InlineStack>
                    )}
                </InlineStack>
            )}
        </BlockStack>
    );
};

export default Alert;
