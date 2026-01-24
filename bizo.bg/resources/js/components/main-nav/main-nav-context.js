/**
 * External dependencies
 */
import { createContext, useContext } from 'react';

const MainNavContext = createContext();

const useMainNavContext = () => useContext(MainNavContext);

export { MainNavContext, useMainNavContext };
