/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
/**
 * Internal dependencies
 */
import AppLayout from "@/layouts/app-layout/app-layout";
import Page from "@/components/page/page";
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import Divider from "@/components/divider/divider";
import Box from "@/components/box/box";
import AuthenticatedLayout from "@/layouts/authenticated-layout/authenticated-layout";

const Addresses = () => {
    const { addresses } = usePage().props;

    return (
        <Page>
            <Head title="Addresses" />

            <BlockStack gap="600">{JSON.stringify(addresses)}</BlockStack>
        </Page>
    );
};

export default AuthenticatedLayout.wrap(Addresses);
