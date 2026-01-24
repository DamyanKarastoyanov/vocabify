/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import Button from "@/components/button/button";
import Text from "@/components/text/text";
import Icon from "@/components/icon/icon";
import IconLogoLight from "@/components/icons/logo-light";

// Import styles
import "./errors.scss";

export default function Errors({ status }) {
    const title = {
        503: "Услугата е недостъпна",
        500: "Грешка на сървъра",
        404: "Страницата не е намерена",
        403: "Достъпът е забранен",
        429: "Твърде много заявки",
    }[status];

    const description = {
        503: "Съжаляваме, извършваме поддръжка. Моля, проверете отново скоро.",
        500: "Нещо се обърка на нашите сървъри.",
        404: "Съжаляваме, търсената страница не е намерена.",
        403: "Съжаляваме, достъпът ви до тази страница е забранен.",
        429: "Дай ни малко време - Bizo се връща в играта след секунди",
    }[status];

    return (
        <Box className="bz-errors-page__container">
            {/* Dark overlay for text readability */}
            <Box className="bz-errors-page__overlay" />

            {/* Bizo Logo in upper left corner */}
            <Link href="/" className="bz-errors-page__logo">
                <Icon icon={IconLogoLight} size="1200" />
            </Link>

            {/* Main content */}
            <Box className="bz-errors-page__content">
                <BlockStack gap="800" align="center" inlineAlign="start">
                    {/* Error Title */}
                    <Text variant="heading-2xl" color="white">
                        {title}
                    </Text>

                    {/* Error Description */}
                    <Text variant="body-l" color="white">
                        {description}
                    </Text>

                    {/* Back to Homepage Button */}
                    <Box>
                        <Link href="/">
                            <Button
                                variant="primary"
                                className="bz-errors-page__button"
                            >
                                ← Към начало
                            </Button>
                        </Link>
                    </Box>
                </BlockStack>
            </Box>
        </Box>
    );
}
