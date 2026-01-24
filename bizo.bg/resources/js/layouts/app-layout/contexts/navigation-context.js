/**
 * External dependencies
 */
import { createContext, useContext } from "react";

/**
 * Internal dependencies
 */

const NavigationContext = createContext({
    sideNavigationItems: [],
    mainNavItems: [],
    mobileNavigationItems: [],
    profileMenuItems: [],
    headerBarTitle: null,
    setHeaderBarTitle: () => {},
});

const useNavigationContext = () => useContext(NavigationContext);

export { NavigationContext, useNavigationContext };
