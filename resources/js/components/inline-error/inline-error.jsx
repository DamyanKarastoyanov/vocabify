/**
 * Internal dependencies
 */
import Text from '@/components/text/text';

const InlineError = (props) => {
    const { align = 'left', variant = 'body-s', ...restProps } = props;
    return (
        <Text
            align={align}
            variant={variant}
            color="danger-500"
            {...restProps}
        />
    );
};

export default InlineError;
