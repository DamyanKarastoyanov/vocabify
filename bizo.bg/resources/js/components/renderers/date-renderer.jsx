/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import { formatDate } from "@/utils/formatting";

export const createDateRenderer = (formatString = "dd MMM yyyy") => {
    return ({ datarow, colKey }) => {
        const rawValue = datarow?.[colKey];
        if (!rawValue) return <Text>-</Text>;
        const dateObject =
            rawValue instanceof Date ? rawValue : new Date(rawValue);
        if (Number.isNaN(dateObject.getTime())) return <Text>-</Text>;
        try {
            return <Text>{formatDate(dateObject, formatString)}</Text>;
        } catch (_e) {
            return <Text>-</Text>;
        }
    };
};

export default createDateRenderer;
