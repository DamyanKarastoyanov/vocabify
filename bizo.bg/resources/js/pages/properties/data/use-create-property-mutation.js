/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useCreatePropertyMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(route("properties.create"), data);
        },
    });
};

export default useCreatePropertyMutation;
