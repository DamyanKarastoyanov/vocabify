/**
 * External dependencies
 */
import { router } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import { useRef } from "react";
import InsuredPersonForm from "@/pages/mtpl-insurance/components/insured-person-step/insured-person-form";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import Text from "@/components/text/text";
import { useValidityContext } from "@/pages/mtpl-insurance/contexts/validity-context";
import { useFormDataContext } from "@/pages/mtpl-insurance/contexts/form-data-context";
import useConfirmOfferMutation from "@/pages/mtpl-insurance/data/use-confirm-offer-mutation";
import { useInsuranceDataContext } from "@/pages/mtpl-insurance/contexts/insurance-data-context";
import { formatDate, formatNumber } from "@/utils/formatting";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import { convertBGNToEUR } from "@/utils/currency";

const InsuredPersonStep = () => {
    const formRef = useRef(null);
    const { isInsuredPersonValid } = useValidityContext();
    const {
        vehicleDataFormData,
        insuredPersonFormData,
        calculatePriceFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { offerData, payloadOffer, additionalFields } =
        useInsuranceDataContext();
    const insuredAdditionalFields = additionalFields?.insuredAdditionalFields;

    const { mutateAsync: confirmOfferMutation, isPending } =
        useConfirmOfferMutation();

    const { showAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const handleContinue = async () => {
        if (!isInsuredPersonValid) {
            if (formRef.current?.triggerErrors) {
                await formRef.current.triggerErrors();
            }
            return;
        }

        const getValue = (v) => v?.value ?? v;
        const hasField = (key) => {
            if (!insuredAdditionalFields) return false;
            const normalized = key.replace(/\./g, "_");
            return (
                normalized in insuredAdditionalFields ||
                key in insuredAdditionalFields
            );
        };
        const getOptional = (
            formKey,
            additionalKey,
            targetKey = null,
            transform = null,
        ) => {
            if (!hasField(additionalKey)) return {};
            const val = getValue(insuredPersonFormData?.[formKey]);
            if (val == null) return {};
            const transformed = transform ? transform(val) : val;
            return targetKey
                ? { [targetKey]: transformed }
                : { [formKey]: transformed };
        };

        const payload = {
            offer: offerData?.id,
            vehicle: {
                wheel_direction: getValue(
                    calculatePriceFormData?.wheel_direction,
                ),
                ...getOptional(
                    "vehicle_usage_primary",
                    "vehicle.usage|primary",
                    "usage",
                ),
                engine_volume: getValue(calculatePriceFormData?.engine_volume),
            },
            insured: {
                insured_names: insuredPersonFormData?.insured_names,
                insured_phone: insuredPersonFormData?.insured_phone,
                insured_email: insuredPersonFormData?.insured_email,
                ...getOptional(
                    "insured_location_primary",
                    "insured.location|primary",
                    "location",
                ),
            },
            policy: {
                policy_start_date: formatDate(
                    insuredPersonFormData?.policy_start_date,
                    "yyyy-MM-dd",
                ),
            },
        };

        try {
            await confirmOfferMutation(payload);

            router.reload({
                data: {
                    step: 5,
                },
                preserveScroll: false,
                onFinish: () => window.scrollTo(0, 0),
            });
            setLastVisitedStep(5);
        } catch (error) {
            showAlert({
                title: "Възникна грешка",
                message:
                    error?.response?.data?.message ||
                    "Възникна грешка при потвърждаване на оферта. Моля, опитайте отново.",
                closable: true,
                hideable: true,
            });
        }
    };

    //put here info like car talon, car number,
    const getOfferDetails = () => {
        return [
            {
                items: [
                    {
                        label: "Номер на кола",
                        value: vehicleDataFormData.number,
                    },
                    {
                        label: "Талон",
                        value: vehicleDataFormData.talon,
                    },
                    {
                        label: "Обща сума",
                        value: formatNumber(offerData.total_price, ",", 2),
                        suffix: offerData.currency,
                        subValue:
                            offerData.currency == "BGN"
                                ? convertBGNToEUR(offerData.total_price)
                                : "",
                        subSuffix: offerData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Вноски",
                        value: offerData.installments.length,
                    },
                    {
                        label: "За плащане сега",
                        value: formatNumber(
                            offerData.installments[0].total_bgn,
                            ",",
                            2,
                        ),
                        suffix: offerData.currency,
                        subValue:
                            offerData.currency === "BGN"
                                ? convertBGNToEUR(
                                      offerData.installments[0].total_bgn,
                                  )
                                : null,
                        subSuffix: offerData.currency === "BGN" ? "EUR" : null,
                    },
                ],
            },
        ];
    };

    return (
        <InsuranceStepLayout
            bubbleText="Попълни данните на застрахованото лице и ще подготвя полицата ти за издаване."
            form={<InsuredPersonForm ref={formRef} />}
            offerDetails={getOfferDetails()}
            button={{
                text: "Продължи",
                onClick: handleContinue,
                loading: isPending,
            }}
        />
    );
};

export default InsuredPersonStep;
