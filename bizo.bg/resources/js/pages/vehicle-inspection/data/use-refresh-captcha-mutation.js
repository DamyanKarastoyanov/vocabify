/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";
import { useRoute } from "ziggy-js";

const useRefreshCaptchaMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: () => {
            return httpClient.get(route("vehicle-inspection.captcha"));
        },
    });
};

export default useRefreshCaptchaMutation;
