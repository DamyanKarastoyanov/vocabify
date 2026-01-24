/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRef, useState } from "react";

/**
 * Internal dependencies
 */
import InsuredPersonsForm from "@/pages/travel-insurance/components/insured-persons-step/insured-persons-form";
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import useGetOfferMutation from "@/pages/travel-insurance/data/use-get-offer-mutation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Text from "@/components/text/text";
import { useInsuranceDataContext } from "@/pages/travel-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/travel-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/travel-insurance/contexts/validity-context";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const InsuredPersons = () => {
    const formRef = useRef(null);
    const { priceData, setOfferData } = useInsuranceDataContext();
    const {
        setLastVisitedStep,
        calculatePriceFormData,
        insuredPersonsFormData,
    } = useFormDataContext();
    const { isInsuredPersonsValid } = useValidityContext();

    const { mutate, isPending } = useGetOfferMutation();
    const [expandedSectionIndex, setExpandedSectionIndex] = useState(0);
    const personsCount =
        calculatePriceFormData?.customer_groups?.[0]?.count ?? 1;
    const [totalSections, setTotalSections] = useState(personsCount);

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const handleContinue = (
        calculatePriceFormData,
        insuredPersonsFormData,
        forcedValidity = null,
    ) => {
        // Use forced validity if provided, otherwise use the state
        const isValid =
            forcedValidity !== null ? forcedValidity : isInsuredPersonsValid;

        // Check if all insured persons data is valid before proceeding
        if (!isValid) {
            // Show alert that form needs to be completed
            showAlert({
                title: <Text color="red-500">Формата не е завършена</Text>,
                message:
                    "Моля, попълнете всички задължителни полета за застрахованите лица преди да продължите.",
                closable: true,
                hideable: true,
            });
            return;
        }

        if (insuredPersonsFormData.isInsurerAlsoACustomer) {
            const getOfferData = {
                currency: calculatePriceFormData.currency,
                installment: calculatePriceFormData.installment,
                start_date: calculatePriceFormData.start_date,
                end_date: calculatePriceFormData.end_date,
                travel_type: calculatePriceFormData.travel_type,
                travel_type_activity:
                    calculatePriceFormData.travel_type_activity,
                destination: calculatePriceFormData.destination,
                additional_coverages:
                    calculatePriceFormData.additional_coverages,
                discounts: calculatePriceFormData.discounts,
                // is_multi_travel: false, // this is hardcoded for now, can be changed later
                // max_days_per_travel: 0, // this is hardcoded for now, can be changed later
                customer_groups: [
                    {
                        id: 1,
                        insurance_amount: 10000,
                        insured_customers:
                            insuredPersonsFormData.insuredPersons.map(
                                (customer) => ({
                                    pin_type: customer.pinType,
                                    pin: customer.pin,
                                    first_name: customer.firstName,
                                    last_name: customer.lastName,
                                    latin_full_name: customer.latinFullName,
                                    is_student: customer.isStudent,
                                    birth_date: customer.birth_date,
                                }),
                            ),
                    },
                ],
                insurer: {
                    pin_type:
                        insuredPersonsFormData.customer
                            .personal_identification_number_type,
                    pin: insuredPersonsFormData.customer
                        .personal_identification_number,
                    first_name: insuredPersonsFormData.customer.first_name,
                    last_name: insuredPersonsFormData.customer.last_name,
                    district_id: insuredPersonsFormData.customer.district_id,
                    municipality_id:
                        insuredPersonsFormData.customer.municipality_id,
                    town_id: insuredPersonsFormData.customer.town_id,
                    address: insuredPersonsFormData.customer.address,
                    mobile_phone: insuredPersonsFormData.customer.mobile_phone,
                    post_code: insuredPersonsFormData.customer.post_code,
                    email: insuredPersonsFormData.customer.email,
                },
            };

            mutate(getOfferData, {
                onSuccess: (response) => {
                    setOfferData(response.data);
                    router.reload({
                        data: {
                            step: 3,
                        },
                        preserveScroll: false,
                        onFinish: () => window.scrollTo(0, 0),
                    });
                    setLastVisitedStep(3);
                },
                onError: (error) => {
                    showAlert({
                        title: <Text color="green-500">Възникна грешка</Text>,
                        message:
                            error?.response?.data?.message ||
                            "Възникна грешка при получаване на оферта. Моля, опитайте отново.",
                        closable: true,
                        hideable: true,
                    });
                },
            });
        } else {
            router.reload({
                data: {
                    step: 2.5,
                },
                preserveScroll: false,
                onFinish: () => window.scrollTo(0, 0),
            });
            setLastVisitedStep(2.5);
        }
    };

    const isLastSection = expandedSectionIndex === totalSections - 1;

    const handleStepButtonClick = async () => {
        if (!formRef.current) return;

        await formRef.current.validateCurrentAndNext();
    };

    const getPriceDetails = () => {
        if (!priceData) {
            return null;
        }

        return [
            {
                items: [
                    {
                        label: "Застраховател",
                        value: <LogoLink insurer={AXIOM_INSURER} />,
                    },
                    {
                        label: "Премия",
                        value: formatNumber(priceData.amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.amount)
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                    },
                    {
                        label: "Данък",
                        value: formatNumber(priceData.tax, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.tax)
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                    },
                    {
                        label: "Обща сума",
                        value: formatNumber(priceData.total_amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.total_amount)
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                    },
                    {
                        label: "За плащане сега",
                        value: formatNumber(priceData.total_amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(priceData.total_amount)
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                    },
                ],
            },
        ];
    };

    return (
        <InsuranceStepLayout
            bubbleText="За да продължим напред с твоята полица — попълни нужните данни и да стягаме куфарите!"
            form={
                <InsuredPersonsForm
                    ref={formRef}
                    onAllSectionsCompleted={(allCompleted) =>
                        handleContinue(
                            calculatePriceFormData,
                            insuredPersonsFormData,
                            allCompleted,
                        )
                    }
                    onExpandedSectionChange={(index, count) => {
                        setExpandedSectionIndex(index);
                        setTotalSections(count);
                    }}
                />
            }
            offerDetails={getPriceDetails()}
            button={{
                text: isLastSection ? "Продължи" : "Напред",
                onClick: handleStepButtonClick,
                icon: IconCheck,
                loading: isPending,
            }}
        />
    );
};

export default InsuredPersons;
