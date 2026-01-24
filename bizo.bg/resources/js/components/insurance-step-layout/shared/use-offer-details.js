import { useEffect, useState } from "react";

/**
 * Shared hook for managing offer details state and logic
 */
export const useOfferDetails = (offerDetails) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCalculationHolderClick = () => {
        setIsExpanded(!isExpanded);
    };

    const withOfferDetails =
        offerDetails &&
        offerDetails?.length > 0 &&
        offerDetails[0]?.items?.length > 0;

    // when offerDetails is changed, set isExpanded to false
    useEffect(() => {
        setIsExpanded(false);
    }, [offerDetails]);

    return {
        isExpanded,
        setIsExpanded,
        handleCalculationHolderClick,
        withOfferDetails,
    };
};
