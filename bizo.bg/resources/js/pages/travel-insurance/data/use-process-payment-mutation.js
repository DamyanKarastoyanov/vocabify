/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useProcessPaymentMutation = (offerId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: () => {
            return httpClient.post(
                route("travel-insurance.payment", { offer: offerId }),
            );
        },
    });
};

export default useProcessPaymentMutation;
