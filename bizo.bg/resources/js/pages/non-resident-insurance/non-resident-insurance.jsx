/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
import { lazy, Suspense, useCallback, useMemo, useEffect } from "react";
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
import IconNonResidentInsurance from "@/components/icons/non-resident-insurance";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocalStorageReducer } from "@/hooks/use-local-storage-reducer";
import { useInsuranceDateFloor } from "@/hooks/use-insurance-date-floor";
import {
    insuranceDataReducer,
    initialInsuranceData,
} from "@/pages/non-resident-insurance/reducers/insurance-data-reducer";
import {
    formDataReducer,
    initialFormData,
} from "@/pages/non-resident-insurance/reducers/form-data-reducer";
import {
    validityReducer,
    initialValidity,
} from "@/pages/non-resident-insurance/reducers/validity-reducer";
import { InsuranceDataContext } from "@/pages/non-resident-insurance/contexts/insurance-data-context";
import { FormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { ValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import "@/pages/non-resident-insurance/non-resident-insurance.scss";

const CalculatePriceStep = lazy(
    () =>
        import("@/pages/non-resident-insurance/components/calculate-price-step/calculate-price-step"),
);

const InsuredPersonsStep = lazy(
    () =>
        import("@/pages/non-resident-insurance/components/insured-persons-step/insured-persons-step"),
);

const CustomerStep = lazy(
    () =>
        import("@/pages/non-resident-insurance/components/customer-step/customer-step"),
);

const PaymentStepWrapper = lazy(
    () =>
        import("@/pages/non-resident-insurance/components/payment-step/payment-step-wrapper"),
);

const SuccessStep = lazy(
    () =>
        import("@/pages/non-resident-insurance/components/success-step/success-step"),
);

const ProgresBarSteps = [
    {
        label: "Изчисли цена",
        key: 1,
        hidden: false,
    },
    {
        label: "Данни на застраховани лица",
        key: 2,
        hidden: false,
    },
    {
        label: "Данни на застраховащото лице",
        key: 2.5,
        hidden: true,
    },
    {
        label: "Плащане",
        key: 3,
        hidden: false,
    },
    {
        label: "Полица",
        key: 4,
        hidden: false,
    },
];

const NonResidentInsurance = () => {
    const { non_resident_insurance, seo } = usePage().props;
    const { step } = non_resident_insurance || { step: 1 };

    const [insuranceDataState, insuranceDataDispatch] = useLocalStorageReducer(
        insuranceDataReducer,
        initialInsuranceData,
        "non_resident_insurance_data",
    );
    const [formDataState, formDataDispatch] = useLocalStorageReducer(
        formDataReducer,
        initialFormData,
        "non_resident_insurance_form_data",
    );
    const [validityState, validityDispatch] = useLocalStorageReducer(
        validityReducer,
        initialValidity,
        "non_resident_insurance_validity",
    );
    const [payingInfo, setPayingInfo] = useLocalStorage(
        "non_resident_insurance_paying_info",
        null,
    );
    const [lastVisitedStep, setLastVisitedStep] = useLocalStorage(
        "non_resident_insurance_last_visited_step",
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
                    step.key === 2.5 &&
                    formDataState?.insuredPersonsFormData
                        ?.isInsurerAlsoACustomer === false
                        ? formDataState?.insuredPersonsFormData
                              ?.isInsurerAlsoACustomer
                        : step.hidden,
            })),
        [formDataState?.insuredPersonsFormData?.isInsurerAlsoACustomer],
    );

    useEffect(() => {
        if (
            !formDataState?.insuredPersonsFormData?.isInsurerAlsoACustomer &&
            lastVisitedStep === 2.5
        ) {
            setLastVisitedStep(2);
        }
    }, [
        formDataState?.insuredPersonsFormData?.isInsurerAlsoACustomer,
        lastVisitedStep,
        setLastVisitedStep,
    ]);

    useInsuranceDateFloor(formDataState, formDataDispatch, "start_date", 0);

    const viewComponent = () => {
        const steps = {
            1: CalculatePriceStep,
            2: InsuredPersonsStep,
            2.5: CustomerStep,
            3: PaymentStepWrapper,
            4: SuccessStep,
        };
        const StepComponent = steps[step];
        return StepComponent ? <StepComponent /> : null;
    };

    return (
        <Page>
            <Head title={seo?.title} />

            <FormDataContext.Provider
                value={{
                    calculatePriceFormData:
                        formDataState.calculatePriceFormData,
                    setCalculatePriceFormData: (data) =>
                        formDataDispatch({
                            type: "SET_CALCULATE_PRICE_DATA",
                            payload: data,
                        }),
                    insuredPersonsFormData:
                        formDataState.insuredPersonsFormData,
                    setInsuredPersonsFormData: (data) =>
                        formDataDispatch({
                            type: "SET_INSURED_PERSONS_DATA",
                            payload: data,
                        }),
                    paymentFormData: formDataState.payment,
                    setPaymentFormData: (data) =>
                        formDataDispatch({
                            type: "SET_PAYMENT_DATA",
                            payload: data,
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
                            isCalculatePriceValid:
                                validityState.isCalculatePriceValid,
                            setIsCalculatePriceValid: (valid) =>
                                validityDispatch({
                                    type: "SET_CALCULATE_PRICE_VALID",
                                    payload: valid,
                                }),
                            isInsuredPersonsValid:
                                validityState.isInsuredPersonsValid,
                            setIsInsuredPersonsValid: (valid) =>
                                validityDispatch({
                                    type: "SET_INSURED_PERSONS_VALID",
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
                        <BlockStack gap="800">
                            <InlineStack
                                gap="800"
                                blockAlign="center"
                                className="bz-insurance-title-stack"
                            >
                                <Icon
                                    icon={IconNonResidentInsurance}
                                    size="2000"
                                />
                                <Text variant="heading-xl">
                                    Медицинска застраховка за чужденци
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

export default AppLayout.wrap(NonResidentInsurance);
