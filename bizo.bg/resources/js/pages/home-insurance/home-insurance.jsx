/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
import { lazy, Suspense, useEffect, useCallback, useMemo } from "react";
/**
 * Internal dependencies
 */
import AppLayout from "@/layouts/app-layout/app-layout";
import Page from "@/components/page/page";
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import ProcessProgressBar from "@/components/process-progress-bar/process-progress-bar";
import InlineStack from "@/components/inline-stack/inline-stack";
import Spinner from "@/components/spinner/spinner";
import IconCheck from "@/components/icons/check";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconPropertyInsurance from "@/components/icons/property-insurance";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocalStorageReducer } from "@/hooks/use-local-storage-reducer";
import { useInsuranceDateFloor } from "@/hooks/use-insurance-date-floor";
import {
    insuranceDataReducer,
    initialInsuranceData,
} from "@/pages/home-insurance/reducers/insurance-data-reducer";
import {
    formDataReducer,
    initialFormData,
} from "@/pages/home-insurance/reducers/form-data-reducer";
import {
    validityReducer,
    initialValidity,
} from "@/pages/home-insurance/reducers/validity-reducer";
import { InsuranceDataContext } from "@/pages/home-insurance/contexts/insurance-data-context";
import { FormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { ValidityContext } from "@/pages/home-insurance/contexts/validity-context";

const CalculatePriceStep = lazy(
    () =>
        import("@/pages/home-insurance/components/calculate-price-step/calculate-price-step"),
);
const PropertyDetailsStep = lazy(
    () =>
        import("@/pages/home-insurance/components/property-details-step/property-details-step"),
);
const PolicyHolderStep = lazy(
    () =>
        import("@/pages/home-insurance/components/policy-holder-step/policy-holder-step"),
);
const BeneficiaryStep = lazy(
    () =>
        import("@/pages/home-insurance/components/beneficiary-step/beneficiary-step"),
);
const PaymentStepWrapper = lazy(
    () =>
        import("@/pages/home-insurance/components/payment-step/payment-step-wrapper"),
);
const SuccessStep = lazy(
    () => import("@/pages/home-insurance/components/success-step/success-step"),
);

const ProgresBarSteps = [
    {
        label: "Изчисли цена",
        key: 1,
        icon: null,
    },
    {
        label: "Информация за имота",
        key: 2,
        icon: null,
    },
    {
        label: "Данни на застрахован",
        key: 3,
        icon: null,
    },
    {
        label: "Данни на трето ползващо се лице",
        key: 3.5,
        icon: null,
        hidden: true,
    },
    {
        label: "Плащане",
        key: 4,
        icon: null,
    },
    {
        label: "Полица",
        key: 5,
        icon: IconCheck,
    },
];

const HomeInsurance = () => {
    const { home_insurance, seo } = usePage().props;
    const { step } = home_insurance || { step: 1 };

    const [insuranceDataState, insuranceDataDispatch] = useLocalStorageReducer(
        insuranceDataReducer,
        initialInsuranceData,
        "home_insurance_data",
    );
    const [formDataState, formDataDispatch] = useLocalStorageReducer(
        formDataReducer,
        initialFormData,
        "home_insurance_form_data",
    );
    const [validityState, validityDispatch] = useLocalStorageReducer(
        validityReducer,
        initialValidity,
        "home_insurance_validity",
    );
    const [payingInfo, setPayingInfo] = useLocalStorage(
        "home_insurance_paying_info",
        null,
    );
    const [lastVisitedStep, setLastVisitedStep] = useLocalStorage(
        "home_insurance_last_visited_step",
        1,
    );

    const resetFormData = useCallback(() => {
        insuranceDataDispatch({ type: "RESET_PRICE_AND_OFFER_DATA" });
        formDataDispatch({ type: "RESET_FORM_DATA" });
        validityDispatch({ type: "RESET_VALIDITY" });
        setPayingInfo(null);
        setLastVisitedStep(1);
    }, [
        insuranceDataDispatch,
        formDataDispatch,
        validityDispatch,
        setPayingInfo,
        setLastVisitedStep,
    ]);

    const progressBarSteps = useMemo(
        () =>
            ProgresBarSteps.map((step) => ({
                ...step,
                hidden:
                    step.key === 3.5
                        ? !formDataState.isThirdPartyBeneficiary
                        : step.hidden,
            })),
        [formDataState.isThirdPartyBeneficiary],
    );
    useEffect(() => {
        if (!formDataState.isThirdPartyBeneficiary && lastVisitedStep === 3.5) {
            setLastVisitedStep(3);
        }
    }, [formDataState.isThirdPartyBeneficiary]);

    const viewComponent = () => {
        const steps = {
            1: CalculatePriceStep,
            2: PropertyDetailsStep,
            3: PolicyHolderStep,
            3.5: BeneficiaryStep,
            4: PaymentStepWrapper,
            5: SuccessStep,
        };
        const StepComponent = steps[step];
        return StepComponent ? <StepComponent /> : null;
    };

    useInsuranceDateFloor(formDataState, formDataDispatch, "start_date", 1);

    return (
        <Page>
            <Head title={seo?.title} />
            <FormDataContext.Provider
                value={{
                    calculatePriceFormData: formDataState.calculatePrice,
                    setCalculatePriceFormData: (data) =>
                        formDataDispatch({
                            type: "SET_CALCULATE_PRICE_DATA",
                            payload: data,
                        }),
                    propertyDetailsFormData: formDataState.propertyDetails,
                    setPropertyDetailsFormData: (data) =>
                        formDataDispatch({
                            type: "SET_PROPERTY_DETAILS_DATA",
                            payload: data,
                        }),
                    policyHolderFormData: formDataState.policyHolder,
                    setPolicyHolderFormData: (data) =>
                        formDataDispatch({
                            type: "SET_POLICY_HOLDER_DATA",
                            payload: data,
                        }),
                    paymentFormData: formDataState.payment,
                    setPaymentFormData: (data) =>
                        formDataDispatch({
                            type: "SET_PAYMENT_DATA",
                            payload: data,
                        }),
                    isThirdPartyBeneficiary:
                        formDataState.isThirdPartyBeneficiary,
                    setIsThirdPartyBeneficiary: (valid) =>
                        formDataDispatch({
                            type: "SET_THIRD_PARTY_BENEFICIARY",
                            payload: valid,
                        }),
                    dropBeneficiaryData: () =>
                        formDataDispatch({
                            type: "DROP_BENEFICIARY_DATA",
                        }),
                    payingInfo,
                    setPayingInfo,
                    lastVisitedStep,
                    setLastVisitedStep,
                    resetFormData,
                }}
            >
                <InsuranceDataContext.Provider
                    value={{
                        step,
                        priceData: insuranceDataState.priceData,
                        setPriceData: (data) =>
                            insuranceDataDispatch({
                                type: "SET_PRICE_DATA",
                                payload: data,
                            }),
                        offerData: insuranceDataState.offerData,
                        setOfferData: (data) =>
                            insuranceDataDispatch({
                                type: "SET_OFFER_DATA",
                                payload: data,
                            }),
                        policyData: insuranceDataState.policyData,
                        setPolicyData: (data) =>
                            insuranceDataDispatch({
                                type: "SET_POLICY_DATA",
                                payload: data,
                            }),
                    }}
                >
                    <ValidityContext.Provider
                        value={{
                            isCalculatePriceValid: validityState.calculatePrice,
                            setIsCalculatePriceValid: (valid) =>
                                validityDispatch({
                                    type: "SET_CALCULATE_PRICE_VALID",
                                    payload: valid,
                                }),
                            isPropertyDetailsValid:
                                validityState.propertyDetails,
                            setIsPropertyDetailsValid: (valid) =>
                                validityDispatch({
                                    type: "SET_PROPERTY_DETAILS_VALID",
                                    payload: valid,
                                }),
                            isPolicyHolderValid: validityState.policyHolder,
                            setIsPolicyHolderValid: (valid) =>
                                validityDispatch({
                                    type: "SET_POLICY_HOLDER_VALID",
                                    payload: valid,
                                }),
                            isBeneficiaryValid: validityState.beneficiary,
                            setIsBeneficiaryValid: (valid) =>
                                validityDispatch({
                                    type: "SET_BENEFICIARY_VALID",
                                    payload: valid,
                                }),
                            isPaymentValid: validityState.payment,
                            setIsPaymentValid: (valid) =>
                                validityDispatch({
                                    type: "SET_PAYMENT_VALID",
                                    payload: valid,
                                }),
                        }}
                    >
                        <BlockStack gap="1200">
                            <InlineStack
                                gap="800"
                                blockAlign="center"
                                className="bz-insurance-title-stack"
                            >
                                <Icon
                                    icon={IconPropertyInsurance}
                                    size="2000"
                                />
                                <Text variant="heading-xl">
                                    Застраховка имущество
                                </Text>
                            </InlineStack>

                            <ProcessProgressBar
                                steps={progressBarSteps}
                                currentStep={parseFloat(step)}
                                lastVisitedStep={lastVisitedStep}
                            />

                            <Suspense
                                fallback={
                                    <InlineStack
                                        align="center"
                                        blockAlign="center"
                                    >
                                        <Spinner />
                                    </InlineStack>
                                }
                            >
                                {viewComponent()}
                            </Suspense>
                        </BlockStack>
                    </ValidityContext.Provider>
                </InsuranceDataContext.Provider>
            </FormDataContext.Provider>
        </Page>
    );
};

export default AppLayout.wrap(HomeInsurance);
