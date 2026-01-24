/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useGetPoliciesDetailsQuery(policyId) {
    const route = useRoute();

    const queryClient = useQueryClient();

    const queryKey = ["policies-details", policyId];

    const removeQuery = () => {
        queryClient.removeQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            return await httpClient.get(
                route("policies.show", { policy: policyId }),
            );
        },
        retry: 2,
    });

    return { ...query, removeQuery };
}

export default useGetPoliciesDetailsQuery;
