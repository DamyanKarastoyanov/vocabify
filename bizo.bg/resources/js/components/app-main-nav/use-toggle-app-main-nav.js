/**
 * Internal dependencies
 */
import { useLocalStorage } from '@/hooks/use-local-storage';
import MainNavVariantEnum from '@/global/main-nav/main-nav-variant-enum';

const useToggleAppMainNav = () => {
    const [variant, setVariant] = useLocalStorage('userMainNavVariant', MainNavVariantEnum.FULL);

    const toggle = () => {
        setVariant((variant) => {
            return variant === MainNavVariantEnum.COMPACT ? MainNavVariantEnum.FULL : MainNavVariantEnum.COMPACT;
        });
    };

    return [variant, toggle];
};

export default useToggleAppMainNav;
