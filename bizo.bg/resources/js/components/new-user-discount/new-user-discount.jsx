/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";
import ContentCard from "@/components/content-card/content-card";
import CornerBizoImage from "@/components/new-user-discount/corner-bizo-image";

const NewUserDiscount = () => {
    return (
        <ContentCard>
            <BlockStack gap="200" inlineAlign="center">
                <Text variant="heading-m">Нов ли си тук?</Text>

                <Text variant="body-m">Приятно ни е да се запознаем.</Text>

                <Link href={route("register")}>
                    <Text variant="body-l" color="white">
                        Направи си профил
                    </Text>
                </Link>

                <Text variant="body-s">Terms and conditions apply</Text>

                <CornerBizoImage />
            </BlockStack>
        </ContentCard>
    );
};

export default NewUserDiscount;
