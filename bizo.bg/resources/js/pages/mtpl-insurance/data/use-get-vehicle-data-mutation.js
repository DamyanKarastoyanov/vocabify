/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useGetVehicleDataMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(
                route("mtpl-insurance.vehicle-person-data"),
                data,
            );
        },
    });
};

export default useGetVehicleDataMutation;
