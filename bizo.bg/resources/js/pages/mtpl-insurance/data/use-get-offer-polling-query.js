/**
 * External dependencies
 */
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "ziggy-js";
import { useRef, useEffect, useState } from "react";

/**
 * Internal dependencies
 */
import httpClient from "@/data/http-client";

const INITIAL_DELAY_MS = 5000;
const POLLING_INTERVAL_MS = 10000;
const MAX_POLLING_DURATION_MS = 120000;

function useGetOfferPollingQuery(calculationId) {
    const route = useRoute();
    const startTimeRef = useRef(Date.now());
    const [canStartPolling, setCanStartPolling] = useState(false);

    useEffect(() => {
        if (calculationId) {
            startTimeRef.current = Date.now();
            const timer = setTimeout(() => {
                setCanStartPolling(true);
            }, INITIAL_DELAY_MS);
            return () => clearTimeout(timer);
        } else {
            setCanStartPolling(false);
        }
    }, [calculationId]);

    const query = useQuery({
        queryKey: ["mtpl-offer-polling", calculationId],
        queryFn: async () => {
            const response = await httpClient.post(
                route("mtpl-insurance.check-calculation"),
                {
                    calculation_id: calculationId,
                },
            );
            return response;
        },
        enabled: calculationId !== null && canStartPolling,
        refetchInterval: (query) => {
            if (query.state.status === "error") {
                return false;
            }

            // defaultDataSelector returns response.data, so query.state.data is the API response directly
            const responseData = query.state.data;

            // Stop polling if calculation is finished or completed
            if (
                responseData?.finished ||
                responseData?.status === "completed"
            ) {
                return false;
            }

            const elapsed = Date.now() - startTimeRef.current;

            if (elapsed >= MAX_POLLING_DURATION_MS) return false;

            // Continue polling if still pending
            if (responseData?.status === "pending") {
                return POLLING_INTERVAL_MS;
            }

            return false;
        },
        refetchIntervalInBackground: true,
    });

    return query;
}

export default useGetOfferPollingQuery;
