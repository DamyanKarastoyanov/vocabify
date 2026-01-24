/**
 * Non-Resident Insurance Payment Step Wrapper
 */
import { useInsuranceDataContext } from "@/pages/non-resident-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import useCreatePolicyMutation from "@/pages/non-resident-insurance/data/use-create-policy-mutation";
import useProcessPaymentMutation from "@/pages/non-resident-insurance/data/use-process-payment-mutation";
import PaymentStep from "@/components/payment-step/payment-step";

const PaymentStepWrapper = () => {
    return (
        <PaymentStep
            insuranceType="non_resident_insurance"
            useInsuranceDataContext={useInsuranceDataContext}
            useFormDataContext={useFormDataContext}
            useValidityContext={useValidityContext}
            useCreatePolicyMutation={useCreatePolicyMutation}
            useProcessPaymentMutation={useProcessPaymentMutation}
            bubbleText="Избери своя метод на плащане, плати застраховката си, а аз ще издам твоята полица."
            nextStepNumber={4}
        />
    );
};

export default PaymentStepWrapper;
