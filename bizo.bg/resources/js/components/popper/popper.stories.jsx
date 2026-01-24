/**
 * External dependencies
 */
import { useState } from "react";

/**
 * Internal dependencies
 */
import Popper from "./popper";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";

export default {
    title: "Components/Popper",
    component: Popper,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: [
                "default",
                "elevated",
                "minimal",
                "dark",
                "primary",
                "success",
                "warning",
                "error",
            ],
        },
        trigger: {
            control: "select",
            options: ["click"],
        },
    },
};

// Basic usage example
export const Default = {
    args: {
        placement: "bottom-start",
        variant: "default",
    },
    render: (args) => (
        <Popper {...args}>
            <Popper.Trigger>
                <Button>Open Popper</Button>
            </Popper.Trigger>
            <Popper.Content>
                <BlockStack gap="200">
                    <Text variant="heading-s">Popper Content</Text>
                    <Text>
                        This is the content inside the popper. It can contain
                        any React elements.
                    </Text>
                </BlockStack>
            </Popper.Content>
        </Popper>
    ),
};

// Controlled example
export const Controlled = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <BlockStack gap="300">
                <InlineStack gap="300">
                    <Button onClick={() => setIsOpen(true)}>Open Popper</Button>
                    <Button
                        onClick={() => setIsOpen(false)}
                        variant="secondary"
                    >
                        Close Popper
                    </Button>
                </InlineStack>

                <Popper open={isOpen} onOpenChange={setIsOpen}>
                    <Popper.Trigger>
                        <Button>Controlled Trigger</Button>
                    </Popper.Trigger>
                    <Popper.Content>
                        <BlockStack gap="200">
                            <Text variant="heading-s">Controlled Popper</Text>
                            <Text>
                                This popper is controlled by external state.
                            </Text>
                            <Button
                                onClick={() => setIsOpen(false)}
                                variant="secondary"
                            >
                                Close
                            </Button>
                        </BlockStack>
                    </Popper.Content>
                </Popper>
            </BlockStack>
        );
    },
};

// Different variants
export const Variants = {
    render: () => (
        <InlineStack gap="300" wrap>
            {[
                "default",
                "elevated",
                "minimal",
                "dark",
                "primary",
                "success",
                "warning",
                "error",
            ].map((variant) => (
                <Popper key={variant} variant={variant}>
                    <Popper.Trigger>
                        <Button
                            variant={
                                variant === "default" ? "primary" : "secondary"
                            }
                        >
                            {variant}
                        </Button>
                    </Popper.Trigger>
                    <Popper.Content>
                        <BlockStack gap="200">
                            <Text variant="heading-s">{variant} Variant</Text>
                            <Text>
                                This is the {variant} variant of the popper.
                            </Text>
                        </BlockStack>
                    </Popper.Content>
                </Popper>
            ))}
        </InlineStack>
    ),
};

// Different placements - NOW CENTERED
export const Placements = {
    render: () => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                padding: "100px",
            }}
        >
            {[
                "Example 1",
                "Example 2",
                "Example 3",
                "Example 4",
                "Example 5",
                "Example 6",
                "Example 7",
                "Example 8",
                "Example 9",
                "Example 10",
                "Example 11",
                "Example 12",
            ].map((label) => (
                <Popper key={label}>
                    <Popper.Trigger>
                        <Button variant="secondary" style={{ width: "100%" }}>
                            {label}
                        </Button>
                    </Popper.Trigger>
                    <Popper.Content>
                        <Text>Centered popup for: {label}</Text>
                    </Popper.Content>
                </Popper>
            ))}
        </div>
    ),
};

// With custom trigger using asChild
export const CustomTrigger = {
    render: () => (
        <Popper>
            <Popper.Trigger asChild>
                <div
                    style={{
                        padding: "12px",
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    Click me! (Custom trigger)
                </div>
            </Popper.Trigger>
            <Popper.Content>
                <BlockStack gap="200">
                    <Text variant="heading-s">Custom Trigger</Text>
                    <Text>
                        This popper uses a custom trigger element with asChild
                        prop.
                    </Text>
                </BlockStack>
            </Popper.Content>
        </Popper>
    ),
};

// Complex content example
export const ComplexContent = {
    render: () => (
        <Popper variant="elevated" maxWidth="400px">
            <Popper.Trigger>
                <Button>Show Menu</Button>
            </Popper.Trigger>
            <Popper.Content>
                <BlockStack gap="300">
                    <Text variant="heading-s">Menu Options</Text>
                    <BlockStack gap="100">
                        <Button
                            variant="ghost"
                            style={{ justifyContent: "flex-start" }}
                        >
                            Option 1
                        </Button>
                        <Button
                            variant="ghost"
                            style={{ justifyContent: "flex-start" }}
                        >
                            Option 2
                        </Button>
                        <Button
                            variant="ghost"
                            style={{ justifyContent: "flex-start" }}
                        >
                            Option 3
                        </Button>
                    </BlockStack>
                    <hr />
                    <InlineStack gap="200">
                        <Button variant="primary">Save</Button>
                        <Button variant="secondary">Cancel</Button>
                    </InlineStack>
                </BlockStack>
            </Popper.Content>
        </Popper>
    ),
};
