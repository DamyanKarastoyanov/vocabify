/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRef } from "react";

/**
 * Internal dependencies
 */
import VehicleDataForm from "@/pages/mtpl-insurance/components/vehicle-data-step/vehicle-data-form";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import IconCheck from "@/components/icons/check";
import useGetVehicleDataMutation from "@/pages/mtpl-insurance/data/use-get-vehicle-data-mutation";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Text from "@/components/text/text";

const VehicleDataStep = () => {
    const { isVehicleDataValid } = useValidityContext();
    const formRef = useRef(null);
    const { vehicleDataFormData, setLastVisitedStep, resetFormData } =
        useFormDataContext();
    const { setVehicleData, setCalculatePriceAdditionalFields } =
        useInsuranceDataContext();

    const { showAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const { mutate, isPending } = useGetVehicleDataMutation();

    const handleContinue = () => {
        if (!isVehicleDataValid) {
            if (formRef.current?.triggerErrors) {
                formRef.current.triggerErrors();
            }
            return;
        }

        mutate(
            {
                number: vehicleDataFormData.number,
                talon: vehicleDataFormData.talon,
            },
            {
                onSuccess: (response) => {
                    resetFormData();
                    const { vehicle, required_fields, person } = response.data;
                    setVehicleData({
                        ...vehicle,
                        ...person,
                    });
                    setCalculatePriceAdditionalFields({ ...required_fields });
                    setLastVisitedStep(2);
                    router.reload({
                        data: {
                            step: 2,
                        },
                        preserveScroll: false,
                        onFinish: () => window.scrollTo(0, 0),
                    });
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="red-500">Възникна грешка</Text>,
                        message:
                            error.response?.data?.message ||
                            "Възникна грешка при получаване на данните за автомобила.",
                        closable: true,
                        hideable: true,
                    });
                },
            },
        );
    };

    return (
        <InsuranceStepLayout
            form={<VehicleDataForm ref={formRef} />}
            offerDetails={[{ items: [] }]}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                loading: isPending,
                icon: IconCheck,
            }}
            bubbleText="Покажи ми кой е твоят звяр на пътя. Въведи данните на автомобила си и аз – Bizo – ще ти намеря най-добрите оферти за ГО – бързо, лесно и онлайн."
        />
    );
};

export default VehicleDataStep;
