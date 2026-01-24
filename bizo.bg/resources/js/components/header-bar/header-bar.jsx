import { Link, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
/**
 * Internal dependencies
 */
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import IconLeftArrowPlain from "@/components/icons/left-arrow-plain";
import IconCalendarCheck from "@/components/icons/calendar-check";
import Icon from "@/components/icon/icon";
import { formatDate } from "@/utils/formatting";
import { getCurrentHash, withIndexHash } from "@/utils/hash-utils";
import { useNavigationContext } from "@/layouts/app-layout/contexts/navigation-context";

const currentDate = formatDate(new Date(), "dd MMMM, yyyy");

const HeaderBar = (props) => {
    const { activeItem } = props;
    const { headerBarTitle, setHeaderBarTitle } = useNavigationContext();
    const currentHash = getCurrentHash() || "";
    const isSubPage = currentHash !== "#index";

    useEffect(() => {
        if (activeItem?.title) {
            setHeaderBarTitle(activeItem.title);
        } else {
            return;
        }
    }, [activeItem, setHeaderBarTitle]);

    return (
        <InlineStack
            className="bz-header-bar"
            align="space-between"
            blockAlign="center"
        >
            <InlineStack gap="200">
                <Link
                    href={
                        isSubPage && activeItem?.href
                            ? withIndexHash(route(activeItem.href))
                            : undefined
                    }
                    style={{ cursor: isSubPage ? "pointer" : "default" }}
                >
                    <InlineStack className="bz-header-bar__left" gap="200">
                        {isSubPage && (
                            <Icon
                                icon={IconLeftArrowPlain}
                                size="300"
                                color="brand-500"
                            />
                        )}

                        <Text variant="heading-xl">{headerBarTitle}</Text>
                    </InlineStack>
                </Link>
            </InlineStack>
            <InlineStack gap="200">
                <Icon icon={IconCalendarCheck} />

                <Text variant="body-m" fontWeight="regular">
                    {currentDate}
                </Text>
            </InlineStack>
        </InlineStack>
    );
};

export default HeaderBar;
