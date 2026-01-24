/**
 * Travel Insurance Payment Step Wrapper
 */
import { useInsuranceDataContext } from "@/pages/travel-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/travel-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/travel-insurance/contexts/validity-context";
import useCreatePolicyMutation from "@/pages/travel-insurance/data/use-create-policy-mutation";
import useProcessPaymentMutation from "@/pages/travel-insurance/data/use-process-payment-mutation";
import PaymentStep from "@/components/payment-step/payment-step";

const PaymentStepWrapper = () => {
    return (
        <PaymentStep
            insuranceType="travel_insurance"
            useInsuranceDataContext={useInsuranceDataContext}
            useFormDataContext={useFormDataContext}
            useValidityContext={useValidityContext}
            useCreatePolicyMutation={useCreatePolicyMutation}
            useProcessPaymentMutation={useProcessPaymentMutation}
            bubbleText="Избери как ще платиш и след като получа плащането, ще се погрижа полицата ти да е готова за път."
            nextStepNumber={4}
        />
    );
};

export default PaymentStepWrapper;
