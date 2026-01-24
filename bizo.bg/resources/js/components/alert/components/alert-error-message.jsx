/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";

const AlertErrorMessage = (props) => {
    const { validationErrors } = props;

    const genericErrorMessage =
        "There has been an error. Please try again later";

    const getValidationErrors = (errors) => (
        <BlockStack gap="200">
            <Text>The following validation errors were encountered:</Text>

            <BlockStack>
                {Object.entries(errors).map(([key, messages]) => (
                    <Text key={key}>
                        {Array.isArray(messages) ? messages[0] : messages}
                    </Text>
                ))}
            </BlockStack>
        </BlockStack>
    );

    if (validationErrors) {
        return getValidationErrors(validationErrors);
    } else {
        return genericErrorMessage;
    }
};

export default AlertErrorMessage;
