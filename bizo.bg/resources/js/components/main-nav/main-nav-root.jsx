/**
 * Internal dependencies
 */
import { MainNavContext } from '@/components/main-nav/main-nav-context';

const MainNavRoot = (props) => {
    const { variant, children } = props;

    return <MainNavContext.Provider value={variant}>{children}</MainNavContext.Provider>;
};

export default MainNavRoot;
