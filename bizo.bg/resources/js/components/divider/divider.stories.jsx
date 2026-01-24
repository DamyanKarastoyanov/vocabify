/**
 * Internal dependencies
 */
import Divider from "@/components/divider/divider";
import DividerOrientationEnum from "@/components/divider/divider-orientation-enum";
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";

export default {
    title: "Pastel/Divider",
    component: Divider,
    argTypes: {
        orientation: {
            control: { type: "select" },
            options: [
                DividerOrientationEnum.HORIZONTAL,
                DividerOrientationEnum.VERTICAL,
            ],
        },
    },
};

export const Default = {
    render: (args) => {
        return (
            <BlockStack gap="400">
                <Text variant="body-m">Lorem, ipsum dolor.</Text>
                <Divider {...args} />
                <Text variant="body-m">Sit amet consectetur.</Text>
            </BlockStack>
        );
    },
};

export const Vertical = {
    render: (args) => {
        return (
            <InlineStack gap="400">
                <Text variant="body-m">Lorem, ipsum dolor.</Text>
                <Divider {...args} />
                <Text variant="body-m">Sit amet consectetur.</Text>
            </InlineStack>
        );
    },
};

Vertical.args = {
    orientation: DividerOrientationEnum.VERTICAL,
};
