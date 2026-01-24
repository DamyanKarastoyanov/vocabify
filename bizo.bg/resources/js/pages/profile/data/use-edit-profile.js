/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useEditProfileMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(route("profile.update"), data);
        },
    });
};

export default useEditProfileMutation;
