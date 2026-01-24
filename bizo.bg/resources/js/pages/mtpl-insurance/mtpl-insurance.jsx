/**
 * External dependencies
 */
import { Head, usePage } from "@inertiajs/react";
import { lazy, Suspense, useCallback, useEffect } from "react";

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
import IconMTPLInsurance from "@/components/icons/mtpl-insurance.jsx";
import Icon from "@/components/icon/icon";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocalStorageReducer } from "@/hooks/use-local-storage-reducer";
import { useInsuranceDateFloor } from "@/hooks/use-insurance-date-floor";
import {
    insuranceDataReducer,
    initialInsuranceData,
} from "@/pages/mtpl-insurance/reducers/insurance-data-reducer";
import {
    formDataReducer,
    initialFormData,
} from "@/pages/mtpl-insurance/reducers/form-data-reducer";
import {
    validityReducer,
    initialValidity,
} from "@/pages/mtpl-insurance/reducers/validity-reducer";
import { InsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { FormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { ValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import "@/pages/mtpl-insurance/mtpl-insurance.scss";

const VehicleDataStep = lazy(
    () =>
        import("@/pages/mtpl-insurance/components/vehicle-data-step/vehicle-data-step"),
);

const CalculatePriceStep = lazy(
    () =>
        import("@/pages/mtpl-insurance/components/calculate-price-step/calculate-price-step"),
);

const ChooseInsurerStep = lazy(
    () =>
        import("@/pages/mtpl-insurance/components/choose-insurer-step/choose-insurer-step"),
);

const InsuredPersonStep = lazy(
    () =>
        import("@/pages/mtpl-insurance/components/insured-person-step/insured-person-step"),
);

const PaymentStepWrapper = lazy(
    () =>
        import("@/pages/mtpl-insurance/components/payment-step/payment-step-wrapper"),
);

const SuccessStep = lazy(
    () => import("@/pages/mtpl-insurance/components/success-step/success-step"),
);

const ProgressBarSteps = [
    {
        label: "Данни на автомобила",
        key: 1,
        hidden: false,
    },
    {
        label: "Изчисли цена",
        key: 2,
        hidden: false,
    },
    {
        label: "Избери застраховател",
        key: 3,
        hidden: false,
    },
    {
        label: "Данни на застрахованото лице",
        key: 4,
        hidden: false,
    },
    {
        label: "Плащане",
        key: 5,
        hidden: false,
    },
    {
        label: "Полица",
        key: 6,
        hidden: false,
    },
];

const MTPLInsurance = () => {
    const { mtpl_insurance, seo } = usePage().props;
    const { step } = mtpl_insurance || { step: 1 };

    const [insuranceDataState, insuranceDataDispatch] = useLocalStorageReducer(
        insuranceDataReducer,
        initialInsuranceData,
        "mtpl_insurance_data",
    );

    const [formDataState, formDataDispatch] = useLocalStorageReducer(
        formDataReducer,
        initialFormData,
        "mtpl_insurance_form_data",
    );

    const [validityState, validityDispatch] = useLocalStorageReducer(
        validityReducer,
        initialValidity,
        "mtpl_insurance_validity",
    );

    const [lastVisitedStep, setLastVisitedStep] = useLocalStorage(
        "mtpl_insurance_last_visited_step",
        1,
    );

    const resetFormData = useCallback(() => {
        insuranceDataDispatch({ type: "RESET_INSURANCE_DATA" });
        formDataDispatch({ type: "RESET_FORM_DATA" });
        validityDispatch({ type: "RESET_VALIDITY" });
        setLastVisitedStep(1);
    }, [
        insuranceDataDispatch,
        formDataDispatch,
        validityDispatch,
        setLastVisitedStep,
    ]);

    useInsuranceDateFloor(
        formDataState,
        formDataDispatch,
        "policy_start_date",
        0,
    );

    const viewComponent = () => {
        const steps = {
            1: VehicleDataStep,
            2: CalculatePriceStep,
            3: ChooseInsurerStep,
            4: InsuredPersonStep,
            5: PaymentStepWrapper,
            6: SuccessStep,
        };
        const StepComponent = steps[step];
        return StepComponent ? <StepComponent /> : null;
    };

    return (
        <Page>
            <Head title={seo?.title} />

            <FormDataContext.Provider
                value={{
                    vehicleDataFormData: formDataState.vehicleDataFormData,
                    setVehicleDataFormData: (data) =>
                        formDataDispatch({
                            type: "SET_VEHICLE_DATA",
                            payload: data,
                        }),
                    calculatePriceFormData:
                        formDataState.calculatePriceFormData,
                    setCalculatePriceFormData: (data) =>
                        formDataDispatch({
                            type: "SET_CALCULATE_PRICE_DATA",
                            payload: data,
                        }),
                    selectedOffer: formDataState.selectedOffer,
                    setSelectedOffer: (data) =>
                        formDataDispatch({
                            type: "SET_SELECTED_OFFER",
                            payload: data,
                        }),
                    insuredPersonFormData: formDataState.insuredPersonFormData,
                    setInsuredPersonFormData: (data) =>
                        formDataDispatch({
                            type: "SET_INSURED_PERSON_DATA",
                            payload: data,
                        }),
                    paymentFormData: formDataState.paymentFormData,
                    setPaymentFormData: (data) =>
                        formDataDispatch({
                            type: "SET_PAYMENT_DATA",
                            payload: data,
                        }),
                    lastVisitedStep,
                    setLastVisitedStep,
                    resetFormData,
                }}
            >
                <InsuranceDataContext.Provider
                    value={{
                        step,
                        vehicleData: insuranceDataState.vehicleData,
                        setVehicleData: (data) =>
                            insuranceDataDispatch({
                                type: "SET_VEHICLE_DATA",
                                payload: data,
                            }),

                        offerData: insuranceDataState.offerData,
                        setOfferData: (data) =>
                            insuranceDataDispatch({
                                type: "SET_OFFER_DATA",
                                payload: data,
                            }),
                        payloadOffer: insuranceDataState.payloadOffer,
                        setPayloadOffer: (data) =>
                            insuranceDataDispatch({
                                type: "SET_PAYLOAD_OFFER",
                                payload: data,
                            }),
                        additionalFields: insuranceDataState.additionalFields,
                        setAdditionalFields: (data) =>
                            insuranceDataDispatch({
                                type: "SET_ADDITIONAL_FIELDS",
                                payload: data,
                            }),
                        setCalculatePriceAdditionalFields: (data) =>
                            insuranceDataDispatch({
                                type: "SET_CALCULATE_PRICE_ADDITIONAL_FIELDS",
                                payload: data,
                            }),
                        setInsuredAdditionalFields: (data) =>
                            insuranceDataDispatch({
                                type: "SET_INSURED_ADDITIONAL_FIELDS",
                                payload: data,
                            }),
                        policyData: insuranceDataState.policyData,
                        setPolicyData: (data) =>
                            insuranceDataDispatch({
                                type: "SET_POLICY_DATA",
                                payload: data,
                            }),
                        calculationId: insuranceDataState.calculationId,
                        setCalculationId: (data) =>
                            insuranceDataDispatch({
                                type: "SET_CALCULATION_ID",
                                payload: data,
                            }),
                    }}
                >
                    <ValidityContext.Provider
                        value={{
                            isVehicleDataValid:
                                validityState.isVehicleDataValid,
                            setIsVehicleDataValid: (valid) =>
                                validityDispatch({
                                    type: "SET_VEHICLE_DATA_VALID",
                                    payload: valid,
                                }),
                            isCalculatePriceValid:
                                validityState.isCalculatePriceValid,
                            setIsCalculatePriceValid: (valid) =>
                                validityDispatch({
                                    type: "SET_CALCULATE_PRICE_VALID",
                                    payload: valid,
                                }),
                            isOfferSelected: validityState.isOfferSelected,
                            setIsOfferSelected: (valid) =>
                                validityDispatch({
                                    type: "SET_OFFER_SELECTED",
                                    payload: valid,
                                }),
                            isInsuredPersonValid:
                                validityState.isInsuredPersonValid,
                            setIsInsuredPersonValid: (valid) =>
                                validityDispatch({
                                    type: "SET_INSURED_PERSON_VALID",
                                    payload: valid,
                                }),
                            isPaymentValid: validityState.isPaymentValid,
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
                                <Icon icon={IconMTPLInsurance} size="2000" />

                                <Text variant="heading-xl">
                                    Гражданска отговорност
                                </Text>
                            </InlineStack>

                            <ProcessProgressBar
                                steps={ProgressBarSteps}
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

export default AppLayout.wrap(MTPLInsurance);
