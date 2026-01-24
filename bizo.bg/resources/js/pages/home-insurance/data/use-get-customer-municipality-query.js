/**
 * External dependencies
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useGetCustomerMunicipalityQuery(districtId) {
    const route = useRoute();
    const queryKey = ["customer-municipality", districtId];
    const queryClient = useQueryClient();

    const invalidateQuery = () => {
        queryClient.invalidateQueries(queryKey);
    };

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await httpClient.get(
                route("home-insurance.municipalities", {
                    axiom_district_id: districtId,
                }),
            );
            return response;
        },
        enabled: !!districtId,
        retry: 2,
    });

    return { ...query, invalidateQuery };
}

export default useGetCustomerMunicipalityQuery;
