/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useCreatePolicyMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: async (data) => {
            const endpoint = route("mtpl-insurance.create-policy");
            try {
                const response = await httpClient.post(endpoint, data);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: (response) => {},
        onError: (error) => {},
    });
};

export default useCreatePolicyMutation;
