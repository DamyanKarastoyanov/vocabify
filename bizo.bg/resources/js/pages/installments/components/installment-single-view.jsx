/**
 * External dependencies
 */
import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import useGetInstallmentDetailsQuery from "@/pages/installments/data/use-get-installment-details-query";
import InstallmentPaymentSuccess from "@/pages/installments/components/installment-payment-success";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import IconButton from "@/components/icon-button/icon-button";
import Box from "@/components/box/box";
import PaymentTypeForm from "@/pages/installments/components/payment-type-form";
import IconDocument from "@/components/icons/document";
import IconDownload from "@/components/icons/download";
import IconEye from "@/components/icons/eye";
import Alert from "@/components/alert/alert";
import useAlert from "@/components/alert/hooks/use-alert";
import IconPayment from "@/components/icons/payment";
import { formatDate } from "@/utils/formatting";
import Spinner from "@/components/spinner/spinner";

const InstallmentSingleView = (props) => {
    const { installmentId, onClose, statusesMapping } = props;
    const {
        isLoading: isLoadingDetails,
        isError,
        data: installmentDetails,
    } = useGetInstallmentDetailsQuery(installmentId);

    const route = useRoute();
    const { step, status } = route().params;

    const { showAlert: showSuccessAlert, closeAlert: closeSuccessAlert } =
        useAlert(
            Alert,
            {
                duration: Infinity,
                style: {
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                },
            },
            false,
        ); // Changed to false to prevent auto-dismissing

    if (status === "success") {
        return <InstallmentPaymentSuccess />;
    }

    const handleDownloadNote = () => {
        if (installmentDetails?.debit_note_download_url) {
            window.open(installmentDetails.debit_note_download_url);
        }
    };
    const handlePayInstallment = () => {
        router.visit(
            route("installments.index", {
                installmentId: installmentId,
                step: "payment",
            }),
        );
    };

    const handleViewNote = () => {
        if (installmentDetails?.debit_note_view_url) {
            window.open(installmentDetails.debit_note_view_url);
        }
    };

    const getStatusClass = (status) => {
        if (status === "Verified") {
            return "bz-text-active";
        }
        return "bz-text-not-active";
    };

    const renderInstallmentCard = () => {
        const statusClass = getStatusClass(installmentDetails?.status);

        return (
            <div className="bz-installment-single-view-card">
                <div className="bz-installment-single-view-card__left">
                    <BlockStack gap="800">
                        <InlineStack gap="400">
                            <Icon icon={IconPayment} size="1400" />
                            <BlockStack gap="0">
                                <Text variant="body-s" color="text-secondary">
                                    Плащане
                                </Text>
                            </BlockStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            {installmentDetails?.status && (
                                <div
                                    className={`bz-installment-status-badge ${statusClass}`}
                                >
                                    <Text variant="body-s" color="inherit">
                                        {
                                            statusesMapping[
                                                installmentDetails.status
                                            ]
                                        }
                                    </Text>
                                </div>
                            )}

                            <Text variant="heading-l" fontWeight="bold">
                                {installmentDetails?.title || "N/A"}
                            </Text>

                            {installmentDetails?.insurer_name && (
                                <Text variant="body-m" color="subdued">
                                    {installmentDetails.insurer_name}
                                </Text>
                            )}
                        </BlockStack>
                    </BlockStack>
                </div>

                <div className="bz-installment-single-view-card__right">
                    <BlockStack gap="400">
                        <InlineStack
                            gap="400"
                            align="space-between"
                            className="bz-installment-details-header"
                            blockAlign="center"
                        >
                            <InlineStack gap="400">
                                <Icon icon={IconDocument} size="600" />
                                <Text variant="heading-s" fontWeight="semibold">
                                    Детайли
                                </Text>
                            </InlineStack>

                            <InlineStack gap="200">
                                {installmentDetails?.debit_note_view_url && (
                                    <Button
                                        variant="plain"
                                        onClick={handleViewNote}
                                    >
                                        <InlineStack
                                            gap="200"
                                            wrap={false}
                                            blockAlign="center"
                                        >
                                            <Icon
                                                icon={IconEye}
                                                size="600"
                                                color="brand-500"
                                            />

                                            <Text
                                                variant="body-s"
                                                color="brand-500"
                                            >
                                                Отвори дебитна нота
                                            </Text>
                                        </InlineStack>
                                    </Button>
                                )}

                                {installmentDetails?.debit_note_download_url && (
                                    <Button
                                        variant="plain"
                                        onClick={handleDownloadNote}
                                    >
                                        <InlineStack
                                            gap="200"
                                            wrap={false}
                                            blockAlign="center"
                                        >
                                            <Icon
                                                icon={IconDownload}
                                                size="600"
                                                color="brand-500"
                                            />

                                            <Text
                                                variant="body-s"
                                                color="brand-500"
                                            >
                                                Изтегли дебитна нота
                                            </Text>
                                        </InlineStack>
                                    </Button>
                                )}

                                {installmentDetails?.payment_type === "-" && (
                                    <Button
                                        variant="plain"
                                        onClick={handlePayInstallment}
                                    >
                                        <Text color="brand-500">Заплати</Text>
                                    </Button>
                                )}
                            </InlineStack>
                        </InlineStack>

                        <BlockStack gap="400">
                            <div className="bz-installment-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Вид плащане:
                                </Text>
                                <div className="bz-installment-detail-separator" />
                                <Text variant="body-s">
                                    {installmentDetails?.payment_type || "N/A"}
                                </Text>
                            </div>

                            <div className="bz-installment-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Сума:
                                </Text>
                                <div className="bz-installment-detail-separator" />
                                <Text variant="body-s">
                                    {installmentDetails?.price || "N/A"}
                                </Text>
                            </div>

                            <div className="bz-installment-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Вноска:
                                </Text>
                                <div className="bz-installment-detail-separator" />
                                <Text variant="body-s">
                                    {installmentDetails?.installment_number &&
                                    installmentDetails?.installment_total_count
                                        ? `${installmentDetails.installment_number}/${installmentDetails.installment_total_count}`
                                        : "N/A"}
                                </Text>
                            </div>

                            <div className="bz-installment-detail-row">
                                <Text variant="body-s" color="text-secondary">
                                    Плащане до:
                                </Text>
                                <div className="bz-installment-detail-separator" />
                                <Text variant="body-s">
                                    {installmentDetails?.due_date
                                        ? formatDate(
                                              installmentDetails.due_date,
                                              "dd.MM.yyyy",
                                          )
                                        : "N/A"}
                                </Text>
                            </div>
                        </BlockStack>
                    </BlockStack>
                </div>
            </div>
        );
    };

    if (step === "payment") {
        return (
            <PaymentTypeForm installmentId={installmentId} onClose={onClose} />
        );
    }

    if (isLoadingDetails) {
        return (
            <Box>
                <Spinner />
            </Box>
        );
    }

    if (!installmentDetails) {
        return null;
    }

    return (
        <BlockStack className="bz-installment-single-view" gap="800">
            {renderInstallmentCard()}
        </BlockStack>
    );
};

export default InstallmentSingleView;
