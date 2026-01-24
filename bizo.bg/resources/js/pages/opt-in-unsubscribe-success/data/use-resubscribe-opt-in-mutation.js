/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useResubscribeOptInMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(route("opt-in.resubscribe"), data);
        },
    });
};

export default useResubscribeOptInMutation;
