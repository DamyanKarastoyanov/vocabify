/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useEditPersonMutation = (personId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.put(
                route("persons.update", { person: personId }),
                data,
            );
        },
    });
};

export default useEditPersonMutation;
