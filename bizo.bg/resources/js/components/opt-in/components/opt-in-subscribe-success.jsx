/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Icon from "@/components/icon/icon";
import IconCheck from "@/components/icons/check";

const OptInSubscribeSuccess = (props) => {
    const { vehicleRegistration } = props;
    return (
        <BlockStack className="bz-opt-in-form" gap="800">
            <InlineStack gap="400">
                <Icon icon={IconCheck} size="600" />

                <Text variant="heading-m">
                    Готово! Вече си в безопасност с Bizo.
                </Text>
            </InlineStack>

            <Text variant="body-l" color="text-secondary">
                Успешно се абонира за напомняния за изтичащи ГТП, ГО и винетка.
            </Text>

            <Text variant="body-l" color="text-secondary">
                Ще получиш имейл, когато наближи важна дата, за да не мислиш за
                срокове.
            </Text>
        </BlockStack>
    );
};

export default OptInSubscribeSuccess;
