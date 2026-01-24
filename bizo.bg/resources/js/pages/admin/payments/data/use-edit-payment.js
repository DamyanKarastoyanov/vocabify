/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Interal dependencies
 */
import httpClient from "@/data/http-client";

const useEditPaymentMutation = (bankTransferId) => {
    const route = useRoute();

    return useMutation({
        mutationFn: (data) => {
            return httpClient.post(
                route("payments.admin.update", {
                    bank_transfer: bankTransferId,
                }),
                data,
            );
        },
    });
};

export default useEditPaymentMutation;
