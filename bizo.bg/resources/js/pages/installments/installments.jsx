/**
 * External dependencies
 */
import { router, usePage } from "@inertiajs/react";
import { useMemo, useEffect } from "react";
import { useRoute } from "ziggy-js";
/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import EntityCard from "@/components/entity-card/entity-card";
import IconPayment from "@/components/icons/payment";
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";
import FilterPicker from "@/components/filter-picker/filter-picker";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import InstallmentSingleView from "@/pages/installments/components/installment-single-view";
import { stripHash, ensureIndexHash } from "@/utils/hash-utils";

const installmentsTypesMapping = [
    {
        value: "completed",
        label: "Потвърдени",
    },
    {
        value: "pending",
        label: "Предстоящи",
    },
];

const installmentsInsuranceTypes = [
    "Застраховка имущество",
    "Застраховка при пътуване в чужбина",
    "Медицинска застраховка за чужденци",
    "Гражданска отговорност",
];

const statusesMapping = {
    Verified: "Потвърдени",
    Pending: "Предстоящи",
};

const Installments = () => {
    const { installments } = usePage().props;
    const { installments: installmentsData } = installments;

    const route = useRoute();
    const { installmentId } = route().params;

    const installmentsStatuses = Object.keys(statusesMapping);

    const selectedInstallmentInsuranceType = route().params.filter
        ? route().params.filter.split(":")[1]
        : null;
    const selectedInstallmentStatus = route().params.type || null;

    useEffect(() => {
        if (!installmentId) {
            ensureIndexHash();
        }
    }, []);

    const changeInstallmentInsuranceTypeHandler = (type) => {
        router.reload({
            data: {
                ...route().params,
                filter: type ? `insurance_type:${type}` : null,
            },
        });
    };

    const changeInstallmentStatusHandler = (status) => {
        router.reload({
            data: {
                ...route().params,
                type:
                    installmentsTypesMapping.find(
                        (item) => item.label === status,
                    )?.value || "all",
            },
        });
    };

    const installmentsByStatus = useMemo(() => {
        const collections = {};
        installmentsStatuses.forEach((status) => {
            collections[status] = installmentsData.filter(
                (installment) => installment.status === status,
            );
        });
        return collections;
    }, [installmentsData, installmentsStatuses]);

    const onClickHandler = (id) => {
        router.reload({
            data: {
                ...route().params,
                installmentId: id,
            },
            onFinish: stripHash,
        });
        window.scrollTo(0, 0);
    };

    const onCloseInstallmentView = () => {
        router.reload({
            data: {
                ...route().params,
                installmentId: null,
            },
            onFinish: ensureIndexHash,
        });
        window.scrollTo(0, 0);
    };

    const renderInstallments = (installments) => {
        return installments.map((installment) => {
            return (
                <EntityCard
                    key={installment.id}
                    id={installment.id}
                    icon={IconPayment}
                    clickHandler={onClickHandler}
                    headerInfo={`${installment.title}`}
                    actionInfo={`<div class="bz-installment-amount">${installment.amount}</div>`}
                    detailsInfo={
                        <InlineStack
                            className="bz-installment-details"
                            align="left"
                            gap="100"
                        >
                            {installment.insurer_name && (
                                <Text variant="body-s" color="text-secondary">
                                    {installment.insurer_name},
                                </Text>
                            )}

                            <Text variant="body-s" color="text-secondary">
                                {installment.insurance_type}
                            </Text>
                        </InlineStack>
                    }
                />
            );
        });
    };

    if (installmentId) {
        return (
            <InstallmentSingleView
                statusesMapping={statusesMapping}
                installmentId={installmentId}
                onClose={onCloseInstallmentView}
            />
        );
    }

    return (
        <Surface>
            <Box className="bz-installments-holder" padding="1000">
                <BlockStack gap="800">
                    <InlineStack gap="500" align="space-between">
                        <InlineStack gap="300">
                            <Icon icon={IconPayment} size="600" />
                            <Text variant="heading-m">Плащания</Text>
                        </InlineStack>

                        <InlineStack gap="300">
                            <FilterPicker
                                title="Статус"
                                values={installmentsTypesMapping.map(
                                    (item) => item.label,
                                )}
                                selectedValue={
                                    installmentsTypesMapping.find(
                                        (item) =>
                                            item.value ===
                                            selectedInstallmentStatus,
                                    )?.label
                                }
                                onChange={changeInstallmentStatusHandler}
                            />
                            <FilterPicker
                                title="Вид"
                                values={installmentsInsuranceTypes}
                                selectedValue={selectedInstallmentInsuranceType}
                                onChange={changeInstallmentInsuranceTypeHandler}
                            />
                        </InlineStack>
                    </InlineStack>

                    <BlockStack className="bz-installments-list" gap="400">
                        {installmentsStatuses.map((status) => {
                            const statusInstallments =
                                installmentsByStatus[status];
                            if (
                                !statusInstallments ||
                                statusInstallments.length === 0
                            ) {
                                return null;
                            }

                            return (
                                <BlockStack key={status} gap="400">
                                    <Text
                                        variant="body-m"
                                        fontWeight="semibold"
                                    >
                                        {statusesMapping[status]}
                                    </Text>
                                    {renderInstallments(statusInstallments)}
                                </BlockStack>
                            );
                        })}
                    </BlockStack>
                </BlockStack>
            </Box>
        </Surface>
    );
};

export default AuthenticatedLayout.wrap(Installments);
