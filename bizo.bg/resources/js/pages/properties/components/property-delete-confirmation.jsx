/**
 * Internal dependencies
 */
import { usePopperContext } from "@/components/popper/popper-context";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Button from "@/components/button/button";
import Text from "@/components/text/text";

const PropertyDeleteConfirmation = ({ onConfirm, isDeleting }) => {
    const { setIsOpen } = usePopperContext();

    const handleDeleteCancel = () => {
        setIsOpen(false);
    };

    return (
        <BlockStack gap="400">
            <Text variant="body-m">
                Сигурни ли сте, че желаете да изтриете този имот?
            </Text>
            <InlineStack
                align="space-between"
                className="bz-properties-delete-button-group"
            >
                <Button
                    variant="outline"
                    disabled={isDeleting}
                    onClick={handleDeleteCancel}
                >
                    Отказ
                </Button>
                <Button
                    variant="primary"
                    onClick={onConfirm}
                    loading={isDeleting}
                >
                    Изтрий
                </Button>
            </InlineStack>
        </BlockStack>
    );
};

export default PropertyDeleteConfirmation;
