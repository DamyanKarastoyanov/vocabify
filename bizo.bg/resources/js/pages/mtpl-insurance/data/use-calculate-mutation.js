/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useCalculateMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: async (payload) => {
            const response = await httpClient.post(
                route("mtpl-insurance.calculate"),
                payload,
            );
            return response.data;
        },
    });
};

export default useCalculateMutation;
