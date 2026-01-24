import React from "react";
import Box from "@/components/box/box";
import Text from "@/components/text/text";

const EmailTestWarning = (props) => {
    const { message } = props;

    return (
        <Box
            backgroundColor="warning-100"
            borderRadius="300"
            paddingBlock="400"
            paddingInline="500"
            dangerouslySetInlineStyle={{
                __style: {
                    border: "1px solid var(--bz-color-warning-500)",
                },
            }}
        >
            <Text variant="body-m" color="danger-500">
                ⚠️{" "}
                <Text as="strong" variant="body-m" fontWeight="semibold">
                    Предупреждение:
                </Text>{" "}
                {message}
            </Text>
        </Box>
    );
};

export default EmailTestWarning;
