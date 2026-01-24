/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Hero from "@/pages/welcome/components/hero/hero";
import InsuranceCards from "@/pages/welcome/components/insurance-cards/insurance-cards";
import Partners from "@/pages/welcome/components/partners/partners";
import PolicyCta from "@/pages/welcome/components/policy-cta/policy-cta";
import FeaturesDiagram from "@/pages/welcome/components/features-diagram/features-diagram";
import ThreeSteps from "@/pages/welcome/components/three-steps/three-steps";
import CarInsurance from "@/pages/welcome/components/car-insurance/car-insurance";
import TravelInsurance from "@/pages/welcome/components/travel-insurance/travel-insurance";
import CreateProfile from "@/pages/welcome/components/create-profile/create-profile";
import AppLayout from "@/layouts/app-layout/app-layout";

const Welcome = () => {
    const { seo } = usePage().props;

    return (
        <div className="bz-welcome">
            <Head title={seo?.title} />
            <Hero />

            <InsuranceCards />

            <ThreeSteps />

            <Partners />

            <PolicyCta />

            <FeaturesDiagram />

            <CarInsurance />

            <TravelInsurance />

            <CreateProfile />
        </div>
    );
};

export default AppLayout.wrap(Welcome);
