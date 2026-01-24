/**
 * External dependencies
 */
import { useState, useEffect } from "react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import OfferCard from "@/pages/mtpl-insurance/components/choose-insurer-step/offer-card";
import OfferCardSkeleton from "@/pages/mtpl-insurance/components/choose-insurer-step/offer-card-skeleton";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { transformOffersData } from "@/pages/mtpl-insurance/utils/transform-offers-data";

const OffersList = (props) => {
    const { offersData, isError } = props;
    const { offerData, setOfferData } = useInsuranceDataContext();

    const [displayedOffers, setDisplayedOffers] = useState([]);
    const [isRevealing, setIsRevealing] = useState(false);

    // Progressive reveal of offers
    useEffect(() => {
        if (!offersData || typeof offersData !== "object") {
            setDisplayedOffers([]);
            return;
        }

        const results = transformOffersData(offersData);

        const offers = Array.isArray(results)
            ? results
            : Object.values(results);

        if (offers.length === 0) {
            setDisplayedOffers([]);
            return;
        }

        const sortedOffers = [...offers].sort(
            (a, b) => a.total_price - b.total_price,
        );

        const offersWithCheapestFlag = sortedOffers.map((offer, index) => ({
            ...offer,
            isCheapest: index === 0,
        }));

        setDisplayedOffers([]);
        setIsRevealing(true);

        const timeouts = [];
        offersWithCheapestFlag.forEach((offer, index) => {
            const timeout = setTimeout(() => {
                setDisplayedOffers((prev) => [...prev, offer]);
                if (index === offersWithCheapestFlag.length - 1) {
                    setTimeout(() => setIsRevealing(false), 300);
                }
            }, index * 300);
            timeouts.push(timeout);
        });

        return () => timeouts.forEach((timeout) => clearTimeout(timeout));
    }, [offersData]);

    if (isError) {
        return null;
    }

    if (!offersData || displayedOffers.length === 0) {
        return (
            <BlockStack gap="400">
                <Box paddingBlock="400">
                    <Text variant="heading-s" align="center">
                        Търсим най-добрите оферти за теб...
                    </Text>
                </Box>
                {[1, 2, 3, 4].map((i) => (
                    <OfferCardSkeleton key={i} />
                ))}
            </BlockStack>
        );
    }

    // Show offers
    return (
        <BlockStack gap="600" className="mtpl-insurance__offers-list">
            {displayedOffers.map((offer, index) => (
                <OfferCard
                    key={offer.id || offer.offer || index}
                    offer={offer}
                    isSelected={offerData?.id === offer.id}
                    isAnimating={
                        isRevealing && index === displayedOffers.length - 1
                    }
                />
            ))}
        </BlockStack>
    );
};

export default OffersList;
