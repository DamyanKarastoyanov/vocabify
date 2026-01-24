/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useGetTravelTypeActivitiesQuery(travelTypeId) {
    const route = useRoute();
    const queryKey = ["travel-type-activities", travelTypeId];
    const queryClient = useQueryClient();

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await httpClient.get(
                route("travel-insurance.travel-type-activities", {
                    axiom_travel_type: travelTypeId,
                }),
            );
            return response;
        },
        enabled: !!travelTypeId,
    });

    return { ...query, invalidateQuery };
}

export default useGetTravelTypeActivitiesQuery;
