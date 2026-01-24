/**
 * External dependencies
 */
import classNames from "classnames";

/**
 * Internaldependencies
 */
import {
    MainNavListContext,
    useMainNavListContext,
} from "@/components/main-nav/main-nav-list-context";

const MainNavList = (props) => {
    const depth = useMainNavListContext();

    return (
        <MainNavListContext.Provider value={{ depth: depth + 1 }}>
            <ul
                className={classNames(
                    "bz-main-nav__list",
                    `bz-main-nav__list--depth-${depth}`,
                )}
                {...props}
            />
        </MainNavListContext.Provider>
    );
};

export default MainNavList;
