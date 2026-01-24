/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const useGuestPaymentMutation = (installmentId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(
                route("installments.guest-payment.process", {
                    installment: installmentId,
                }),
                data,
            );
        },
    });
};

export default useGuestPaymentMutation;
