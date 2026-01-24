/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useGetPropertyDetailsQuery = (propertyId) => {
    const route = useRoute();
    const queryKey = ["propertyDetails", propertyId];
    const queryClient = useQueryClient();

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await httpClient.get(
                route("properties.show", { property: propertyId }),
            );
            return response;
        },
        retry: 2,
        retryDelay: 1000,
    });

    return { ...query, invalidateQuery };
};

export default useGetPropertyDetailsQuery;
