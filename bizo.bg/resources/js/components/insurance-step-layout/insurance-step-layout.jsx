/**
 * External dependencies
 */
import { useScreenSize } from "./shared/use-screen-size";
import InsuranceStepLayoutDesktop from "./insurance-step-layout-desktop";
import InsuranceStepLayoutMobile from "./insurance-step-layout-mobile";

/**
 * Main wrapper component that renders desktop or mobile version
 * based on screen size
 */
const InsuranceStepLayout = (props) => {
    const isMobile = useScreenSize();

    if (isMobile) {
        return <InsuranceStepLayoutMobile {...props} />;
    }

    return <InsuranceStepLayoutDesktop {...props} />;
};

export default InsuranceStepLayout;
