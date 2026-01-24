/**
 * External dependencies
 */
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { router, usePage } from "@inertiajs/react";
/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import { usePopperContext } from "@/components/popper";
import useEditPolicyMutation from "@/pages/admin/policies/data/use-edit-policy";
import IconX from "@/components/icons/x";
import IconButton from "@/components/icon-button/icon-button";

//make them in bulgarian
const innerPolicyStatusOptions = [
    {
        label: "Чернова",
        value: 1,
    },
    {
        label: "Ти си на ход",
        value: 2,
    },
    {
        label: "Одобрението пътува",
        value: 3,
    },
    {
        label: "Очаква плащане",
        value: 4,
    },
    {
        label: "Колегата го гледа",
        value: 5,
    },
    {
        label: "Активна",
        value: 6,
    },
    {
        label: "Изтекла",
        value: 7,
    },
    {
        label: "Отменена",
        value: 8,
    },
    {
        label: "Отказана",
        value: 9,
    },
];

const policyStatusOptions = [
    {
        label: "Активна",
        value: 1,
    },
    {
        label: "Неактивна",
        value: 2,
    },
];

const EditPolicyForm = (props) => {
    const { setIsOpen } = usePopperContext();
    const { datarow } = props;

    const { policies: policiesData } = usePage().props;

    const columns = policiesData?.columns || {};

    const fields = useMemo(() => {
        return Object.values(columns)
            .filter((col) => col?.key && col.key !== "manage")
            .map((col) => {
                switch (col.key) {
                    case "policy_status":
                        return {
                            key: "policy_status",
                            label: "Статус",
                            isVisible: true,
                            isEnabled: true,
                            values: policyStatusOptions,
                            selected: policyStatusOptions.find(
                                (option) =>
                                    option.label === datarow?.policy_status,
                            ),
                        };
                    case "policy_internal_status":
                        return {
                            key: "policy_internal_status",
                            label: "Статус в Бизо",
                            isVisible: true,
                            isEnabled: true,
                            values: innerPolicyStatusOptions,
                            selected: innerPolicyStatusOptions.find(
                                (option) =>
                                    option.label ===
                                    datarow?.policy_internal_status,
                            ),
                        };
                    default:
                        return {
                            key: col.key,
                            label: col.label || col.key,
                            selected: datarow?.[col.key] ?? "",
                        };
                }
            });
    }, [columns, datarow]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            policy_status: policyStatusOptions.find(
                (option) => option.label === datarow?.policy_status,
            ),
            policy_internal_status: innerPolicyStatusOptions.find(
                (option) => option.label === datarow?.policy_internal_status,
            ),
        },
    });

    const { mutate: editPolicy } = useEditPolicyMutation(datarow?.id);

    const onSubmit = (data) => {
        editPolicy(
            {
                axiom_policy_status_id: data.policy_status.value,
                policy_status_id: data.policy_internal_status.value,
            },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    router.reload({ only: ["policies"] });
                },
            },
        );
    };

    return (
        <BlockStack>
            <Form>
                <BlockStack gap="400">
                    <BlockStack gap="300" className="bz-admin-policies-details">
                        <InlineStack
                            align="space-between"
                            className="bz-admin-policies-details-header"
                        >
                            <Text variant="heading-m" color="blue-200">
                                Детайли за полицата
                            </Text>
                            <IconButton
                                icon={IconX}
                                onClick={() => setIsOpen(false)}
                            />
                        </InlineStack>

                        <BlockStack gap="200">
                            {fields.map((field) => {
                                if (
                                    field.key === "policy_status" ||
                                    field.key === "policy_internal_status"
                                ) {
                                    return null;
                                }
                                const value =
                                    (typeof field.selected === "object" &&
                                        field.selected?.label) ||
                                    field.selected ||
                                    field.placeholder;

                                return (
                                    <InlineStack
                                        key={field.key}
                                        align="space-between"
                                    >
                                        <Text
                                            variant="body-m"
                                            fontWeight="medium"
                                        >
                                            {field.label}:
                                        </Text>
                                        <Text
                                            variant="body-m"
                                            fontWeight="small"
                                        >
                                            {value}
                                        </Text>
                                    </InlineStack>
                                );
                            })}
                        </BlockStack>
                    </BlockStack>
                    {RenderFormFieldsUtils.renderSelectField({
                        fieldName: "policy_status",
                        fields,
                        control,
                        error: errors.policy_status?.message,
                    })}
                    {RenderFormFieldsUtils.renderSelectField({
                        fieldName: "policy_internal_status",
                        fields,
                        control,
                        error: errors.policy_internal_status?.message,
                    })}
                    <Button onClick={handleSubmit(onSubmit)}>Запази</Button>
                </BlockStack>
            </Form>
        </BlockStack>
    );
};

export default EditPolicyForm;
