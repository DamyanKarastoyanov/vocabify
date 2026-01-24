/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useDeletePersonMutation = (personId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: () => {
            return httpClient.delete(
                route("persons.delete", { person: personId }),
            );
        },
    });
};

export default useDeletePersonMutation;
