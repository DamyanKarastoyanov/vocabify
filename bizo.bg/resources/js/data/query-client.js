/**
 * External dependencies
 */
import { QueryClient } from "@tanstack/react-query";

/**
 * Internal dependencies
 */
import defaultDataSelector from "@/data/default-data-selector";

/**
 * @type {import('@tanstack/react-query').QueryClient}
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            useErrorBoundary: true,
            retry: false,
            select: defaultDataSelector,
            refetchInterval: false,
            refetchOnWindowFocus: false,
        },
    },
});

export default queryClient;
