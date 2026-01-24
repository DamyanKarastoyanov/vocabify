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
import useEditPaymentMutation from "@/pages/admin/payments/data/use-edit-payment";
import IconX from "@/components/icons/x";
import IconButton from "@/components/icon-button/icon-button";

const statusOptions = [
    {
        label: "Pending",
        value: 1,
    },
    {
        label: "Verified",
        value: 2,
    },
    {
        label: "Rejected",
        value: 3,
    },
];

const EditPaymentForm = (props) => {
    const { setIsOpen } = usePopperContext();
    const { datarow } = props;

    const { payments: paymentsData } = usePage().props;

    const columns = paymentsData?.columns || {};

    const isBankTransfer = datarow?.payment_method === "Банков Превод";

    const fields = useMemo(() => {
        const baseFields = Object.values(columns)
            .filter(
                (col) =>
                    col?.key && col.key !== "manage" && col.key !== "status",
            )
            .map((col) => ({
                key: col.key,
                label: col.label || col.key,
                selected: datarow?.[col.key] ?? "",
            }));

        return [
            ...baseFields,
            {
                key: "status",
                label: "Статус",
                isVisible: true,
                isEnabled: true,
                values: statusOptions,
                selected: statusOptions.find(
                    (option) => option.label === datarow?.status,
                ),
            },
        ];
    }, [columns, datarow, isBankTransfer]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            status: statusOptions.find(
                (option) => option.label === datarow?.status,
            ),
        },
    });

    const { mutate: editPayment } = useEditPaymentMutation(datarow?.id);

    const onSubmit = (data) => {
        editPayment(
            { payment_status_id: data.status.value },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    router.reload({ only: ["payments"] });
                },
            },
        );
    };

    return (
        <BlockStack>
            <Form>
                <BlockStack gap="400">
                    <BlockStack gap="300" className="bz-admin-payments-details">
                        <InlineStack
                            align="space-between"
                            className="bz-admin-payments-details-header"
                        >
                            <Text variant="heading-m" color="blue-200">
                                Детайли за плащането
                            </Text>
                            <IconButton
                                icon={IconX}
                                onClick={() => setIsOpen(false)}
                            />
                        </InlineStack>

                        <BlockStack gap="200">
                            {fields.map((field) => {
                                if (field.key === "status" && isBankTransfer) {
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

                    {isBankTransfer &&
                        RenderFormFieldsUtils.renderSelectField({
                            fieldName: "status",
                            fields,
                            control,
                            error: errors.status?.message,
                        })}

                    {isBankTransfer && (
                        <Button onClick={handleSubmit(onSubmit)}>Запази</Button>
                    )}
                </BlockStack>
            </Form>
        </BlockStack>
    );
};

export default EditPaymentForm;
