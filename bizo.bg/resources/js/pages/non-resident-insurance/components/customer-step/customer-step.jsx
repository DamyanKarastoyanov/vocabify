/**
 * External dependencies
 */
import { router } from "@inertiajs/react";
import { useRef } from "react";

/**
 * Internal dependencies
 */
import CustomerStepForm from "@/pages/non-resident-insurance/components/customer-step/customer-step-form";
import IconCheck from "@/components/icons/check";
import InsuranceStepLayout from "@/components/insurance-step-layout/insurance-step-layout";
import useGetOfferMutation from "@/pages/non-resident-insurance/data/use-get-offer-mutation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import Text from "@/components/text/text";
import { useInsuranceDataContext } from "@/pages/non-resident-insurance/contexts/insurance-data-context";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import { formatNumber } from "@/utils/formatting";
import { convertBGNToEUR } from "@/utils/currency";
import LogoLink from "@/components/logo-link/logo-link";
import { AXIOM_INSURER } from "@/utils/insurers-list";

const CustomerStep = () => {
    const { priceData, setOfferData } = useInsuranceDataContext();
    const {
        setLastVisitedStep,
        calculatePriceFormData,
        insuredPersonsFormData,
    } = useFormDataContext();
    const personsCount = calculatePriceFormData.customer_groups[0].count;

    const { isInsuredPersonsValid } = useValidityContext();
    const customerFormRef = useRef();

    const { mutate, isPending } = useGetOfferMutation();

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
    ) => {
        // Check if all insured persons data is valid before proceeding
        if (!isInsuredPersonsValid) {
            // Trigger validation on the customer form to show error messages
            if (customerFormRef.current) {
                customerFormRef.current.triggerErrors();
            }
            return;
        }

        const getOfferData = {
            currency: calculatePriceFormData.currency,
            installment: calculatePriceFormData.installment,
            start_date: calculatePriceFormData.start_date,
            period: calculatePriceFormData.period,
            discounts: [],
            customer_groups: [
                {
                    id: calculatePriceFormData.customer_groups?.[0]?.id ?? null,
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
                pin_type:
                    insuredPersonsFormData.insurer
                        .personal_identification_number_type,
                pin: insuredPersonsFormData.insurer
                    .personal_identification_number,
                first_name: insuredPersonsFormData.insurer.first_name,
                last_name: insuredPersonsFormData.insurer.last_name,
                latin_full_name: insuredPersonsFormData.insurer.latin_full_name,
                district_id: insuredPersonsFormData.insurer.district_id,
                municipality_id: insuredPersonsFormData.insurer.municipality_id,
                town_id: insuredPersonsFormData.insurer.town_id,
                address: insuredPersonsFormData.insurer.address,
                mobile_phone: insuredPersonsFormData.insurer.mobile_phone,
                post_code: insuredPersonsFormData.insurer.post_code,
                email: insuredPersonsFormData.insurer.email,
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

    return (
        <InsuranceStepLayout
            bubbleText="Окей, време е за данните на застраховащото лице. Попълни ги тук, а аз ще сглобя пъзела и продължаваме към финала!"
            form={<CustomerStepForm ref={customerFormRef} />}
            offerDetails={getPriceDetails()}
            button={{
                text: "Продължи",
                onClick: () =>
                    handleContinue(
                        calculatePriceFormData,
                        insuredPersonsFormData,
                        personsCount,
                    ),
                icon: IconCheck,
                loading: isPending,
            }}
        />
    );
};

export default CustomerStep;
