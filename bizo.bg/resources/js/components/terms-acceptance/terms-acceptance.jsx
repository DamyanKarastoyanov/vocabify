/**
 * External dependencies
 */
import { Link } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Checkbox from "@/components/checkbox/checkbox";
import Text from "@/components/text/text";
import Box from "@/components/box/box";
import InlineError from "@/components/inline-error/inline-error";
import InlineStack from "@/components/inline-stack/inline-stack";

const TermsAcceptance = (props) => {
    const { checked, onChange, error } = props;
    const handleLinkClick = (event, routeName) => {
        event.stopPropagation();
        event.preventDefault();
        const url = route(routeName);
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const errorMessage = error
        ? "За да продължите е необходимо да се запознаете и приемете условията за ползване на сайта."
        : "";

    return (
        <BlockStack gap="200" className="bz-terms-acceptance">
            <Checkbox
                id="termsAccepted"
                checked={checked}
                onChange={onChange}
                invalid={!!error}
                label={
                    <>
                        Съгласен съм личните ми данни да бъдат обработвани в
                        съответствие с{" "}
                        <Link
                            href={route("privacy-policy")}
                            onClick={(event) =>
                                handleLinkClick(event, "privacy-policy")
                            }
                        >
                            <Text color="brand-500" as="span">
                                Политика за защита на личните данни
                            </Text>
                        </Link>{" "}
                        и приемам{" "}
                        <Link
                            href={route("terms-and-conditions")}
                            onClick={(event) =>
                                handleLinkClick(event, "terms-and-conditions")
                            }
                        >
                            <Text color="brand-500" as="span">
                                Общи условия
                            </Text>
                        </Link>{" "}
                        за ползване на уебсайта и онлайн платформата на Bizo
                        ООД.
                    </>
                }
            />
            <InlineStack gap="300" wrap={false}>
                <Box className="bz-terms-acceptance-error-icon"></Box>
                {error && (
                    <InlineError align="left">{errorMessage}</InlineError>
                )}
            </InlineStack>
        </BlockStack>
    );
};

export default TermsAcceptance;
