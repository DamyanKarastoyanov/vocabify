/**
 * Home Insurance Payment Step Wrapper
 */
import { useInsuranceDataContext } from "@/pages/home-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import useCreatePolicyMutation from "@/pages/home-insurance/data/use-create-policy-mutation";
import useProcessPaymentMutation from "@/pages/home-insurance/data/use-process-payment-mutation";
import PaymentStep from "@/components/payment-step/payment-step";

const PaymentStepWrapper = (props) => {
    return (
        <PaymentStep
            insuranceType="home_insurance"
            useInsuranceDataContext={useInsuranceDataContext}
            useFormDataContext={useFormDataContext}
            useValidityContext={useValidityContext}
            useCreatePolicyMutation={useCreatePolicyMutation}
            useProcessPaymentMutation={useProcessPaymentMutation}
            nextStepNumber={5}
            bubbleText="Финален етап! Плати по най-удобния за теб начин, а аз ще активирам защитата на дома ти."
            {...props}
        />
    );
};

export default PaymentStepWrapper;
