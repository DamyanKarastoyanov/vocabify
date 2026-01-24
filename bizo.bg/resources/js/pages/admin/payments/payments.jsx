/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
import { useMemo, useEffect } from "react";
/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Surface from "@/components/surface/surface";
import DataTable from "@/components/data-table/data-table";
import ManageCellRenderer from "@/pages/admin/payments/components/manage-cell-renderer";
import createDateRenderer from "@/components/renderers/date-renderer";
import AdminLayout from "@/layouts/admin-layout/admin-layout";
import { ensureIndexHash } from "@/utils/hash-utils";

const Payments = () => {
    const { payments: paymentsData } = usePage().props;
    const { payments, columns, pagination } = paymentsData;

    const dateRenderer = useMemo(() => createDateRenderer(), []);

    useEffect(() => {
        ensureIndexHash();
    }, [payments, pagination, columns]);

    const cellRenderers = useMemo(
        () => ({
            manage: ManageCellRenderer,
            date_time: dateRenderer,
            verified_at: dateRenderer,
        }),
        [dateRenderer],
    );

    return (
        <>
            <Head title="Payments" />
            <Surface className="bz-admin-payments-wrapper">
                <BlockStack gap="600" padding="600">
                    <DataTable
                        columns={columns}
                        dataset={payments}
                        pagination={pagination}
                        routes={{
                            index: "payments.admin.index",
                            export: "payments.admin.export",
                            only: ["payments"],
                        }}
                        cellRenderers={cellRenderers}
                        showDateRangePicker={true}
                    />
                </BlockStack>
            </Surface>
        </>
    );
};

export default AdminLayout.wrap(Payments);
