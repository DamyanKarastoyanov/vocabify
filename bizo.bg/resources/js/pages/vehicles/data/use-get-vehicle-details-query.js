/**
 * External dependencies
 */
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

function useGetVehicleDetailsQuery(vehicleId) {
    const route = useRoute();

    const query = useQuery({
        queryKey: ["vehicle-details", vehicleId],
        queryFn: async () => {
            const response = await httpClient.get(
                route("vehicles.show", { vehicle: vehicleId }),
            );
            return response;
        },
        enabled: !!vehicleId,
        retry: 2,
        retryDelay: 1000,
    });

    return query;
}

export default useGetVehicleDetailsQuery;
