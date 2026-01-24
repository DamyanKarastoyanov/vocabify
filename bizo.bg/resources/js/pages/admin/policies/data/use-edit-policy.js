/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useEditPolicyMutation = (policyId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(
                route("policies.admin.update", {
                    policy: policyId,
                }),
                data,
            );
        },
    });
};

export default useEditPolicyMutation;
