/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useGetPersonDetailsQuery = (personId) => {
    const route = useRoute();
    const queryKey = ["personDetails", personId];
    const queryClient = useQueryClient();

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await httpClient.get(
                route("persons.show", { person: personId }),
            );
            return response;
        },
        retry: 2,
        retryDelay: 1000,
    });

    return { ...query, invalidateQuery };
};

export default useGetPersonDetailsQuery;
