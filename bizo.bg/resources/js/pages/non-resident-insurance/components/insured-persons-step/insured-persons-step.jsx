/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRef, useState } from "react";

/**
 * Internal dependencies
 */
import InsuredPersonsForm from "@/pages/non-resident-insurance/components/insured-persons-step/insured-persons-form";
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import useGetOfferMutation from "@/pages/non-resident-insurance/data/use-get-offer-mutation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Text from "@/components/text/text";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { useInsuranceDataContext } from "@/pages/non-resident-insurance/contexts/insurance-data-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const InsuredPersonsStep = () => {
    const formRef = useRef(null);
    const { priceData, setOfferData } = useInsuranceDataContext();
    const {
        calculatePriceFormData,
        insuredPersonsFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { isInsuredPersonsValid } = useValidityContext();
    const personsCount = calculatePriceFormData.customer_groups[0].count;

    const { mutate, isPending } = useGetOfferMutation();
    const [expandedSectionIndex, setExpandedSectionIndex] = useState(0);
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
        personsCount,
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
            const insurer = insuredPersonsFormData.insurer;
            const getOfferData = {
                currency: calculatePriceFormData.currency,
                installment: calculatePriceFormData.installment,
                start_date: calculatePriceFormData.start_date,
                period: calculatePriceFormData.period,
                discounts: [],
                customer_groups: [
                    {
                        id:
                            calculatePriceFormData.customer_groups?.[0]?.id ??
                            null,
                        count: personsCount,
                        insured_customers: insuredPersonsFormData.insuredPersons
                            .slice(0, personsCount)
                            .map((customer) => ({
                                pin_type: customer.pinType,
                                pin: customer.pin,
                                first_name: customer.firstName,
                                last_name: customer.lastName,
                                latin_full_name: customer.latinFullName,
                                district_id: customer.district,
                                municipality_id: customer.municipality,
                                town_id: customer.town,
                                country_id: customer.country,
                                address: customer.address,
                                post_code: customer.postcode,
                                mobile_phone: customer.mobilePhone || null,
                                birth_date: customer.birth_date || null,
                            })),
                    },
                ],
                insurer: {
                    pin_type: insurer.personal_identification_number_type,
                    pin: insurer.personal_identification_number,
                    first_name: insurer.first_name,
                    last_name: insurer.last_name,
                    latin_full_name: insurer.latin_full_name,
                    district_id: insurer.district_id,
                    municipality_id: insurer.municipality_id,
                    town_id: insurer.town_id,
                    address: insurer.address,
                    mobile_phone: insurer.mobile_phone,
                    post_code: insurer.post_code,
                    email: insurer.email,
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
                            priceData.currency == "BGN"
                                ? convertBGNToEUR(priceData.amount)
                                : "",
                        subSuffix: priceData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Данък",
                        value: formatNumber(priceData.tax, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency == "BGN"
                                ? convertBGNToEUR(priceData.tax)
                                : "",
                        subSuffix: priceData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Обща сума",
                        value: formatNumber(priceData.total_amount, ",", 2),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency == "BGN"
                                ? convertBGNToEUR(priceData.total_amount)
                                : "",
                        subSuffix: priceData.currency == "BGN" ? "EUR" : "",
                    },
                    {
                        label: "Вноски",
                        value: priceData.installments?.length || 0,
                    },
                    {
                        label: "За плащане сега",
                        value: formatNumber(
                            priceData.installments[0].total_amount,
                            ",",
                            2,
                        ),
                        suffix: priceData.currency,
                        subValue:
                            priceData.currency === "BGN"
                                ? convertBGNToEUR(
                                      priceData.installments[0].total_amount,
                                  )
                                : null,
                        subSuffix: priceData.currency === "BGN" ? "EUR" : null,
                    },
                ],
            },
        ];
    };

    const isLastSection = expandedSectionIndex === totalSections - 1;

    const handleStepButtonClick = async () => {
        if (!formRef.current) return;
        await formRef.current.validateCurrentAndNext();
    };

    return (
        <InsuranceStepLayout
            bubbleText="За да продължим смело напред, въведи нужните данни. Ще се погрижа всичко да е подготвено перфектно!"
            form={
                <InsuredPersonsForm
                    ref={formRef}
                    onAllSectionsCompleted={(allCompleted) =>
                        handleContinue(
                            calculatePriceFormData,
                            insuredPersonsFormData,
                            personsCount,
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

export default InsuredPersonsStep;
