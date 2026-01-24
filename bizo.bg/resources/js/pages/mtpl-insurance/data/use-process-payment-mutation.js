/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useProcessPaymentMutation = (offerId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: () => {
            return httpClient.post(route("mtpl-insurance.payment"), {
                offer_id: offerId,
            });
        },
    });
};

export default useProcessPaymentMutation;
