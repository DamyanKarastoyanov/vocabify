/**
 * External dependencies
 */
import { createContext, useContext } from 'react';

const MainNavListContext = createContext(1);

const useMainNavListContext = () => useContext(MainNavListContext);

export { MainNavListContext, useMainNavListContext };
