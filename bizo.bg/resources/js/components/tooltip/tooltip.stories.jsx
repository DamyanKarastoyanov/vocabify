/**
 * Internal dependencies
 */
import Tooltip from "@/components/tooltip/tooltip";
import SimpleTooltip from "@/components/tooltip/simple-tooltip";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconCaretDown from "@/components/icons/caret-down";

export default {
    title: "Pastel/Tooltip",
    component: Tooltip,
    argTypes: {
        placement: {
            options: [
                "top",
                "top-start",
                "top-end",
                "right",
                "right-start",
                "right-end",
                "bottom",
                "bottom-start",
                "bottom-end",
                "left",
                "left-start",
                "left-end",
            ],
            control: { type: "select" },
        },
        variant: {
            options: [
                "default",
                "success",
                "warning",
                "error",
                "info",
                "light",
            ],
            control: { type: "select" },
        },
    },
};

export const Default = {
    render: (args) => {
        return (
            <div style={{ padding: "100px", textAlign: "center" }}>
                <Tooltip {...args}>
                    <Tooltip.Trigger>
                        <Text
                            as="span"
                            style={{
                                textDecoration: "underline",
                                cursor: "help",
                            }}
                        >
                            Hover me for tooltip
                        </Text>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <Text>
                            This is a helpful tooltip with improved styling and
                            animations!
                        </Text>
                    </Tooltip.Content>
                </Tooltip>
            </div>
        );
    },
};
Default.args = {
    placement: "top",
    variant: "default",
};

export const Variants = {
    render: () => {
        const variants = [
            {
                variant: "default",
                label: "Default",
                content: "Default tooltip style",
            },
            {
                variant: "success",
                label: "Success",
                content: "Operation completed successfully!",
            },
            {
                variant: "warning",
                label: "Warning",
                content: "Please be careful with this action",
            },
            {
                variant: "error",
                label: "Error",
                content: "Something went wrong",
            },
            {
                variant: "info",
                label: "Info",
                content: "Here's some helpful information",
            },
            {
                variant: "light",
                label: "Light",
                content: "Light theme tooltip",
            },
        ];

        return (
            <div style={{ padding: "100px" }}>
                <InlineStack gap="400" align="center">
                    {variants.map(({ variant, label, content }) => (
                        <Tooltip
                            key={variant}
                            variant={variant}
                            placement="top"
                        >
                            <Tooltip.Trigger>
                                <div
                                    style={{
                                        padding: "8px 16px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        cursor: "help",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    {label}
                                </div>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <Text>{content}</Text>
                            </Tooltip.Content>
                        </Tooltip>
                    ))}
                </InlineStack>
            </div>
        );
    },
};

export const Placements = {
    render: () => {
        const placements = [
            "top",
            "top-start",
            "top-end",
            "right",
            "right-start",
            "right-end",
            "bottom",
            "bottom-start",
            "bottom-end",
            "left",
            "left-start",
            "left-end",
        ];

        return (
            <div
                style={{
                    padding: "200px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                }}
            >
                {placements.map((placement) => (
                    <Tooltip key={placement} placement={placement}>
                        <Tooltip.Trigger>
                            <div
                                style={{
                                    padding: "12px",
                                    border: "2px solid #0066cc",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    cursor: "help",
                                    backgroundColor: "#f0f8ff",
                                }}
                            >
                                {placement}
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <Text>
                                Tooltip positioned at{" "}
                                <strong>{placement}</strong>
                            </Text>
                        </Tooltip.Content>
                    </Tooltip>
                ))}
            </div>
        );
    },
};

export const WithIcon = {
    render: (args) => {
        return (
            <div style={{ padding: "100px", textAlign: "center" }}>
                <InlineStack gap="200" blockAlign="center">
                    <Text>Click the icon for more info</Text>
                    <Tooltip {...args}>
                        <Tooltip.Trigger>
                            <Icon
                                size="500"
                                icon={IconCaretDown}
                                style={{ cursor: "help", color: "#0066cc" }}
                            />
                        </Tooltip.Trigger>
                        <Tooltip.Content maxWidth="250px">
                            <Text>
                                This is a detailed explanation that provides
                                additional context and helpful information about
                                the feature or action.
                            </Text>
                        </Tooltip.Content>
                    </Tooltip>
                </InlineStack>
            </div>
        );
    },
};

WithIcon.args = {
    placement: "bottom",
    variant: "info",
    delay: { open: 300, close: 100 },
};

export const CustomDelay = {
    render: () => {
        return (
            <div style={{ padding: "100px" }}>
                <InlineStack gap="400" align="center">
                    <Tooltip delay={{ open: 0, close: 0 }} placement="top">
                        <Tooltip.Trigger>
                            <div
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "help",
                                }}
                            >
                                Instant
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <Text>Shows immediately</Text>
                        </Tooltip.Content>
                    </Tooltip>

                    <Tooltip delay={{ open: 1000, close: 0 }} placement="top">
                        <Tooltip.Trigger>
                            <div
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "help",
                                }}
                            >
                                Slow
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <Text>Shows after 1 second</Text>
                        </Tooltip.Content>
                    </Tooltip>
                </InlineStack>
            </div>
        );
    },
};

export const SimpleUsage = {
    render: () => {
        return (
            <div style={{ padding: "100px" }}>
                <InlineStack gap="400" align="center">
                    <SimpleTooltip content="This is a simple tooltip!">
                        <button
                            style={{
                                padding: "8px 16px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        >
                            Simple Button
                        </button>
                    </SimpleTooltip>

                    <SimpleTooltip
                        content="Success message tooltip"
                        variant="success"
                        placement="bottom"
                    >
                        <Text
                            as="span"
                            style={{
                                color: "green",
                                cursor: "help",
                                textDecoration: "underline",
                            }}
                        >
                            Success Text
                        </Text>
                    </SimpleTooltip>

                    <SimpleTooltip
                        content="This tooltip has custom delay and max width"
                        variant="info"
                        delay={{ open: 200, close: 0 }}
                        maxWidth="200px"
                    >
                        <Icon
                            size="500"
                            icon={IconCaretDown}
                            style={{ cursor: "help", color: "#2563eb" }}
                        />
                    </SimpleTooltip>
                </InlineStack>
            </div>
        );
    },
};
