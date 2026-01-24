/**
 * External dependencies
 */
import {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
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
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import IconUser from "@/components/icons/user";
import Icon from "@/components/icon/icon";
import useGetMunicipalityQuery from "@/pages/travel-insurance/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/travel-insurance/data/use-get-town-query";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import { useFormDataContext } from "@/pages/travel-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/travel-insurance/contexts/validity-context";
import CustomerValidationSchema from "@/pages/travel-insurance/validations/customer-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const createDefaultValues = (insuredPersonsFormData, fields) => {
    if (insuredPersonsFormData?.customer) {
        const customer = insuredPersonsFormData.customer;
        return {
            profile: customer.profile || null,
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
            customer_municipality: fields
                .find((f) => f.key === "customer_municipality")
                ?.values?.find(
                    (v) => v.value === parseInt(customer.municipality_id),
                ),
            customer_town: fields
                .find((f) => f.key === "customer_town")
                ?.values?.find((v) => v.value === parseInt(customer.town_id)),
            customer_postcode: customer.post_code,
            customer_address: customer.address,
            mobile_phone: customer.mobile_phone,
            email: customer.email,
        };
    }

    const profileField = fields.find((f) => f.key === "profile");
    if (
        profileField.isVisible &&
        profileField.values &&
        profileField.values.length > 0
    ) {
        const firstOption = profileField.values[0];
        const isAddressEmpty =
            firstOption.district_id === null &&
            firstOption.municipality_id === null &&
            firstOption.town_id === null;
        return {
            profile: firstOption,
            customer_personal_identification_number_type:
                fields
                    .find(
                        (f) =>
                            f.key ===
                            "customer_personal_identification_number_type",
                    )
                    .values?.find(
                        (v) =>
                            v.value ===
                            firstOption.personal_identification_number_type,
                    ) || null,
            customer_personal_identification_number:
                firstOption.personal_identification_number,
            first_name: firstOption.first_name,
            last_name: firstOption.last_name,
            customer_district: isAddressEmpty
                ? fields.find((f) => f.key === "customer_district")?.selected
                : fields
                      .find((f) => f.key === "customer_district")
                      ?.values?.find(
                          (v) => v.value === firstOption.district_id,
                      ) || null,
            customer_municipality: isAddressEmpty
                ? fields.find((f) => f.key === "customer_municipality")
                      ?.selected
                : fields
                      .find((f) => f.key === "customer_municipality")
                      ?.values?.find(
                          (v) => v.value === firstOption.municipality_id,
                      ) || null,
            customer_town: !isAddressEmpty
                ? fields
                      .find((f) => f.key === "customer_town")
                      ?.values?.find((v) => v.value === firstOption.town_id)
                : null,
            customer_postcode: firstOption.postal_code,
            customer_address: firstOption.address,
            mobile_phone: firstOption.mobile_phone,
            email: firstOption.email,
        };
    }

    return fields.reduce((acc, field) => {
        if (field.key && field.values && field.values.length > 0) {
            acc[field.key] = field.selected ? field.selected : undefined;
        }
        if (field.key === "profile") {
            acc.profile = field.selected || field.values?.[0];
        }
        if (field.key === "customer_district") {
            acc.customer_district = field.selected || field.values?.[0];
        }
        if (field.key === "customer_municipality") {
            acc.customer_municipality = field.selected || field.values?.[0];
        }
        return acc;
    }, {});
};

const CustomerStepForm = forwardRef((props, ref) => {
    const { travel_insurance } = usePage().props;
    const {
        insuredPersonsFormData,
        setInsuredPersonsFormData,
        setLastVisitedStep,
    } = useFormDataContext();
    const { setIsInsuredPersonsValid } = useValidityContext();

    const { showAlert, closeAlert } = useAlert(Alert, {
        duration: Infinity,
        style: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    });

    const [fieldsState, setFieldsState] = useState(
        travel_insurance.fields || [],
    );
    const fields = fieldsState;
    const { toggleFieldEnabled, toggleFieldVisible } = useFieldControls(fields);

    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [manuallyLocationChanged, setManuallyLocationChanged] =
        useState(false);

    const [customerDistrictId, setCustomerDistrictId] = useState(() => {
        if (insuredPersonsFormData?.customer?.district_id) {
            const parsedId = parseInt(
                insuredPersonsFormData.customer.district_id,
            );
            return parsedId;
        }
        return (
            travel_insurance.fields.find((f) => f.key === "district")?.selected
                ?.value || null
        );
    });

    const [customerMunicipalityId, setCustomerMunicipalityId] = useState(() => {
        return insuredPersonsFormData?.customer?.municipality_id
            ? parseInt(insuredPersonsFormData.customer.municipality_id)
            : null;
    });

    const {
        data: customerMunicipalities,
        invalidateQuery: invalidateCustomerMunicipalityQuery,
    } = useGetMunicipalityQuery(customerDistrictId);

    const {
        data: customerTowns,
        invalidateQuery: invalidateCustomerTownQuery,
    } = useGetTownQuery(customerMunicipalityId);

    const defaultValues = useMemo(
        () => createDefaultValues(insuredPersonsFormData, fields),
        [insuredPersonsFormData, fields],
    );

    const {
        register,
        control,
        watch,
        setValue,
        trigger,
        getValues,
        formState: { errors, isValid, touchedFields },
        clearErrors,
    } = useForm({
        resolver: yupResolver(CustomerValidationSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues,
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    // Helper function to determine if we should show errors
    const shouldShowError = (errorMessage, fieldName) => {
        const hasBeenTouched = fieldName
            ? touchedFields[fieldName]
            : Object.keys(touchedFields).length > 0;
        return hasBeenTouched && errorMessage;
    };

    // Watch all form fields
    const profile = watch("profile");
    const customerPersonalIdType = watch(
        "customer_personal_identification_number_type",
    );
    const customerPersonalId = watch("customer_personal_identification_number");
    const firstName = watch("first_name");
    const lastName = watch("last_name");
    const customerDistrict = watch("customer_district");
    const customerMunicipality = watch("customer_municipality");
    const customerTown = watch("customer_town");
    const customerPostCode = watch("customer_postcode");
    const customerAddress = watch("customer_address");
    const customerEmail = watch("email");
    const customerMobilePhone = watch("mobile_phone");

    // Keep customerDistrictId and customerMunicipalityId in sync for queries
    useEffect(() => {
        if (
            customerDistrict?.value &&
            customerDistrict.value !== customerDistrictId
        ) {
            setCustomerDistrictId(customerDistrict.value);
        }
        if (
            customerMunicipality?.value &&
            customerMunicipality.value !== customerMunicipalityId
        ) {
            setCustomerMunicipalityId(customerMunicipality.value);
        }
    }, [
        customerDistrict,
        customerMunicipality,
        customerDistrictId,
        customerMunicipalityId,
        setCustomerDistrictId,
        setCustomerMunicipalityId,
    ]);

    // Handle last_name visibility based on personal_identification_number_type
    const prevPinTypeRef = useRef(customerPersonalIdType?.value);
    const isInitialMountRef = useRef(true);

    // Set initial visibility on mount
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            const initialPinType = customerPersonalIdType?.value;

            if (initialPinType === 4) {
                toggleFieldVisible("last_name", false);
                setValue("last_name", null);
                setFieldsState((prevFields) => [...prevFields]);
            }
        }
    }, []);

    useEffect(() => {
        const currentPinType = customerPersonalIdType?.value;
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
    }, [customerPersonalIdType?.value, toggleFieldVisible, setValue]);

    // Set default municipality value when customerMunicipalities loads
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

        const municipalityFromProfile = watch("profile")?.municipality_id;
        const municipalityFromSaved =
            insuredPersonsFormData?.customer?.municipality_id;
        const municipalityIdToUse =
            municipalityFromProfile || municipalityFromSaved;

        if (
            customerMunicipalities?.length > 0 &&
            municipalityIdToUse &&
            !customerMunicipality &&
            profile?.value !== 0
        ) {
            const savedMunicipality = customerMunicipalities.find(
                (m) => m.value === parseInt(municipalityIdToUse),
            );
            if (savedMunicipality) {
                setValue("customer_municipality", savedMunicipality, {
                    shouldValidate: false,
                });
                setCustomerMunicipalityId(savedMunicipality.value);
            }
        }
    }, [
        customerMunicipalities,
        insuredPersonsFormData?.customer?.municipality_id,
        profile?.municipality_id,
        manuallyLocationChanged,
    ]);

    // Set default town value when customerTowns loads
    useEffect(() => {
        if (manuallyLocationChanged) {
            return;
        }

        const townFromProfile = profile?.town_id;
        const townFromSaved = insuredPersonsFormData?.customer?.town_id;
        const townIdToUse = townFromProfile || townFromSaved;

        if (
            customerTowns?.length > 0 &&
            townIdToUse &&
            !customerTown &&
            profile?.value !== 0
        ) {
            const defaultTown = customerTowns.find(
                (town) => town.value === parseInt(townIdToUse),
            );
            if (defaultTown) {
                setValue("customer_town", defaultTown, {
                    shouldValidate: false,
                });
            }
        }
    }, [
        customerTowns,
        insuredPersonsFormData?.customer?.town_id,
        profile?.town_id,
        manuallyLocationChanged,
    ]);

    // Memoize form data to prevent unnecessary updates
    const formData = useMemo(() => {
        const customerData = {
            profile: profile || null,
            personal_identification_number_type:
                customerPersonalIdType?.value || null,
            personal_identification_number: customerPersonalId || "",
            first_name: firstName || "",
            last_name: lastName || "",
            district_id: customerDistrict?.value || null,
            municipality_id: customerMunicipality?.value || null,
            town_id: customerTown?.value || null,
            post_code: customerPostCode || "",
            address: customerAddress || "",
            mobile_phone: customerMobilePhone || "",
            email: customerEmail || "",
        };

        // Merge with existing insuredPersonsFormData, preserving other properties
        return {
            ...insuredPersonsFormData,
            customer: customerData,
        };
    }, [
        customerPersonalIdType,
        customerPersonalId,
        firstName,
        lastName,
        customerDistrict,
        customerMunicipality,
        customerTown,
        customerPostCode,
        customerAddress,
        customerMobilePhone,
        customerEmail,
        insuredPersonsFormData,
    ]);

    // Keep reference to previous form data for comparison
    const prevFormDataRef = useRef();

    // Update form data context only when formData actually changes
    useEffect(() => {
        if (
            !insuredPersonsFormData.customer ||
            (insuredPersonsFormData &&
                JSON.stringify(formData) ===
                    JSON.stringify(insuredPersonsFormData))
        ) {
            setIsFormInitialized(true);
        }

        // Deep comparison helper function
        const isEqual = (obj1, obj2) => {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        };

        if (
            isFormInitialized &&
            (!prevFormDataRef.current ||
                !isEqual(prevFormDataRef.current, formData))
        ) {
            setInsuredPersonsFormData(formData);
            setLastVisitedStep(2.5);
            prevFormDataRef.current = formData;
        }
    }, [
        formData,
        setInsuredPersonsFormData,
        setLastVisitedStep,
        isFormInitialized,
    ]);

    // Update overall form validity - use a custom validity flag for customer step
    useEffect(() => {
        // We'll use isInsuredPersonsValid but only check customer validity here
        setIsInsuredPersonsValid(isValid);
    }, [isValid, setIsInsuredPersonsValid]);

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
            "email",
            "mobile_phone",
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

    return (
        <Form id="travel-insurance-customer-form">
            <BlockStack gap="300">
                <Surface>
                    <Box padding="1000">
                        <BlockStack gap="800">
                            <InlineStack gap="400" blockAlign="center">
                                <Icon icon={IconUser} size="600" />
                                <Text variant="heading-m">
                                    Данни на застраховащото лице
                                </Text>
                            </InlineStack>

                            <BlockStack gap="400">
                                {fields.find((f) => f.key === "profile")
                                    .isVisible &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "profile",
                                        onChangeHandler: (value) => {
                                            const isAddressEmpty =
                                                value.district_id === null &&
                                                value.municipality_id ===
                                                    null &&
                                                value.town_id === null;
                                            setManuallyLocationChanged(false);

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
                                                    )?.selected || null;
                                                setValue(
                                                    "customer_district",
                                                    defaultDistrict,
                                                );
                                                setCustomerDistrictId(
                                                    defaultDistrict?.value,
                                                );

                                                setValue(
                                                    "customer_municipality",
                                                    null,
                                                );
                                                setCustomerMunicipalityId(null);
                                                setValue(
                                                    "customer_address",
                                                    null,
                                                );
                                                setValue("mobile_phone", null);
                                                setValue("email", null);
                                                setValue(
                                                    "latin_full_name",
                                                    null,
                                                );
                                            } else {
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
                                                        ),
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
                                                setManuallyLocationChanged(
                                                    false,
                                                );
                                            }
                                            isAddressEmpty &&
                                                setValue("customer_town", null);
                                            if (value.value === 0) {
                                                setManuallyLocationChanged(
                                                    false,
                                                );
                                            }
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.profile?.message,
                                            "profile",
                                        ),
                                    })}

                                {/* Personal Identification */}
                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName:
                                            "customer_personal_identification_number_type",
                                        fields,
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
                                        error: shouldShowError(
                                            errors
                                                .customer_personal_identification_number_type
                                                ?.message,
                                            "customer_personal_identification_number_type",
                                        ),
                                    })}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "customer_personal_identification_number",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors
                                                .customer_personal_identification_number
                                                ?.message,
                                            "customer_personal_identification_number",
                                        ),
                                    )}
                                </InlineStack>

                                {/* Names */}
                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "first_name",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.first_name?.message,
                                            "first_name",
                                        ),
                                    )}

                                    {fields.find((f) => f.key === "last_name")
                                        ?.isVisible &&
                                        RenderFormFieldsUtils.renderTextField(
                                            "last_name",
                                            fields,
                                            register,
                                            shouldShowError(
                                                errors.last_name?.message,
                                                "last_name",
                                            ),
                                        )}
                                </InlineStack>

                                {/* Location - District and Municipality */}
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
                                            setManuallyLocationChanged(true);
                                            toggleFieldEnabled(
                                                "customer_town",
                                                false,
                                            );
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.customer_district?.message,
                                            "customer_district",
                                        ),
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
                                            setValue("customer_town", null);
                                            setValue("customer_postcode", null);
                                            toggleFieldEnabled(
                                                "customer_town",
                                                true,
                                            );
                                            setCustomerMunicipalityId(
                                                value.value,
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.customer_municipality
                                                ?.message,
                                            "customer_municipality",
                                        ),
                                    })}
                                </InlineStack>

                                {/* Location - Town and Postcode */}
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

                                            trigger("customer_postcode");
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.customer_town?.message,
                                            "customer_town",
                                        ),
                                    })}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "customer_postcode",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.customer_postcode?.message,
                                            "customer_postcode",
                                        ),
                                    )}
                                </InlineStack>

                                {/* Address */}
                                {RenderFormFieldsUtils.renderTextField(
                                    "customer_address",
                                    fields,
                                    register,
                                    shouldShowError(
                                        errors.customer_address?.message,
                                        "customer_address",
                                    ),
                                )}

                                {/* Contact Information */}
                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "email",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.email?.message,
                                            "email",
                                        ),
                                    )}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "mobile_phone",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.mobile_phone?.message,
                                            "mobile_phone",
                                        ),
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

CustomerStepForm.displayName = "CustomerStepForm";

export default CustomerStepForm;
