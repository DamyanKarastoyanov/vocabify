/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useProcessPaymentMutation = (installmentId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(
                route("installments.payment", { installment: installmentId }),
                data,
            );
        },
    });
};

export default useProcessPaymentMutation;
