/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import { useRef, useState } from "react";

/**
 * Internal dependencies
 */
import CalculatePriceForm from "@/pages/mtpl-insurance/components/calculate-price-step/calculate-price-form";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import IconCheck from "@/components/icons/check";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import { formatDate } from "@/utils/formatting";
import useCalculateMutation from "@/pages/mtpl-insurance/data/use-calculate-mutation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";

const CalculatePriceStep = () => {
    const {
        setLastVisitedStep,
        vehicleDataFormData,
        calculatePriceFormData,
        setInsuredPersonFormData,
    } = useFormDataContext();
    const {
        vehicleData,
        setPayloadOffer,
        additionalFields,
        setCalculationId,
        setOfferData,
    } = useInsuranceDataContext();
    const calculatePriceAdditionalFields =
        additionalFields?.calculatePriceAdditionalFields;
    const { isCalculatePriceValid } = useValidityContext();
    const formRef = useRef(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const { mutateAsync: calculateMutation } = useCalculateMutation();

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const handleContinue = async () => {
        // Check validity before fetching offers
        if (!isCalculatePriceValid) {
            if (formRef.current?.triggerErrors) {
                await formRef.current.triggerErrors();
            }
            return;
        }
        const getValue = (v) => v?.value ?? v;
        const hasField = (key) => {
            if (!calculatePriceAdditionalFields) return false;
            const normalized = key.replace(/\./g, "_");
            return (
                normalized in calculatePriceAdditionalFields ||
                key in calculatePriceAdditionalFields
            );
        };
        const getOptional = (
            formKey,
            additionalKey,
            targetKey = null,
            transform = null,
        ) => {
            if (!hasField(additionalKey)) return {};
            const val = getValue(calculatePriceFormData?.[formKey]);
            if (val == null) return {};
            const transformed = transform ? transform(val) : val;
            return targetKey
                ? { [targetKey]: transformed }
                : { [formKey]: transformed };
        };

        const policyStartDate = getValue(
            calculatePriceFormData?.policy_start_date,
        );

        const payload = {
            vehicle: {
                number: calculatePriceFormData?.number,
                talon: calculatePriceFormData?.talon,
                wheel_direction: getValue(
                    calculatePriceFormData?.wheel_direction,
                ),
                usage: getValue(calculatePriceFormData?.vehicle_usage),
                engine_volume: calculatePriceFormData?.engine_volume,
                engine_power_kw: calculatePriceFormData?.engine_power_kw,
                ...getOptional(
                    "vehicle_gross_weight",
                    "vehicle.gross_weight",
                    "gross_weight",
                ),
                ...getOptional("vehicle_places", "vehicle.places", "places"),
            },
            insured: {
                xp: getValue(calculatePriceFormData?.driver_experience),
                ...getOptional(
                    "insured_location",
                    "insured.location",
                    "location",
                ),
                ...getOptional("insured_address", "insured.address", "address"),
                ...getOptional(
                    "insured_nationality",
                    "insured.nationality",
                    "nationality",
                ),
                ...getOptional(
                    "insured_birth_date",
                    "insured.birth_date",
                    "birth_date",
                ),
            },
            policy: {
                installments: getValue(
                    calculatePriceFormData?.policy_installments,
                ),
                start_date: policyStartDate
                    ? formatDate(new Date(policyStartDate), "yyyy-MM-dd")
                    : null,
            },
        };
        setPayloadOffer(payload);

        // Call calculate mutation
        setIsCalculating(true);
        try {
            const response = await calculateMutation(payload);

            if (response?.calculation_id) {
                setCalculationId(response?.calculation_id);
                setOfferData({});
                setInsuredPersonFormData(null);
                setLastVisitedStep(3);
                router.reload({
                    data: {
                        step: 3,
                    },
                    preserveScroll: false,
                    onFinish: () => window.scrollTo(0, 0),
                });
            } else {
                showAlert({
                    title: "Възникна грешка",
                    message: "Неуспешно изчисление. Моля, опитайте отново.",
                    status: "error",
                    closable: true,
                    cta: {
                        label: "OK",
                        actionFun: () => {
                            closeAlert();
                        },
                    },
                });
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                "Възникна грешка при изчисляване на цената. Моля, опитайте отново.";

            showAlert({
                title: "Възникна грешка",
                message: errorMessage,
                status: "error",
                closable: true,
                cta: {
                    label: "OK",
                    actionFun: () => {
                        closeAlert();
                        // If it's a validation error for policy.start_date, stay on current step
                        if (
                            error?.response?.status === 422 &&
                            error?.response?.data?.errors?.["policy.start_date"]
                        ) {
                            // Error is already shown, user can fix it
                        }
                    },
                },
            });
        } finally {
            setIsCalculating(false);
        }
    };

    const getOfferDetails = () => {
        if (!vehicleData) {
            return null;
        }

        return [
            {
                items: [
                    {
                        label: "Номер на талон",
                        value: vehicleData.talon || "-",
                    },
                    {
                        label: "Марка",
                        value: vehicleData.mark_name || "-",
                    },
                    {
                        label: "Модел",
                        value: vehicleData.model_name || "-",
                    },
                    {
                        label: "Година",
                        value: vehicleData.year || "-",
                    },
                    {
                        label: "Регистрационен номер",
                        value: vehicleData.number || "-",
                    },
                ],
            },
        ];
    };

    return (
        <InsuranceStepLayout
            bubbleText="Почти сме готови! Потвърди данните на автомобила, избери срок и вноски — аз ще ти изчисля най-добрата цена."
            form={<CalculatePriceForm ref={formRef} />}
            offerDetails={getOfferDetails()}
            showDivider={true}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                icon: IconCheck,
                loading: isCalculating,
            }}
        />
    );
};

export default CalculatePriceStep;
