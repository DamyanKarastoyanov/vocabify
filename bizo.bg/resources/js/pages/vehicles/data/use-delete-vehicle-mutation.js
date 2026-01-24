/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useDeleteVehicleMutation = (vehicleId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: () => {
            return httpClient.delete(
                route("vehicles.delete", { vehicle: vehicleId }),
            );
        },
        retry: 2,
    });
};

export default useDeleteVehicleMutation;
