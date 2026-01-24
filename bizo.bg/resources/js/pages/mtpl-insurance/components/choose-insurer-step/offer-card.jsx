/**
 * External dependencies
 */
import { useCallback, useState, useEffect } from "react";
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Icon from "@/components/icon/icon";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import useChooseInsurerMutation from "@/pages/mtpl-insurance/data/use-choose-insurer-mutation";
import CaptainBizoOffers from "@assets/CaptainBizoOffers.png";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import OfferCardMobile from "@/pages/mtpl-insurance/components/choose-insurer-step/offer-card-mobile";

const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
};

const OfferCard = (props) => {
    const { offer, isAnimating, isSelected } = props;
    // Initialize with actual window width if available (for SSR compatibility)
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth <= 1024;
        }
        return false;
    });

    // All hooks must be called before any conditional returns
    // Context hooks
    const { setLastVisitedStep } = useFormDataContext();
    const { setIsOfferSelected } = useValidityContext();
    const { setInsuredAdditionalFields, setOfferData, offerData } =
        useInsuranceDataContext();
    const { mutateAsync: chooseInsurerMutation, isPending } =
        useChooseInsurerMutation();

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const handleSelect = useCallback(async () => {
        const effectiveOffer = offer ?? offerData;
        if (!effectiveOffer) {
            return;
        }

        // Validate that offer has a valid price before proceeding
        const totalPrice = effectiveOffer.total_price;
        if (
            !totalPrice ||
            totalPrice === 0 ||
            isNaN(totalPrice) ||
            totalPrice <= 0
        ) {
            showAlert({
                title: "Възникна грешка",
                message: "Невалидна оферта. Моля, опитайте отново.",
                status: "error",
                closable: true,
                cta: {
                    label: "OK",
                    actionFun: () => {
                        closeAlert();
                    },
                },
            });
            return;
        }

        try {
            // Use Broqee offer ID for API call, fallback to id if not available
            const offerIdToSend =
                effectiveOffer.broqee_offer_id || effectiveOffer.id;

            const response = await chooseInsurerMutation({
                offer: offerIdToSend,
            });

            const responseData = response?.data ?? response;
            if (responseData) {
                setInsuredAdditionalFields(responseData);
            }

            setOfferData(offer);
            setIsOfferSelected(true);
            setLastVisitedStep(4);
            router.reload({
                data: { step: 4 },
                preserveScroll: false,
                onFinish: () => window.scrollTo(0, 0),
            });
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Възникна грешка при избор на застраховател. Моля, опитайте отново.";

            showAlert({
                title: "Възникна грешка",
                message: errorMessage,
                status: "error",
                closable: true,
                cta: {
                    label: "OK",
                    actionFun: () => {
                        closeAlert();
                    },
                },
            });
        }
    }, [
        offer,
        offerData,
        chooseInsurerMutation,
        setInsuredAdditionalFields,
        setIsOfferSelected,
        setLastVisitedStep,
        setOfferData,
        showAlert,
        closeAlert,
    ]);

    const getInstallmentDistribution = () => {
        const payments =
            offer?.installments ??
            (Array.isArray(offer?.payments)
                ? offer.payments
                : Object.values(offer?.payments ?? {}));

        // Only show breakdown if there are multiple payments
        if (!payments || payments.length <= 1) {
            return null;
        }

        return payments
            .map((p) => formatPrice(p.total_bgn ?? p.total ?? 0))
            .join(" + ");
    };

    const installmentBreakdown = getInstallmentDistribution();

    // Use mobile component for tablet and mobile
    if (isMobile) {
        return (
            <OfferCardMobile
                offer={offer}
                isAnimating={isAnimating}
                isSelected={isSelected}
            />
        );
    }

    const cardClassName = `mtpl-insurance__offer-card ${
        isAnimating
            ? "mtpl-insurance__offer-card--entering"
            : "mtpl-insurance__offer-card--visible"
    } ${isSelected ? "mtpl-insurance__offer-card--selected" : ""} ${
        offer?.isCheapest ? "mtpl-insurance__offer-card--best" : ""
    }`;

    // Best offer (cheapest) - special blue card with mascot
    if (offer?.isCheapest) {
        return (
            <div className={cardClassName}>
                <div className="mtpl-insurance__offer-card-best-wrapper">
                    {/* Mascot and badge */}
                    <div className="mtpl-insurance__offer-card-mascot">
                        <img
                            src={CaptainBizoOffers}
                            alt="Captain Bizo"
                            className="mtpl-insurance__offer-card-mascot-image"
                        />
                        <div className="mtpl-insurance__offer-card-badge">
                            <span>НАЙ-НИСКА</span>
                            <span>ЦЕНА</span>
                        </div>
                    </div>

                    {/* Inner white card */}
                    <div className="mtpl-insurance__offer-card-inner">
                        <InlineStack
                            align="space-between"
                            blockAlign="center"
                            gap="600"
                        >
                            {/* Insurer info */}
                            <InlineStack gap="600" blockAlign="center">
                                <Icon icon={offer?.insurer_icon} size="1200" />
                                <Text
                                    variant="body-m"
                                    textTransform="capitalize"
                                >
                                    {offer.insurer_name}
                                </Text>
                            </InlineStack>

                            {/* Price and button */}
                            <InlineStack
                                blockAlign="center"
                                gap="600"
                                className="mtpl-insurance__offer-card-actions"
                            >
                                <BlockStack gap="0" inlineAlign="end">
                                    <Text
                                        variant="heading-m"
                                        fontWeight="semibold"
                                    >
                                        {formatPrice(offer?.total_price)}{" "}
                                        {offer?.currency}
                                    </Text>
                                    {installmentBreakdown && (
                                        <Text
                                            variant="body-xs"
                                            align="right"
                                            className="mtpl-insurance__installment-breakdown"
                                        >
                                            {installmentBreakdown}
                                        </Text>
                                    )}
                                </BlockStack>

                                <Button
                                    variant="outline"
                                    onClick={handleSelect}
                                    disabled={
                                        isPending ||
                                        !offer?.total_price ||
                                        offer?.total_price <= 0
                                    }
                                    loading={isPending}
                                >
                                    Избери
                                </Button>
                            </InlineStack>
                        </InlineStack>
                    </div>
                </div>
            </div>
        );
    }

    // Regular offer card
    return (
        <div className={cardClassName}>
            <div className="mtpl-insurance__offer-card-default">
                <InlineStack
                    align="space-between"
                    blockAlign="center"
                    className="mtpl-insurance__offer-card-content"
                >
                    {/* Insurer info */}
                    <InlineStack gap="600" blockAlign="center">
                        <Icon icon={offer?.insurer_icon} size="1200" />
                        <Text variant="body-m" textTransform="capitalize">
                            {offer.insurer_name}
                        </Text>
                    </InlineStack>

                    {/* Price and button */}
                    <InlineStack
                        blockAlign="center"
                        gap="600"
                        className="mtpl-insurance__offer-card-actions"
                    >
                        {installmentBreakdown && (
                            <Text
                                variant="body-s"
                                className="mtpl-insurance__installment-breakdown"
                            >
                                {installmentBreakdown}
                            </Text>
                        )}

                        <Text variant="heading-m" fontWeight="semibold">
                            {formatPrice(offer?.total_price)} {offer?.currency}
                        </Text>

                        <Button
                            variant="outline"
                            onClick={handleSelect}
                            disabled={
                                isPending ||
                                !offer?.total_price ||
                                offer?.total_price <= 0
                            }
                            loading={isPending}
                        >
                            Избери
                        </Button>
                    </InlineStack>
                </InlineStack>
            </div>
        </div>
    );
};

export default OfferCard;
