/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

/**
 * Internal dependencies
 */
import OffersList from "@/pages/mtpl-insurance/components/choose-insurer-step/offers-list";
import BlockStack from "@/components/block-stack/block-stack";
import useGetOfferPollingQuery from "@/pages/mtpl-insurance/data/use-get-offer-polling-query";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";

const ChooseInsurerStep = () => {
    const { calculationId } = useInsuranceDataContext();

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const { data, isError, error } = useGetOfferPollingQuery(calculationId);
    const [pollingData, setPollingData] = useState(null);
    const [hasShownError, setHasShownError] = useState(false);

    // Watch for when offers are completed and update state
    useEffect(() => {
        // defaultDataSelector returns response.data, so data is the API response directly
        if (data?.status === "completed" && data?.results) {
            setPollingData(data.results);
            setHasShownError(false);
        } else if (!data || data?.status === "pending") {
            setPollingData(null);
        }
    }, [data]);

    // Handle polling errors
    useEffect(() => {
        if (isError && error && !hasShownError) {
            setHasShownError(true);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Възникна грешка при зареждане на оферти. Моля, опитайте отново.";

            showAlert({
                title: "Възникна грешка",
                message: errorMessage,
                status: "error",
                closable: true,
                cta: {
                    label: "OK",
                    actionFun: () => {
                        closeAlert();
                        setHasShownError(false);
                    },
                },
            });
        }
    }, [isError, error, hasShownError, showAlert, closeAlert]);

    return (
        <BlockStack gap="600">
            <OffersList offersData={pollingData} isError={isError} />
        </BlockStack>
    );
};

export default ChooseInsurerStep;
