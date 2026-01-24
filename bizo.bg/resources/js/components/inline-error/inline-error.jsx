/**
 * Internal dependencies
 */
import Text from "@/components/text/text";

const InlineError = (props) => {
    const { align = "right", ...restProps } = props;
    return (
        <Text
            align={align}
            variant="body-s"
            color="system-error"
            {...restProps}
        />
    );
};

export default InlineError;
