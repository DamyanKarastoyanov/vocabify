/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useGetInstallmentDetailsQuery(installmentId) {
    const route = useRoute();

    const queryClient = useQueryClient();

    const queryKey = ["installment-details", installmentId];

    const removeQuery = () => {
        queryClient.removeQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            return await httpClient.get(
                route("installments.show", { installment: installmentId }),
            );
        },
    });

    return { ...query, removeQuery };
}

export default useGetInstallmentDetailsQuery;
