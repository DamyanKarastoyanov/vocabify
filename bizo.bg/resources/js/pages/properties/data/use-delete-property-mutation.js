/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useDeletePropertyMutation = (propertyId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: () => {
            return httpClient.delete(
                route("properties.delete", { property: propertyId }),
            );
        },
    });
};

export default useDeletePropertyMutation;
