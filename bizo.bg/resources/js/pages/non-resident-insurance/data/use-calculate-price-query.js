/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useCalculatePriceQuery(data) {
    const route = useRoute();
    const queryKey = ["non-resident-calculate-price", data];
    const queryClient = useQueryClient();

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await httpClient.post(
                route("non-resident-insurance.calculate-price"),
                data,
            );
            return response;
        },
        enabled: !!data,
    });

    return { ...query, invalidateQuery };
}

export default useCalculatePriceQuery;
