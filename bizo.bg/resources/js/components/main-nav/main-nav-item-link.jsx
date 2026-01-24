/**
 * Internal dependencies
 */
import Icon from "@/components/icon/icon";
import InlineStack from "@/components/inline-stack/inline-stack";
import { useMainNavContext } from "@/components/main-nav/main-nav-context";
import { useMainNavListContext } from "@/components/main-nav/main-nav-list-context";

const MainNavItemLink = (props) => {
    const { icon, children, ...restProps } = props;

    return (
        <a className="bz-main-nav__item-link" {...restProps}>
            {icon && <Icon icon={icon} size="600" />}

            <InlineStack gap="200">{children}</InlineStack>
        </a>
    );
};

export default MainNavItemLink;
