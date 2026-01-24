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
import createDateRenderer from "@/components/renderers/date-renderer";
import AdminLayout from "@/layouts/admin-layout/admin-layout";
import { ensureIndexHash } from "@/utils/hash-utils";
import ManageCellRenderer from "@/pages/admin/policies/components/manage-cell-renderer";

const Policies = () => {
    const { policies: policiesData } = usePage().props;
    const { policies, columns, pagination } = policiesData;

    const dateRenderer = useMemo(() => createDateRenderer(), []);

    useEffect(() => {
        ensureIndexHash();
    }, [policies, pagination, columns]);

    const cellRenderers = useMemo(
        () => ({
            start_date: dateRenderer,
            end_date: dateRenderer,
            manage: ManageCellRenderer,
        }),
        [dateRenderer],
    );

    return (
        <>
            <Head title="Policies" />
            <Surface className="bz-admin-policies-wrapper">
                <BlockStack gap="600" padding="600">
                    <DataTable
                        columns={columns}
                        dataset={policies}
                        pagination={pagination}
                        routes={{
                            index: "policies.admin.index",
                            export: "policies.admin.export",
                            only: ["policies"],
                        }}
                        cellRenderers={cellRenderers}
                        showDateRangePicker={true}
                    />
                </BlockStack>
            </Surface>
        </>
    );
};

export default AdminLayout.wrap(Policies);
