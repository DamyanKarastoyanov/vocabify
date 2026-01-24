/**
 * External dependencies
 */
import { router, usePage } from "@inertiajs/react";
import { useMemo, useEffect } from "react";
import { useRoute } from "ziggy-js";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import FilterPicker from "@/components/filter-picker/filter-picker";
import InlineStack from "@/components/inline-stack/inline-stack";
import EntityCard from "@/components/entity-card/entity-card";
import Icon from "@/components/icon/icon";
import IconShield from "@/components/icons/shield";
import IconDocument from "@/components/icons/document";
import Text from "@/components/text/text";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import PolicySingleView from "@/pages/policies/components/policy-single-view";
import { formatDate } from "@/utils/formatting";
import { stripHash, ensureIndexHash } from "@/utils/hash-utils";

const policiesTypes = [
    "Застраховка имущество",
    "Застраховка при пътуване в чужбина",
    "Медицинска застраховка за чужденци",
    "Гражданска отговорност",
];

const parseFilters = (filterString) => {
    if (!filterString) return {};

    const filters = {};
    const filterPairs = filterString.split(",");

    filterPairs.forEach((pair) => {
        const [key, value] = pair.split(":");
        if (key && value) {
            filters[key.trim()] = value.trim();
        }
    });

    return filters;
};

const buildFilterString = (filters) => {
    const filterPairs = Object.entries(filters)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}:${value}`);

    return filterPairs.length > 0 ? filterPairs.join(",") : null;
};

const Policies = () => {
    const { policies: policiesData } = usePage().props;
    const policies = policiesData?.policies;
    const policiesStatuses = policiesData?.policies_statuses;

    const route = useRoute();
    const { policyId } = route().params;

    const currentFilters = parseFilters(route().params.filter);
    const selectedPolicyType = currentFilters.insurance_type || null;
    const selectedPolicyStatus = currentFilters.status || null;

    useEffect(() => {
        if (!policyId) {
            ensureIndexHash();
        }
    }, []);

    const changePolicyTypeHandler = (type) => {
        const currentFilters = parseFilters(route().params.filter);

        if (type) {
            currentFilters.insurance_type = type;
        } else {
            delete currentFilters.insurance_type;
        }

        router.reload({
            data: {
                ...route().params,
                filter: buildFilterString(currentFilters),
            },
        });
    };

    const changePolicyStatusHandler = (status) => {
        const currentFilters = parseFilters(route().params.filter);

        if (status) {
            currentFilters.status = status;
        } else {
            delete currentFilters.status;
        }

        router.reload({
            data: {
                ...route().params,
                filter: buildFilterString(currentFilters),
            },
        });
    };

    const policiesByType = useMemo(() => {
        const collections = {};
        policiesTypes.forEach((type) => {
            collections[type] = policies.filter(
                (policy) => policy.insurance_type === type,
            );
        });
        return collections;
    }, [policies, policiesTypes]);

    const onClickHandler = (id) => {
        router.reload({
            data: {
                ...route().params,
                policyId: id,
            },
            onFinish: stripHash,
        });
        window.scrollTo(0, 0);
    };

    const onClosePolicyView = () => {
        router.reload({
            data: {
                ...route().params,
                policyId: null,
            },
            onFinish: ensureIndexHash,
        });
        window.scrollTo(0, 0);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Активна":
                return "bz-text-active";
            case "Отказана":
            case "Отменена":
            case "Изтекла":
                return "bz-text-declined";
            case "Ти си на ход":
            case "Одобрението пътува":
            case "Очаква плащане":
            case "Колегата го гледа":
                return "bz-text-pending";
        }
    };

    const renderPolicies = (policies) => {
        return policies.map((policy) => {
            return (
                <EntityCard
                    key={policy.id}
                    id={policy.id}
                    icon={IconShield}
                    clickHandler={onClickHandler}
                    headerInfo={`${policy.title}`}
                    actionInfo={`<div class="${getStatusClass(policy.status)}">${policy.status}</div>`}
                    detailsInfo={
                        <InlineStack
                            className="bz-policy-details"
                            align="left"
                            gap="200"
                        >
                            <Text variant="body-s" color="text-secondary">
                                {policy.installment_summary}
                            </Text>

                            {policy.installment_due_date && (
                                <>
                                    <Text
                                        variant="body-s"
                                        color="text-secondary"
                                    >
                                        ( Следващо плащане до:{" "}
                                    </Text>

                                    <Text variant="body-s">
                                        {formatDate(
                                            policy.installment_due_date,
                                            "dd.MM.yyyy",
                                        )}{" "}
                                        )
                                    </Text>
                                </>
                            )}
                        </InlineStack>
                    }
                    detailsInfo2={
                        <Text variant="body-s" color="text-secondary">
                            Валидност:{" "}
                            {formatDate(policy.start_date, "dd.MM.yyyy")} -{" "}
                            {formatDate(policy.end_date, "dd.MM.yyyy")}
                        </Text>
                    }
                />
            );
        });
    };

    if (policyId) {
        return (
            <PolicySingleView policyId={policyId} onClose={onClosePolicyView} />
        );
    }

    return (
        <Surface>
            <Box className="bz-policies-holder" padding="1000">
                <BlockStack gap="800">
                    <InlineStack gap="500" align="space-between">
                        <InlineStack gap="300">
                            <Icon icon={IconDocument} size="600" />
                            <Text variant="heading-m">Застраховки</Text>
                        </InlineStack>

                        <InlineStack gap="300">
                            <FilterPicker
                                title="Вид застраховки"
                                values={policiesTypes}
                                selectedValue={selectedPolicyType}
                                onChange={changePolicyTypeHandler}
                            />
                            <FilterPicker
                                title="Статус"
                                values={policiesStatuses.map(
                                    (status) => status.label,
                                )}
                                selectedValue={selectedPolicyStatus}
                                onChange={changePolicyStatusHandler}
                            />
                        </InlineStack>
                    </InlineStack>

                    <BlockStack className="bz-properties-list" gap="400">
                        {policiesTypes.map((type) => {
                            const typePolicies = policiesByType[type];
                            if (!typePolicies || typePolicies.length === 0) {
                                return null;
                            }

                            return (
                                <BlockStack key={type} gap="400">
                                    <Text
                                        variant="body-m"
                                        fontWeight="semibold"
                                    >
                                        {type}
                                    </Text>
                                    {renderPolicies(typePolicies)}
                                </BlockStack>
                            );
                        })}
                    </BlockStack>
                </BlockStack>
            </Box>
        </Surface>
    );
};

export default AuthenticatedLayout.wrap(Policies);
