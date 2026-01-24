import React from "react";
import { createPortal } from "react-dom";
import Box from "@/components/box/box";
import Text from "@/components/text/text";

const EmailTestAlert = (props) => {
    const { alert } = props;

    if (!alert.show) return null;

    const alertContent = (
        <Box
            backgroundColor={
                alert.type === "success" ? "success-500" : "warning-100"
            }
            borderRadius="300"
            paddingBlock="400"
            paddingInline="500"
            dangerouslySetInlineStyle={{
                __style: {
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    border: `1px solid var(--bz-color-${alert.type === "success" ? "success" : "warning"}-500)`,
                    backgroundColor:
                        alert.type === "success" ? "#9be3cc" : undefined,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    minWidth: "300px",
                    maxWidth: "90vw",
                },
            }}
        >
            <Text
                variant="body-l"
                fontWeight="medium"
                color={alert.type === "success" ? "green-300" : "danger-500"}
            >
                {alert.message}
            </Text>
        </Box>
    );

    return typeof window !== "undefined" && document.body
        ? createPortal(alertContent, document.body)
        : alertContent;
};

export default EmailTestAlert;
