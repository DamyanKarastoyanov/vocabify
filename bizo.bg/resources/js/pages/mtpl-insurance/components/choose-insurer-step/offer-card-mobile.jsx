/**
 * External dependencies
 */
import { useCallback } from "react";
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
import Box from "@/components/box/box";

const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
};

const OfferCardMobile = (props) => {
    const { offer, isAnimating, isSelected } = props;

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

    const cardClassName = `mtpl-insurance__offer-card-mobile ${
        isAnimating
            ? "mtpl-insurance__offer-card-mobile--entering"
            : "mtpl-insurance__offer-card-mobile--visible"
    } ${isSelected ? "mtpl-insurance__offer-card-mobile--selected" : ""} ${
        offer?.isCheapest ? "mtpl-insurance__offer-card-mobile--best" : ""
    }`;

    // Best offer (cheapest) - special blue card with mascot
    if (offer?.isCheapest) {
        return (
            <div className={cardClassName}>
                <div className="mtpl-insurance__offer-card-mobile-best-wrapper">
                    {/* Mascot */}
                    <div className="mtpl-insurance__offer-card-mobile-mascot">
                        <img
                            src={CaptainBizoOffers}
                            alt="Captain Bizo"
                            className="mtpl-insurance__offer-card-mobile-mascot-image"
                        />
                    </div>

                    {/* Blue header banner */}
                    <div className="mtpl-insurance__offer-card-mobile-header">
                        <Text
                            variant="body-s"
                            fontWeight="bold"
                            className="mtpl-insurance__offer-card-mobile-badge-text"
                        >
                            НАЙ-НИСКА ЦЕНА
                        </Text>
                    </div>

                    {/* White main body */}
                    <div className="mtpl-insurance__offer-card-mobile-body">
                        <BlockStack gap="400">
                            {/* Company name and logo */}
                            <InlineStack
                                gap="200"
                                align="space-between"
                                blockAlign="center"
                            >
                                <InlineStack
                                    gap="200"
                                    blockAlign="center"
                                    className="mtpl-insurance__offer-card-mobile-logo"
                                >
                                    <Icon
                                        icon={offer?.insurer_icon}
                                        size="1200"
                                    />
                                </InlineStack>

                                <Text
                                    variant="body-s"
                                    fontWeight="medium"
                                    className="mtpl-insurance__offer-card-mobile-company-name"
                                >
                                    {offer.insurer_name}
                                </Text>
                            </InlineStack>

                            <InlineStack
                                gap="200"
                                align="space-between"
                                blockAlign="center"
                            >
                                {/* Price breakdown and total */}
                                <BlockStack>
                                    {installmentBreakdown && (
                                        <Text
                                            variant="body-xs"
                                            className="mtpl-insurance__offer-card-mobile-price-breakdown"
                                        >
                                            {installmentBreakdown}
                                        </Text>
                                    )}
                                    <Text
                                        variant="heading-xl"
                                        fontWeight="medium"
                                        className="mtpl-insurance__offer-card-mobile-total-price"
                                    >
                                        {formatPrice(offer?.total_price)}{" "}
                                        {offer?.currency}
                                    </Text>
                                </BlockStack>

                                {/* Select button */}
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
                        </BlockStack>
                    </div>
                </div>
            </div>
        );
    }

    // Regular offer card
    return (
        <div className={cardClassName}>
            <div className="mtpl-insurance__offer-card-mobile-body">
                <BlockStack gap="400">
                    {/* Company name and logo */}
                    <InlineStack
                        gap="200"
                        align="space-between"
                        blockAlign="center"
                    >
                        <InlineStack
                            gap="200"
                            blockAlign="center"
                            className="mtpl-insurance__offer-card-mobile-logo"
                        >
                            <Icon icon={offer?.insurer_icon} size="1200" />
                        </InlineStack>

                        <Text
                            variant="body-s"
                            fontWeight="medium"
                            className="mtpl-insurance__offer-card-mobile-company-name"
                        >
                            {offer.insurer_name}
                        </Text>
                    </InlineStack>

                    <InlineStack
                        gap="200"
                        align="space-between"
                        blockAlign="center"
                    >
                        {/* Price breakdown and total */}
                        <BlockStack>
                            {installmentBreakdown && (
                                <Text
                                    variant="body-xs"
                                    className="mtpl-insurance__offer-card-mobile-price-breakdown"
                                >
                                    {installmentBreakdown}
                                </Text>
                            )}
                            <Text
                                variant="heading-l"
                                fontWeight="bold"
                                className="mtpl-insurance__offer-card-mobile-total-price"
                            >
                                {formatPrice(offer?.total_price)}{" "}
                                {offer?.currency}
                            </Text>
                        </BlockStack>

                        {/* Select button */}
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
                </BlockStack>
            </div>
        </div>
    );
};

export default OfferCardMobile;
