/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import MainNavRoot from '@/components/main-nav/main-nav-root';
import MainNavList from '@/components/main-nav/main-nav-list';
import MainNavItem from '@/components/main-nav/main-nav-item';
import MainNavItemLink from '@/components/main-nav/main-nav-item-link';
import MainNavPopper from '@/components/main-nav/main-nav-popper';
import MainNavVariantEnum from '@/components/main-nav/main-nav-variant-enum';
import { MainNavListContext } from '@/components/main-nav/main-nav-list-context';

const MainNav = (props) => {
    const { variant = MainNavVariantEnum.FULL, children, ...restProps } = props;

    return (
        <MainNav.Root variant={variant}>
            <div className={classNames('bz-main-nav', `bz-main-nav--variant-${variant}`)} {...restProps}>
                <MainNavListContext.Provider value={0}>
                    {children}
                </MainNavListContext.Provider>
            </div>
        </MainNav.Root>
    );
};

MainNav.Root = MainNavRoot;
MainNav.List = MainNavList;
MainNav.Item = MainNavItem;
MainNav.ItemLink = MainNavItemLink;
MainNav.Popper = MainNavPopper;

export default MainNav;
