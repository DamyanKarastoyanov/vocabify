/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";
import { useRoute } from "ziggy-js";

const useCheckInspectionMutation = () => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(route("vehicle-inspection.check"), data);
        },
    });
};

export default useCheckInspectionMutation;
