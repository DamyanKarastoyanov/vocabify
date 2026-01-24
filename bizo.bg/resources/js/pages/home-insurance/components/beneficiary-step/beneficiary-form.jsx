/**
 * External dependencies
 */
import {
    useState,
    useEffect,
    useMemo,
    forwardRef,
    useImperativeHandle,
    useCallback,
    useRef,
} from "react";
import { useForm } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import IconUser from "@/components/icons/user";
import Icon from "@/components/icon/icon";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import useGetCustomerMunicipalityQuery from "@/pages/home-insurance/data/use-get-customer-municipality-query";
import useGetCustomerTownQuery from "@/pages/home-insurance/data/use-get-customer-town-query";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import { useFormDataContext } from "@/pages/home-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/home-insurance/contexts/validity-context";
import beneficiaryStepValidationSchema from "@/pages/home-insurance/validations/beneficiary-step-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const BeneficiaryForm = forwardRef((props, ref) => {
    const { home_insurance } = usePage().props;
    const {
        setPolicyHolderFormData,
        policyHolderFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setIsBeneficiaryValid } = useValidityContext();

    const [fieldsState, setFieldsState] = useState(home_insurance.fields || []);
    const fields = fieldsState;

    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [manuallyLocationChanged, setManuallyLocationChanged] =
        useState(false);

    const [customerDistrictId, setCustomerDistrictId] = useState(() => {
        const initialValue = policyHolderFormData?.third_party_customer
            ?.district_id
            ? parseInt(policyHolderFormData.third_party_customer.district_id)
            : home_insurance.fields.find((f) => f.key === "customer_district")
                  ?.selected?.value || null;

        return initialValue;
    });

    const [customerMunicipalityId, setCustomerMunicipalityId] = useState(() => {
        const initialValue = policyHolderFormData?.customer?.municipality_id
            ? parseInt(policyHolderFormData.customer.municipality_id)
            : null;

        return initialValue;
    });

    const { toggleFieldEnabled, toggleFieldVisible } = useFieldControls(fields);

    const {
        register,
        formState: { errors, isValid },
        reset,
        control,
        setValue,
        watch,
        trigger,
        getValues,
    } = useForm({
        resolver: yupResolver(beneficiaryStepValidationSchema),
        mode: "onChange",
        defaultValues: useMemo(() => {
            toggleFieldEnabled(
                "customer_personal_identification_number_type",
                false,
            );

            let defaultValues = {
                bank: fields
                    .find((f) => f.key === "bank")
                    ?.values?.find((v) => v.value === 1),
            };

            if (policyHolderFormData?.bank) {
                defaultValues.bank = fields
                    .find((f) => f.key === "bank")
                    ?.values?.find(
                        (v) => v.value === policyHolderFormData.bank,
                    );
            }

            if (policyHolderFormData?.third_party_customer) {
                const customer = policyHolderFormData.third_party_customer;
                const idTypeField = fields.find(
                    (f) =>
                        f.key ===
                        "customer_personal_identification_number_type",
                );
                const customerPINType = idTypeField?.values?.find(
                    (v) => v.value === 4,
                );
                return {
                    ...defaultValues,
                    customer_personal_identification_number_type:
                        customerPINType,
                    customer_personal_identification_number:
                        customer.personal_identification_number,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    customer_district: fields
                        .find((f) => f.key === "customer_district")
                        ?.values?.find(
                            (v) => v.value === parseInt(customer.district_id),
                        ),
                    customer_postcode: customer.post_code,
                    customer_address: customer.address,
                    mobile_phone: customer.mobile_phone,
                };
            }

            return {
                ...defaultValues,
                ...fields.reduce((acc, field) => {
                    if (field.key && field.values && field.values.length > 0) {
                        // Default customer_personal_identification_number_type to value 4
                        if (
                            field.key ===
                            "customer_personal_identification_number_type"
                        ) {
                            acc[field.key] = field.values.find(
                                (v) => v.value === 4,
                            );
                        } else {
                            acc[field.key] = field.selected
                                ? field.selected
                                : undefined;
                        }
                    }
                    if (field.key === "customer_district") {
                        acc.customer_district =
                            field.selected || field.values?.[0];
                    }
                    if (field.key === "customer_municipality") {
                        acc.customer_municipality =
                            field.selected || field.values?.[0];
                    }
                    return acc;
                }, {}),
            };
        }, [fields, policyHolderFormData]),
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    const triggerErrors = useCallback(async () => {
        await trigger();
        const requiredFields = [
            "bank",
            "customer_personal_identification_number_type",
            "customer_personal_identification_number",
            "first_name",
            "last_name",
            "customer_district",
            "customer_municipality",
            "customer_town",
            "customer_postcode",
            "customer_address",
            "mobile_phone",
        ];
        requiredFields.forEach((fieldName) => {
            const currentValue = getValues(fieldName);
            setValue(fieldName, currentValue, {
                shouldValidate: true,
                shouldTouch: true,
            });
        });
    }, [trigger, getValues, setValue]);

    useImperativeHandle(ref, () => ({ triggerErrors }));

    const {
        data: customerMunicipalities,
        invalidateQuery: invalidateCustomerMunicipalityQuery,
    } = useGetCustomerMunicipalityQuery(customerDistrictId);

    const {
        data: customerTowns,
        invalidateQuery: invalidateCustomerTownQuery,
    } = useGetCustomerTownQuery(customerMunicipalityId);

    const customerIdType = watch(
        "customer_personal_identification_number_type",
    );
    const prevPinTypeRef = useRef(customerIdType?.value);
    const isInitialMountRef = useRef(true);

    // Set initial visibility on mount
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            const initialPinType = customerIdType?.value;

            if (initialPinType === 4) {
                toggleFieldVisible("last_name", false);
                setValue("last_name", null);
                setFieldsState((prevFields) => [...prevFields]);
            }
        }
    }, []);

    useEffect(() => {
        const currentPinType = customerIdType?.value;
        const prevPinType = prevPinTypeRef.current;

        // Only update if pinType actually changed
        if (currentPinType !== prevPinType) {
            prevPinTypeRef.current = currentPinType;

            if (currentPinType === 4) {
                toggleFieldVisible("last_name", false);
                setValue("last_name", null);
                // Create new array reference to trigger re-render
                setFieldsState((prevFields) => [...prevFields]);
            } else {
                toggleFieldVisible("last_name", true);
                // Create new array reference to trigger re-render
                setFieldsState((prevFields) => [...prevFields]);
            }
        }
    }, [customerIdType?.value, toggleFieldVisible, setValue]);

    // Set municipality options and value once they're loaded
    useEffect(() => {
        if (customerMunicipalities?.length === 1) {
            setValue("customer_municipality", customerMunicipalities[0], {
                shouldValidate: true,
            });
            setCustomerMunicipalityId(customerMunicipalities[0].value);
        }

        if (manuallyLocationChanged) {
            return;
        }

        if (
            customerMunicipalities?.length > 0 &&
            policyHolderFormData?.third_party_customer?.municipality_id
        ) {
            const municipalityId =
                policyHolderFormData?.third_party_customer?.municipality_id;
            const defaultMunicipality = customerMunicipalities.find(
                (m) => m.value === parseInt(municipalityId),
            );
            if (defaultMunicipality) {
                setValue("customer_municipality", defaultMunicipality, {
                    shouldValidate: true,
                });
                setCustomerMunicipalityId(defaultMunicipality.value);
            }
        }
    }, [customerMunicipalities, policyHolderFormData, manuallyLocationChanged]);

    // Set town options and value once they're loaded
    useEffect(() => {
        if (manuallyLocationChanged) {
            return;
        }

        if (
            customerTowns?.length > 0 &&
            policyHolderFormData?.third_party_customer?.town_id
        ) {
            const townId = policyHolderFormData?.third_party_customer?.town_id;
            const defaultTown = customerTowns.find(
                (t) => t.value === parseInt(townId),
            );
            if (defaultTown) {
                setValue("customer_town", defaultTown, {
                    shouldValidate: true,
                });
            }
        }
    }, [customerTowns, policyHolderFormData, manuallyLocationChanged]);

    // Initial data load - trigger queries if we have IDs
    useEffect(() => {
        if (customerDistrictId) {
            invalidateCustomerMunicipalityQuery();
        }
    }, [customerDistrictId]);

    useEffect(() => {
        if (customerMunicipalityId) {
            invalidateCustomerTownQuery();
        }
    }, [customerMunicipalityId]);

    const formData = useMemo(() => {
        const customerIdType = watch(
            "customer_personal_identification_number_type",
        );
        const customerId = watch("customer_personal_identification_number");
        const firstName = watch("first_name");
        const lastName = watch("last_name");
        const customerDistrict = watch("customer_district");
        const customerMunicipality = watch("customer_municipality");
        const customerTown = watch("customer_town");
        const customerPostcode = watch("customer_postcode");
        const customerAddress = watch("customer_address");
        const mobilePhone = watch("mobile_phone");
        const bank = watch("bank");

        if (bank?.value === 1) {
            return {
                bank: bank?.value,
                third_party_customer: {
                    personal_identification_number_type: customerIdType?.value
                        ? parseInt(customerIdType.value)
                        : null,
                    personal_identification_number:
                        customerId?.toString() || null,
                    first_name: firstName || null,
                    last_name: lastName || null,
                    district_id: customerDistrict?.value?.toString() || null,
                    municipality_id:
                        customerMunicipality?.value?.toString() || null,
                    town_id: customerTown?.value?.toString() || null,
                    post_code: customerPostcode?.toString() || null,
                    address: customerAddress?.toString() || null,
                    mobile_phone: mobilePhone?.toString() || null,
                },
            };
        } else {
            return {
                bank: bank?.value,
                third_party_customer: undefined,
            };
        }
    }, [
        watch("customer_personal_identification_number_type"),
        watch("customer_personal_identification_number"),
        watch("first_name"),
        watch("last_name"),
        watch("customer_district"),
        watch("customer_municipality"),
        watch("customer_town"),
        watch("customer_postcode"),
        watch("customer_address"),
        watch("mobile_phone"),
        watch("bank"),
    ]);

    useEffect(() => {
        const isInitialized = !!(
            (!policyHolderFormData?.bank &&
                !policyHolderFormData?.third_party_customer) ||
            (policyHolderFormData.bank &&
                formData.bank === policyHolderFormData.bank &&
                (formData.bank !== 1 ||
                    (policyHolderFormData.third_party_customer &&
                        JSON.stringify(formData?.third_party_customer) ===
                            JSON.stringify(
                                policyHolderFormData?.third_party_customer,
                            ))))
        );

        if (isInitialized) {
            setIsFormInitialized(true);
        }

        // Compare form data properly, handling the property name difference
        const normalizedFormData = {
            bank: formData.bank,
            third_party_customer: formData.third_party_customer,
        };

        const normalizedPolicyHolderFormData = {
            bank: policyHolderFormData?.bank,
            third_party_customer: policyHolderFormData?.third_party_customer,
        };

        const isFormChanged =
            JSON.stringify(normalizedFormData) !==
            JSON.stringify(normalizedPolicyHolderFormData);

        if (isFormInitialized && isFormChanged) {
            setPolicyHolderFormData({ ...policyHolderFormData, ...formData });
            setLastVisitedStep(3.5);
        }
    }, [formData, policyHolderFormData, isFormInitialized]);

    useEffect(() => {
        setIsBeneficiaryValid(isValid);
    }, [isValid]);

    useEffect(() => {
        if (!isFormInitialized && fields.length > 0) {
            const idTypeField = fields.find(
                (f) => f.key === "customer_personal_identification_number_type",
            );
            const defaultIdType = idTypeField?.values?.find(
                (v) => v.value === 4,
            );

            const districtField = fields.find(
                (f) => f.key === "customer_district",
            );
            const municipalityField = fields.find(
                (f) => f.key === "customer_municipality",
            );

            let defaultValues = {
                bank: fields.find((f) => f.key === "bank")?.selected,
                customer_personal_identification_number_type: defaultIdType,
                customer_district:
                    districtField?.selected || districtField?.values?.[0],
                customer_municipality:
                    municipalityField?.selected ||
                    municipalityField?.values?.[0],
            };
            if (policyHolderFormData?.bank) {
                defaultValues.bank = fields
                    .find((f) => f.key === "bank")
                    ?.values?.find(
                        (v) => v.value === policyHolderFormData.bank,
                    );
            }
            if (policyHolderFormData?.third_party_customer) {
                const customer = policyHolderFormData.third_party_customer;
                const customerPINType = defaultIdType;
                defaultValues = {
                    ...defaultValues,
                    customer_personal_identification_number_type:
                        customerPINType,
                    customer_personal_identification_number:
                        customer.personal_identification_number,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    customer_district: fields
                        .find((f) => f.key === "customer_district")
                        ?.values?.find(
                            (v) => v.value === parseInt(customer.district_id),
                        ),
                    customer_municipality: fields
                        .find((f) => f.key === "customer_municipality")
                        ?.values?.find(
                            (v) =>
                                v.value === parseInt(customer.municipality_id),
                        ),
                    customer_town: fields
                        .find((f) => f.key === "customer_town")
                        ?.values?.find(
                            (v) => v.value === parseInt(customer.town_id),
                        ),
                    customer_postcode: customer.post_code,
                    customer_address: customer.address,
                    mobile_phone: customer.mobile_phone,
                };
            }

            reset(defaultValues);

            // Set customerDistrictId if default district is set
            if (defaultValues.customer_district?.value) {
                setCustomerDistrictId(defaultValues.customer_district.value);
            }

            // Explicitly set customer_personal_identification_number_type to 4 if not set from saved data
            if (
                !policyHolderFormData?.third_party_customer
                    ?.personal_identification_number_type
            ) {
                const idTypeValue = idTypeField?.values?.find(
                    (v) => v.value === 4,
                );
                if (idTypeValue) {
                    setValue(
                        "customer_personal_identification_number_type",
                        idTypeValue,
                        { shouldValidate: false },
                    );
                }
            }
        }
    }, [fields, policyHolderFormData, isFormInitialized, reset, setValue]);

    return (
        <Form id="beneficiary-form">
            <BlockStack gap="800">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconUser} size="600" />

                                <Text variant="heading-m">
                                    Данни на трето ползващо се лице
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                {RenderFormFieldsUtils.renderSelectField({
                                    fieldName: "bank",
                                    fields: fields,
                                    control,
                                    error: errors.bank?.message,
                                })}

                                {watch("bank")?.value === 1 && (
                                    <BlockStack gap="400">
                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName:
                                                        "customer_personal_identification_number_type",
                                                    fields: fields,
                                                    control,
                                                    error: errors
                                                        .customer_personal_identification_number_type
                                                        ?.message,
                                                },
                                            )}

                                            {RenderFormFieldsUtils.renderTextField(
                                                "customer_personal_identification_number",
                                                fields,
                                                register,
                                                errors
                                                    .customer_personal_identification_number
                                                    ?.message,
                                            )}
                                        </InlineStack>

                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderTextField(
                                                "first_name",
                                                fields,
                                                register,
                                                errors.first_name?.message,
                                            )}

                                            {fields.find(
                                                (f) => f.key === "last_name",
                                            )?.isVisible &&
                                                RenderFormFieldsUtils.renderTextField(
                                                    "last_name",
                                                    fields,
                                                    register,
                                                    errors.last_name?.message,
                                                )}
                                        </InlineStack>

                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName:
                                                        "customer_district",
                                                    onChangeHandler: (
                                                        value,
                                                    ) => {
                                                        setValue(
                                                            "customer_municipality",
                                                            null,
                                                        );
                                                        setValue(
                                                            "customer_town",
                                                            null,
                                                        );
                                                        setValue(
                                                            "customer_postcode",
                                                            null,
                                                        );
                                                        toggleFieldEnabled(
                                                            "customer_town",
                                                            false,
                                                        );
                                                        invalidateCustomerMunicipalityQuery();
                                                        invalidateCustomerTownQuery();
                                                        setCustomerDistrictId(
                                                            value.value,
                                                        );
                                                        setManuallyLocationChanged(
                                                            true,
                                                        );
                                                    },
                                                    fields: fields,
                                                    control,
                                                    error: errors
                                                        .customer_district
                                                        ?.message,
                                                },
                                            )}

                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName:
                                                        "customer_municipality",
                                                    onRenderHandler: (
                                                        field,
                                                    ) => {
                                                        field.values =
                                                            customerMunicipalities?.length >
                                                            0
                                                                ? customerMunicipalities
                                                                : [];
                                                        return field;
                                                    },
                                                    onChangeHandler: (
                                                        value,
                                                    ) => {
                                                        setValue(
                                                            "customer_town",
                                                            null,
                                                        );
                                                        setValue(
                                                            "customer_postcode",
                                                            null,
                                                        );
                                                        toggleFieldEnabled(
                                                            "customer_town",
                                                            true,
                                                        );
                                                        invalidateCustomerTownQuery();
                                                        setCustomerMunicipalityId(
                                                            value.value,
                                                        );
                                                        setManuallyLocationChanged(
                                                            true,
                                                        );
                                                    },
                                                    fields: fields,
                                                    control,
                                                    error: errors
                                                        .customer_municipality
                                                        ?.message,
                                                },
                                            )}
                                        </InlineStack>

                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderSelectField(
                                                {
                                                    fieldName: "customer_town",
                                                    onRenderHandler: (
                                                        field,
                                                    ) => {
                                                        field.values =
                                                            customerTowns?.length >
                                                            0
                                                                ? customerTowns
                                                                : [];
                                                        return field;
                                                    },
                                                    onChangeHandler: (
                                                        value,
                                                    ) => {
                                                        setValue(
                                                            "customer_postcode",
                                                            value.postcode,
                                                            {
                                                                shouldValidate: true,
                                                            },
                                                        );
                                                        setManuallyLocationChanged(
                                                            true,
                                                        );
                                                    },
                                                    fields: fields,
                                                    control,
                                                    error: errors.customer_town
                                                        ?.message,
                                                },
                                            )}

                                            {RenderFormFieldsUtils.renderTextField(
                                                "customer_postcode",
                                                fields,
                                                register,
                                                errors.customer_postcode
                                                    ?.message,
                                            )}
                                        </InlineStack>

                                        <InlineStack
                                            gap="800"
                                            rowGap="300"
                                            align="space-between"
                                        >
                                            {RenderFormFieldsUtils.renderTextField(
                                                "customer_address",
                                                fields,
                                                register,
                                                errors.customer_address
                                                    ?.message,
                                            )}

                                            {RenderFormFieldsUtils.renderTextField(
                                                "mobile_phone",
                                                fields,
                                                register,
                                                errors.mobile_phone?.message,
                                            )}
                                        </InlineStack>
                                    </BlockStack>
                                )}
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
});

export default BeneficiaryForm;
