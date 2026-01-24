/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useGetOfferMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: async (data) => {
            // Initiate offer request - webhook will populate results
            const response = await httpClient.post(
                route("mtpl-insurance.get-offer"),
                data,
            );

            // Response should contain request_id for polling
            return response.data;
        },
    });
};

export default useGetOfferMutation;
