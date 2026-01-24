/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useEditPropertyMutation = (propertyId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.put(
                route("properties.update", { property: propertyId }),
                data,
            );
        },
    });
};

export default useEditPropertyMutation;
