/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useGetTownQuery(municipalityId) {
    const route = useRoute();
    const queryKey = ["town", municipalityId];
    const queryClient = useQueryClient();

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await httpClient.get(
                route("persons.towns", {
                    axiom_municipality_id: municipalityId,
                }),
            );
            return response;
        },
        enabled: !!municipalityId,
        retry: 2,
        retryDelay: 1000,
    });

    return { ...query, invalidateQuery };
}

export default useGetTownQuery;
