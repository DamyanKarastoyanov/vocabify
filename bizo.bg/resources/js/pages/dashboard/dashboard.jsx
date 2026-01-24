/**
 * External dependencies
 */
import { router, usePage } from "@inertiajs/react";
import { useEffect } from "react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import Surface from "@/components/surface/surface";
import EntityCard from "@/components/entity-card/entity-card";
import IconPayment from "@/components/icons/payment";
import IconDocument from "@/components/icons/document";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconRightArrowPlain from "@/components/icons/right-arrow-plain";
import { ensureIndexHash, stripHash } from "@/utils/hash-utils";
import { formatDate } from "@/utils/formatting";

const Dashboard = () => {
    const { dashboard } = usePage().props;
    const { policies, installments } = dashboard;

    useEffect(() => {
        ensureIndexHash();
    }, []);

    const redirectToPage = (routeName) => {
        if (!routeName) return;
        router.visit(route(routeName), {
            onFinish: ensureIndexHash,
        });
        window.scrollTo(0, 0);
    };

    const onClickHandler = (type, id) => {
        const contentData = {};
        switch (type) {
            case "policies.index":
                contentData.policyId = id;
                break;
            case "installments.index":
                contentData.installmentId = id;
                break;
        }
        router.visit(route(type), {
            data: contentData,
            onFinish: ensureIndexHash,
        });
        window.scrollTo(0, 0);
    };

    const renderSectionHeader = (sectionTitle, pageRoute, icon) => {
        return (
            <BlockStack
                gap="300"
                className="bz-dashboard__content-header"
                onClick={() => redirectToPage(pageRoute)}
            >
                <InlineStack gap="300" align="space-between">
                    <InlineStack gap="300">
                        <Icon icon={icon} size="600" />
                        <Text variant="heading-m">{sectionTitle}</Text>
                    </InlineStack>

                    <Icon size="600" icon={IconRightArrowPlain} />
                </InlineStack>
            </BlockStack>
        );
    };

    const renderInstallments = (installments) => {
        return installments.map((installment) => {
            return (
                <EntityCard
                    key={installment.id}
                    id={installment.id}
                    icon={IconPayment}
                    clickHandler={() =>
                        onClickHandler("installments.index", installment.id)
                    }
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
                    clickHandler={() =>
                        onClickHandler("policies.index", policy.id)
                    }
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

    return (
        <BlockStack className="bz-dashboard" gap="600">
            <BlockStack gap="800">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            {renderSectionHeader(
                                "Застраховки",
                                "policies.index",
                                IconDocument,
                            )}

                            <BlockStack
                                gap="400"
                                className="bz-dashboard__policies-list"
                            >
                                {renderPolicies(policies)}
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>

                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            {renderSectionHeader(
                                "Плащания",
                                "installments.index",
                                IconPayment,
                            )}

                            <BlockStack
                                gap="400"
                                className="bz-dashboard__installments-list"
                            >
                                {renderInstallments(installments)}
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </BlockStack>
    );
};

export default AuthenticatedLayout.wrap(Dashboard);
