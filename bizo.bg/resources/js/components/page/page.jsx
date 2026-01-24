/**
 * Internal dependencies
 */
import Box from "@/components/box/box";
import { token } from "@/tokens/tokens";

const Page = (props) => {
    const { children } = props;

    return (
        <Box className={"bz-page"} minHeight={token("size.12800")}>
            {children}
        </Box>
    );
};

export default Page;
