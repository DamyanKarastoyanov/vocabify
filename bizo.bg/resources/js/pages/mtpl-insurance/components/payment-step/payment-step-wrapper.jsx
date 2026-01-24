/**
 * MTPL Insurance Payment Step Wrapper
 */
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import useCreatePolicyMutation from "@/pages/mtpl-insurance/data/use-create-policy-mutation";
import useProcessPaymentMutation from "@/pages/mtpl-insurance/data/use-process-payment-mutation";
import PaymentStep from "@/components/payment-step/payment-step";

const PaymentStepWrapper = (props) => {
    return (
        <PaymentStep
            insuranceType="mtpl_insurance"
            useInsuranceDataContext={useInsuranceDataContext}
            useFormDataContext={useFormDataContext}
            useValidityContext={useValidityContext}
            useCreatePolicyMutation={useCreatePolicyMutation}
            useProcessPaymentMutation={useProcessPaymentMutation}
            nextStepNumber={6}
            bubbleText="Ооо, почти финиширахме! Избери как да платиш и аз ще изстрелям полицата ти към моментално издаване."
            {...props}
        />
    );
};

export default PaymentStepWrapper;
