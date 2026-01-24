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
import policyHolderStepValidationSchema from "@/pages/home-insurance/validations/policy-holder-step-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const PolicyHolderForm = forwardRef((props, ref) => {
    const { home_insurance } = usePage().props;
    const {
        propertyDetailsFormData,
        setPolicyHolderFormData,
        policyHolderFormData,
        setLastVisitedStep,
        setIsThirdPartyBeneficiary,
        isThirdPartyBeneficiary,
        dropBeneficiaryData,
    } = useFormDataContext();
    const { setIsPolicyHolderValid } = useValidityContext();

    const [fieldsState, setFieldsState] = useState(home_insurance.fields || []);
    const fields = fieldsState;

    const isGuest = !fields.find((f) => f.key === "profile")?.isVisible;

    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [manuallyLocationChanged, setManuallyLocationChanged] =
        useState(false);

    const [customerDistrictId, setCustomerDistrictId] = useState(() => {
        if (policyHolderFormData?.customer?.district_id) {
            const parsedId = parseInt(
                policyHolderFormData.customer.district_id,
            );
            return parsedId;
        }

        if (isGuest && propertyDetailsFormData?.property?.district_id) {
            const parsedId = parseInt(
                propertyDetailsFormData.property.district_id,
            );
            return parsedId;
        }

        return (
            home_insurance.fields.find((f) => f.key === "customer_district")
                ?.selected?.value || null
        );
    });

    const [customerMunicipalityId, setCustomerMunicipalityId] = useState(() => {
        if (policyHolderFormData?.customer?.municipality_id) {
            return parseInt(policyHolderFormData.customer.municipality_id);
        }

        if (isGuest && propertyDetailsFormData?.property?.municipality_id) {
            return parseInt(propertyDetailsFormData.property.municipality_id);
        }

        return null;
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
        clearErrors,
        getValues,
    } = useForm({
        resolver: yupResolver(policyHolderStepValidationSchema),
        mode: "onChange",
        defaultValues: useMemo(() => {
            if (policyHolderFormData?.customer) {
                const customer = policyHolderFormData.customer;
                const baseValues = {
                    customer_personal_identification_number_type: fields
                        .find(
                            (f) =>
                                f.key ===
                                "customer_personal_identification_number_type",
                        )
                        ?.values?.find(
                            (v) =>
                                v.value ===
                                customer.personal_identification_number_type,
                        ),
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
                    email: customer.email,
                };

                // Add profile field if it exists
                const profileField = fields.find((f) => f.key === "profile");
                if (profileField) {
                    baseValues.profile =
                        profileField.selected ||
                        (profileField.values && profileField.values.length > 0
                            ? profileField.values[0]
                            : undefined);
                }

                return baseValues;
            }

            return fields.reduce((acc, field) => {
                const { key, values, selected } = field;
                const property = propertyDetailsFormData?.property;
                if (!key) return acc;

                switch (key) {
                    case "profile": {
                        if (values?.length) {
                            acc[key] = values[0];
                        }
                        return acc;
                    }
                    case "customer_postcode":
                    case "customer_address": {
                        if (isGuest && property) {
                            if (
                                key === "customer_postcode" &&
                                property.post_code
                            ) {
                                acc[key] = property.post_code;
                            }
                            if (
                                key === "customer_address" &&
                                property.address
                            ) {
                                acc[key] = property.address;
                            }
                        }
                        return acc;
                    }
                    case "customer_district": {
                        if (values?.length) {
                            acc[key] =
                                isGuest && property?.district_id
                                    ? values.find(
                                          (v) =>
                                              v.value ===
                                              parseInt(property.district_id),
                                      )
                                    : selected || undefined;
                        }
                        return acc;
                    }
                    case "customer_municipality": {
                        if (values?.length) {
                            acc[key] =
                                isGuest && property?.municipality_id
                                    ? values.find(
                                          (v) =>
                                              v.value ===
                                              parseInt(
                                                  property.municipality_id,
                                              ),
                                      )
                                    : selected || undefined;
                        }
                        return acc;
                    }
                    default: {
                        if (values?.length) {
                            acc[key] = selected || undefined;
                        }
                        return acc;
                    }
                }
            }, {});
        }, [fields, policyHolderFormData, isGuest, propertyDetailsFormData]),
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    const triggerErrors = useCallback(async () => {
        const requiredFields = [
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
            "email",
        ];
        requiredFields.forEach((fieldName) => {
            const currentValue = getValues(fieldName);
            setValue(fieldName, currentValue, {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        await trigger(requiredFields);
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

    // Set municipality options and value once they're loaded
    useEffect(() => {
        if (customerMunicipalities?.length === 1) {
            setValue("customer_municipality", customerMunicipalities[0], {
                shouldValidate: true,
            });
            setCustomerMunicipalityId(customerMunicipalities[0].value);
            toggleFieldEnabled("customer_town", true);
        }

        if (manuallyLocationChanged) {
            return;
        }

        const municipalityId =
            watch("profile")?.municipality_id ||
            policyHolderFormData?.customer?.municipality_id ||
            (isGuest
                ? propertyDetailsFormData?.property?.municipality_id
                : null);
        if (customerMunicipalities?.length > 0 && municipalityId) {
            const savedMunicipality = customerMunicipalities.find(
                (m) => m.value === parseInt(municipalityId),
            );
            if (savedMunicipality) {
                const currentMunicipality = watch("customer_municipality");
                if (currentMunicipality?.value !== savedMunicipality.value) {
                    setValue("customer_municipality", savedMunicipality, {
                        shouldValidate: true,
                    });
                    setCustomerMunicipalityId(savedMunicipality.value);
                }
            }
        }
    }, [
        customerMunicipalities,
        policyHolderFormData,
        watch,
        setValue,
        isGuest,
        manuallyLocationChanged,
    ]);

    // Set town options and value once they're loaded
    useEffect(() => {
        if (manuallyLocationChanged) {
            return;
        }

        const townId =
            watch("profile")?.town_id ||
            policyHolderFormData?.customer?.town_id ||
            (isGuest ? propertyDetailsFormData?.property?.town_id : null);
        if (customerTowns?.length > 0 && townId) {
            const savedTown = customerTowns.find(
                (t) => t.value === parseInt(townId),
            );
            if (savedTown) {
                const currentTown = watch("customer_town");
                if (currentTown?.value !== savedTown.value) {
                    setValue("customer_town", savedTown, {
                        shouldValidate: true,
                    });
                }
            }
        }
    }, [
        customerTowns,
        policyHolderFormData,
        watch,
        setValue,
        isGuest,
        manuallyLocationChanged,
    ]);

    // Handle initial profile auto-selection
    useEffect(() => {
        const profileField = fields.find((f) => f.key === "profile");
        if (
            profileField &&
            profileField.values &&
            profileField.values.length > 0 &&
            !profileField.selected &&
            !policyHolderFormData
        ) {
            const firstOption = profileField.values[0];
            if (firstOption?.value !== 0) {
                // Update state for dependent dropdowns
                // Auto-populate form with first profile's data
                const isAddressEmpty =
                    firstOption.district_id === null &&
                    firstOption.municipality_id === null &&
                    firstOption.town_id === null;

                // Check if the profile has identification number & type
                const hasIdentificationNumber =
                    firstOption.personal_identification_number_type &&
                    firstOption.personal_identification_number;

                setValue(
                    "customer_personal_identification_number_type",
                    hasIdentificationNumber
                        ? fields
                              .find(
                                  (f) =>
                                      f.key ===
                                      "customer_personal_identification_number_type",
                              )
                              ?.values?.find(
                                  (v) =>
                                      v.value ===
                                      firstOption.personal_identification_number_type,
                              )
                        : fields.find(
                              (f) =>
                                  f.key ===
                                  "customer_personal_identification_number_type",
                          )?.selected,
                );
                setValue(
                    "customer_personal_identification_number",
                    hasIdentificationNumber
                        ? firstOption.personal_identification_number
                        : null,
                );

                setValue("first_name", firstOption.first_name);
                // Only set last_name if pinType is not 4 (pinType 4 hides last_name field)
                const profilePinType = hasIdentificationNumber
                    ? firstOption.personal_identification_number_type
                    : fields.find(
                          (f) =>
                              f.key ===
                              "customer_personal_identification_number_type",
                      )?.selected?.value;
                if (profilePinType !== 4) {
                    setValue("last_name", firstOption.last_name);
                } else {
                    setValue("last_name", null);
                }

                // if the profile has no address, set the district to the default district
                const currentDistrict = isAddressEmpty
                    ? fields.find((f) => f.key === "customer_district")
                          ?.selected
                    : fields
                          .find((f) => f.key === "customer_district")
                          ?.values?.find(
                              (v) => v.value === firstOption.district_id,
                          ) || null;

                setValue("customer_district", currentDistrict);
                setCustomerDistrictId(currentDistrict?.value);

                // if the profile has no address, set the municipality to the default municipality
                const currentMunicipality = isAddressEmpty
                    ? fields.find((f) => f.key === "customer_municipality")
                          ?.selected
                    : fields
                          .find((f) => f.key === "customer_municipality")
                          ?.values?.find(
                              (v) => v.value === firstOption.municipality_id,
                          ) || null;

                setValue("customer_municipality", currentMunicipality);
                setCustomerMunicipalityId(currentMunicipality?.value);

                if (!isAddressEmpty) {
                    const currentTown = fields
                        .find((f) => f.key === "customer_town")
                        ?.values?.find((v) => v.value === firstOption.town_id);
                    setValue("customer_town", currentTown);
                }

                setValue("customer_postcode", firstOption.postal_code);
                setValue("customer_address", firstOption.address);
                setValue("mobile_phone", firstOption.mobile_phone);
                setValue("email", firstOption.email);
            }
        }
    }, [fields, setValue, policyHolderFormData]);

    // Watch customer personal identification number type for last_name visibility
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
        const email = watch("email");
        return {
            customer: {
                personal_identification_number_type: customerIdType?.value
                    ? parseInt(customerIdType.value)
                    : null,
                personal_identification_number: customerId?.toString() || null,
                first_name: firstName || null,
                last_name: lastName || null,
                district_id: customerDistrict?.value?.toString() || null,
                municipality_id:
                    customerMunicipality?.value?.toString() || null,
                town_id: customerTown?.value?.toString() || null,
                post_code: customerPostcode?.toString() || null,
                address: customerAddress?.toString() || null,
                mobile_phone: mobilePhone?.toString() || null,
                email: email?.toString() || null,
            },
        };
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
        watch("email"),
    ]);

    useEffect(() => {
        if (
            !isFormInitialized &&
            (!policyHolderFormData?.customer ||
                (policyHolderFormData?.customer &&
                    JSON.stringify(formData.customer) ===
                        JSON.stringify(policyHolderFormData?.customer)))
        ) {
            setIsFormInitialized(true);
        }

        const previousCustomer = policyHolderFormData?.customer || {};
        const isCustomerChanged =
            JSON.stringify(formData.customer) !==
            JSON.stringify(previousCustomer);

        if (isFormInitialized && isCustomerChanged) {
            setPolicyHolderFormData({
                ...policyHolderFormData,
                customer: formData.customer,
            });
            setLastVisitedStep(3);
        }
    }, [
        formData,
        isFormInitialized,
        policyHolderFormData,
        setPolicyHolderFormData,
        setLastVisitedStep,
    ]);

    useEffect(() => {
        setIsPolicyHolderValid(isValid);
    }, [isValid]);

    // Drop beneficiary data when checkbox is unchecked
    useEffect(() => {
        if (!isThirdPartyBeneficiary) {
            dropBeneficiaryData();
        }
    }, [isThirdPartyBeneficiary]);

    return (
        <Form id="policy-holder-form">
            <BlockStack gap="300">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconUser} size="600" />
                                <Text variant="heading-m">
                                    Данни на застрахован
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                {home_insurance.fields.find(
                                    (f) => f.key === "profile",
                                ) &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "profile",
                                        onChangeHandler: (value) => {
                                            if (value.value === 0) {
                                                setValue(
                                                    "customer_personal_identification_number_type",
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "customer_personal_identification_number_type",
                                                    )?.selected || null,
                                                );
                                                setValue(
                                                    "customer_personal_identification_number",
                                                    null,
                                                );
                                                setValue("first_name", null);
                                                setValue("last_name", null);

                                                const defaultDistrict =
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "customer_district",
                                                    )?.selected;
                                                setValue(
                                                    "customer_district",
                                                    defaultDistrict || null,
                                                );
                                                setCustomerDistrictId(
                                                    defaultDistrict?.value,
                                                );

                                                setValue(
                                                    "customer_municipality",
                                                    null,
                                                );
                                                setCustomerMunicipalityId(null);

                                                setValue("customer_town", null);
                                                setValue(
                                                    "customer_postcode",
                                                    null,
                                                );
                                                setValue(
                                                    "customer_address",
                                                    null,
                                                );
                                                setValue("mobile_phone", null);
                                                setValue("email", null);
                                            } else {
                                                const isAddressEmpty =
                                                    value.district_id ===
                                                        null &&
                                                    value.municipality_id ===
                                                        null &&
                                                    value.town_id === null;

                                                setCustomerDistrictId(
                                                    value.district_id,
                                                );
                                                setCustomerMunicipalityId(
                                                    value.municipality_id,
                                                );

                                                setValue(
                                                    "customer_personal_identification_number_type",
                                                    fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "customer_personal_identification_number_type",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.personal_identification_number_type,
                                                        ) || null,
                                                );
                                                setValue(
                                                    "customer_personal_identification_number",
                                                    value.personal_identification_number,
                                                );
                                                setValue(
                                                    "first_name",
                                                    value.first_name,
                                                );
                                                setValue(
                                                    "last_name",
                                                    value.last_name,
                                                );

                                                const currentDistrict =
                                                    isAddressEmpty
                                                        ? fields.find(
                                                              (f) =>
                                                                  f.key ===
                                                                  "customer_district",
                                                          )?.selected
                                                        : fields
                                                              .find(
                                                                  (f) =>
                                                                      f.key ===
                                                                      "customer_district",
                                                              )
                                                              ?.values?.find(
                                                                  (v) =>
                                                                      v.value ===
                                                                      value.district_id,
                                                              ) || null;
                                                setValue(
                                                    "customer_district",
                                                    currentDistrict,
                                                );
                                                setCustomerDistrictId(
                                                    currentDistrict?.value,
                                                );

                                                const currentMunicipality =
                                                    isAddressEmpty
                                                        ? fields.find(
                                                              (f) =>
                                                                  f.key ===
                                                                  "customer_municipality",
                                                          )?.selected
                                                        : fields
                                                              .find(
                                                                  (f) =>
                                                                      f.key ===
                                                                      "customer_municipality",
                                                              )
                                                              ?.values?.find(
                                                                  (v) =>
                                                                      v.value ===
                                                                      value.municipality_id,
                                                              ) || null;
                                                setValue(
                                                    "customer_municipality",
                                                    currentMunicipality,
                                                );
                                                setCustomerMunicipalityId(
                                                    currentMunicipality?.value,
                                                );

                                                if (!isAddressEmpty) {
                                                    const currentTown = fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "customer_town",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.town_id,
                                                        );
                                                    setValue(
                                                        "customer_town",
                                                        currentTown,
                                                    );
                                                }

                                                setValue(
                                                    "customer_postcode",
                                                    value.postal_code,
                                                );
                                                setValue(
                                                    "customer_address",
                                                    value.address,
                                                );
                                                setValue(
                                                    "mobile_phone",
                                                    value.mobile_phone,
                                                );
                                                setValue("email", value.email);
                                                invalidateCustomerMunicipalityQuery();
                                                invalidateCustomerTownQuery();
                                                triggerErrors();
                                            }
                                            setManuallyLocationChanged(false);
                                        },
                                        fields: fields,
                                        control,
                                        error: errors.profile?.message,
                                    })}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName:
                                            "customer_personal_identification_number_type",
                                        fields: fields,
                                        control,
                                        onChangeHandler: (value) => {
                                            const customerIdType = watch(
                                                "customer_personal_identification_number_type",
                                            );

                                            if (
                                                customerIdType?.value !=
                                                value?.value
                                            ) {
                                                setValue(
                                                    "customer_personal_identification_number",
                                                    null,
                                                );
                                                clearErrors(
                                                    "customer_personal_identification_number",
                                                );
                                            }
                                        },
                                        error: errors
                                            .customer_personal_identification_number_type
                                            ?.message,
                                    })}

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

                                    {fields.find((f) => f.key === "last_name")
                                        ?.isVisible &&
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
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "customer_district",
                                        onChangeHandler: (value) => {
                                            setValue(
                                                "customer_municipality",
                                                null,
                                            );
                                            setValue("customer_town", null);
                                            setValue("customer_postcode", null);
                                            setCustomerDistrictId(value.value);
                                            toggleFieldEnabled(
                                                "customer_town",
                                                false,
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: errors.customer_district
                                            ?.message,
                                    })}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "customer_municipality",
                                        onRenderHandler: (field) => {
                                            field.values =
                                                customerMunicipalities?.length >
                                                0
                                                    ? customerMunicipalities
                                                    : [];
                                            return field;
                                        },
                                        onChangeHandler: (value) => {
                                            setCustomerMunicipalityId(
                                                value.value,
                                            );
                                            setValue("customer_town", null);
                                            setValue("customer_postcode", null);
                                            invalidateCustomerTownQuery();
                                            toggleFieldEnabled(
                                                "customer_town",
                                                true,
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: errors.customer_municipality
                                            ?.message,
                                    })}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "customer_town",
                                        onRenderHandler: (field) => {
                                            field.values =
                                                customerTowns?.length > 0
                                                    ? customerTowns
                                                    : [];
                                            return field;
                                        },
                                        onChangeHandler: (value) => {
                                            setValue(
                                                "customer_postcode",
                                                value.postcode,
                                                {
                                                    shouldValidate: true,
                                                },
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: errors.customer_town?.message,
                                    })}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "customer_postcode",
                                        fields,
                                        register,
                                        errors.customer_postcode?.message,
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
                                        errors.customer_address?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "mobile_phone",
                                        fields,
                                        register,
                                        errors.mobile_phone?.message,
                                    )}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "email",
                                        fields,
                                        register,
                                        errors.email?.message,
                                    )}

                                    {RenderFormFieldsUtils.renderCheckboxField(
                                        "is_third_party_beneficiary",
                                        fields,
                                        control,
                                        isThirdPartyBeneficiary,
                                        setIsThirdPartyBeneficiary,
                                    )}
                                </InlineStack>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                </Surface>
            </BlockStack>
        </Form>
    );
});

export default PolicyHolderForm;
