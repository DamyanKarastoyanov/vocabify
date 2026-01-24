/**
 * External dependencies
 */
import {
    useEffect,
    useMemo,
    useState,
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
import Icon from "@/components/icon/icon";
import IconUser from "@/components/icons/user";
import useGetMunicipalityQuery from "@/pages/non-resident-insurance/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/non-resident-insurance/data/use-get-town-query";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import generateLatinFullName from "@/utils/generate-latin-full-name";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import CustomerValidationSchema from "@/pages/non-resident-insurance/validations/customer-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const createDefaultValues = (insuredPersonsFormData, fields) => {
    if (insuredPersonsFormData?.insurer) {
        const insurer = insuredPersonsFormData?.insurer || {};
        return {
            profile: insurer.profile,
            personal_identification_number_type: fields
                .find((f) => f.key === "personal_identification_number_type")
                ?.values?.find(
                    (v) =>
                        v.value === insurer.personal_identification_number_type,
                ),
            personal_identification_number:
                insurer.personal_identification_number,
            first_name: insurer.first_name,
            last_name: insurer.last_name,
            district: fields
                .find((f) => f.key === "district")
                ?.values?.find(
                    (v) => v.value === parseInt(insurer.district_id),
                ),
            municipality: fields
                .find((f) => f.key === "municipality")
                ?.values?.find(
                    (v) => v.value === parseInt(insurer.municipality_id),
                ),
            town: fields
                .find((f) => f.key === "town")
                ?.values?.find((v) => v.value === parseInt(insurer.town_id)),
            postcode: insurer.post_code,
            address: insurer.address,
            mobile_phone: insurer.mobile_phone,
            email: insurer.email,
            latin_full_name: generateLatinFullName(
                insurer.first_name,
                insurer.last_name,
            ),
            is_mobile_number_available:
                insuredPersonsFormData.isMobileNumberAvailable ?? false,
        };
    }

    const profileField = fields.find((f) => f.key === "profile");
    if (
        profileField.isVisible &&
        profileField.values &&
        profileField.values.length > 0
    ) {
        const firstOption = profileField.values[0];
        return {
            profile: firstOption,
            personal_identification_number_type:
                fields
                    .find(
                        (f) => f.key === "personal_identification_number_type",
                    )
                    .values?.find(
                        (v) =>
                            v.value ===
                            firstOption.personal_identification_number_type,
                    ) || null,
            personal_identification_number:
                firstOption.personal_identification_number,
            first_name: firstOption.first_name,
            last_name: firstOption.last_name,
            district:
                fields
                    .find((f) => f.key === "district")
                    ?.values?.find(
                        (v) => v.value === firstOption.district_id,
                    ) || null,
            postcode: firstOption.postal_code,
            address: firstOption.address,
            mobile_phone: firstOption.mobile_phone,
            email: firstOption.email,
        };
    }

    return fields.reduce((acc, field) => {
        if (field.key && field.values && field.values.length > 0) {
            acc[field.key] = field.selected ? field.selected : undefined;
        }
        // Initialize checkbox fields with false to prevent uncontrolled to controlled warning
        if (field.key === "is_mobile_number_available") {
            acc[field.key] = false;
        }
        if (field.key === "district") {
            acc.district = field.selected || field.values?.[0];
        }
        if (field.key === "municipality") {
            acc.municipality = field.selected || field.values?.[0];
        }
        if (field.key === "profile") {
            acc.profile =
                field.selected ||
                (field.values && field.values.length > 0
                    ? field.values[0]
                    : undefined);
        }
        return acc;
    }, {});
};

const CustomerStepForm = forwardRef((props, ref) => {
    const { non_resident_insurance } = usePage().props;
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
        non_resident_insurance.fields || [],
    );
    const fields = fieldsState;
    const { toggleFieldEnabled, toggleFieldVisible } = useFieldControls(fields);

    const [isFormInitialized, setIsFormInitialized] = useState(false);
    const [manuallyLocationChanged, setManuallyLocationChanged] =
        useState(false);

    const [districtId, setDistrictId] = useState(() => {
        if (insuredPersonsFormData?.insurer?.district_id) {
            const parsedId = parseInt(
                insuredPersonsFormData.insurer.district_id,
            );
            return parsedId;
        }
        return (
            non_resident_insurance.fields.find((f) => f.key === "district")
                ?.selected?.value || null
        );
    });

    const [municipalityId, setMunicipalityId] = useState(() => {
        return insuredPersonsFormData?.insurer?.municipality_id
            ? parseInt(insuredPersonsFormData.insurer.municipality_id)
            : null;
    });

    const {
        data: customerMunicipalities,
        invalidateQuery: invalidateCustomerMunicipalityQuery,
    } = useGetMunicipalityQuery(districtId);

    const {
        data: customerTowns,
        invalidateQuery: invalidateCustomerTownQuery,
    } = useGetTownQuery(municipalityId);

    // Initial data load - trigger queries if we have IDs
    useEffect(() => {
        if (districtId) {
            invalidateCustomerMunicipalityQuery();
        }
    }, [districtId]);

    useEffect(() => {
        if (municipalityId) {
            invalidateCustomerTownQuery();
        }
    }, [municipalityId]);

    const defaultValues = useMemo(
        () => createDefaultValues(insuredPersonsFormData, fields),
        [insuredPersonsFormData, fields],
    );

    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors, isValid, touchedFields },
        clearErrors,
        trigger,
    } = useForm({
        resolver: yupResolver(CustomerValidationSchema),
        mode: "onChange",
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

    // Watch form fields
    const firstName = watch("first_name");
    const lastName = watch("last_name");
    const personalIdType = watch("personal_identification_number_type");
    const customerDistrict = watch("district");
    const customerMunicipality = watch("municipality");
    const customerTown = watch("town");

    // Watch for changes to is_mobile_number_available checkbox
    const isMobileNumberAvailable = watch("is_mobile_number_available");

    // Handle last_name visibility based on personal_identification_number_type
    const prevPinTypeRef = useRef(personalIdType?.value);
    const isInitialMountRef = useRef(true);

    // Set initial visibility on mount
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            const initialPinType = personalIdType?.value;

            if (initialPinType === 4) {
                toggleFieldVisible("last_name", false);
                setValue("last_name", null);
                setFieldsState((prevFields) => [...prevFields]);
            }
        }
    }, []);

    useEffect(() => {
        const currentPinType = personalIdType?.value;
        const prevPinType = prevPinTypeRef.current;

        // Only update if pinType actually changed
        if (currentPinType !== prevPinType) {
            prevPinTypeRef.current = currentPinType;

            if (currentPinType === 4) {
                toggleFieldVisible("last_name", false);
                setValue("last_name", null);
                // Force re-render by updating fieldsState
                setFieldsState((prevFields) => [...prevFields]);
            } else {
                toggleFieldVisible("last_name", true);
                // Force re-render by updating fieldsState
                setFieldsState((prevFields) => [...prevFields]);
            }
        }
    }, [personalIdType?.value, toggleFieldVisible, setValue]);

    // Handle mobile phone field state based on checkbox
    useEffect(() => {
        if (isMobileNumberAvailable) {
            // Clear mobile phone field when checkbox is checked
            setValue("mobile_phone", null, { shouldValidate: true });

            // Disable mobile phone field
            setFieldsState((prevFields) =>
                prevFields.map((field) =>
                    field.key === "mobile_phone"
                        ? { ...field, isEnabled: false }
                        : field,
                ),
            );
        } else {
            // Re-enable mobile phone field when checkbox is unchecked
            setFieldsState((prevFields) =>
                prevFields.map((field) =>
                    field.key === "mobile_phone"
                        ? { ...field, isEnabled: true }
                        : field,
                ),
            );
        }
    }, [isMobileNumberAvailable, setValue]);

    // Set municipality options and value once they're loaded
    useEffect(() => {
        if (customerMunicipalities?.length === 1) {
            setValue("municipality", customerMunicipalities[0], {
                shouldValidate: true,
            });
            setMunicipalityId(customerMunicipalities[0].value);
        }

        if (manuallyLocationChanged) {
            return;
        }

        const municipalityFromProfile = watch("profile")?.municipality_id;
        const municipalityFromSaved =
            insuredPersonsFormData?.insurer?.municipality_id;
        const municipalityIdToUse =
            municipalityFromProfile || municipalityFromSaved;

        if (customerMunicipalities?.length > 0 && municipalityIdToUse) {
            const savedMunicipality = customerMunicipalities.find(
                (m) => m.value === parseInt(municipalityIdToUse),
            );
            if (savedMunicipality) {
                setValue("municipality", savedMunicipality, {
                    shouldValidate: true,
                });
                setMunicipalityId(savedMunicipality.value);
            }
        }
    }, [
        customerMunicipalities,
        insuredPersonsFormData,
        manuallyLocationChanged,
    ]);

    // Set town options and value once they're loaded
    useEffect(() => {
        if (manuallyLocationChanged) {
            return;
        }

        const townFromProfile = watch("profile")?.town_id;
        const townFromSaved = insuredPersonsFormData?.insurer?.town_id;
        const townIdToUse = townFromProfile || townFromSaved;

        if (customerTowns?.length > 0 && townIdToUse) {
            const savedTown = customerTowns.find(
                (t) => t.value === parseInt(townIdToUse),
            );
            if (savedTown) {
                setValue("town", savedTown, { shouldValidate: true });
            }
        }
    }, [customerTowns, insuredPersonsFormData, manuallyLocationChanged]);

    // Auto-generate latin full name
    useEffect(() => {
        if (personalIdType?.value === 4) {
            // When ID type is 4, use only first name
            if (firstName) {
                setValue(
                    "latin_full_name",
                    generateLatinFullName(firstName, "").trim(),
                );
            }
        } else {
            // For other ID types, use both first and last name
            if (firstName && lastName) {
                setValue(
                    "latin_full_name",
                    generateLatinFullName(firstName, lastName),
                );
            }
        }
    }, [firstName, lastName, personalIdType?.value, setValue]);

    // Handle initial profile auto-selection
    useEffect(() => {
        const profileField = fields.find((f) => f.key === "profile");
        if (
            profileField &&
            profileField.values &&
            profileField.values.length > 0 &&
            !profileField.selected &&
            !insuredPersonsFormData
        ) {
            const firstOption = profileField.values[0];
            const isAddressEmpty =
                firstOption.district_id === null &&
                firstOption.municipality_id === null &&
                firstOption.town_id === null;
            if (firstOption && firstOption.value !== 0) {
                setValue(
                    "personal_identification_number_type",
                    fields
                        .find(
                            (f) =>
                                f.key === "personal_identification_number_type",
                        )
                        ?.values?.find(
                            (v) =>
                                v.value ===
                                firstOption.personal_identification_number_type,
                        ),
                );
                setValue(
                    "personal_identification_number",
                    firstOption.personal_identification_number,
                );
                setValue("first_name", firstOption.first_name);
                // Only set last_name if pinType is not 4 (pinType 4 hides last_name field)
                if (firstOption.personal_identification_number_type !== 4) {
                    setValue("last_name", firstOption.last_name);
                } else {
                    setValue("last_name", null);
                }
                const currentDistrict = isAddressEmpty
                    ? fields.find((f) => f.key === "district")?.selected
                    : fields
                          .find((f) => f.key === "district")
                          ?.values?.find(
                              (v) => v.value === firstOption.district_id,
                          ) || null;
                setValue("district", currentDistrict);
                setDistrictId(currentDistrict?.value);

                const currentMunicipality = isAddressEmpty
                    ? fields.find((f) => f.key === "municipality")?.selected
                    : fields
                          .find((f) => f.key === "municipality")
                          ?.values?.find(
                              (v) => v.value === firstOption.municipality_id,
                          ) || null;
                setValue("municipality", currentMunicipality);
                setMunicipalityId(currentMunicipality?.value);

                if (!isAddressEmpty) {
                    const currentTown = fields
                        .find((f) => f.key === "town")
                        ?.values?.find((v) => v.value === firstOption.town_id);
                    setValue("town", currentTown);
                } else {
                    setValue("town", null);
                }
                setValue("postcode", firstOption.postal_code);
                setValue("address", firstOption.address);
                setValue("mobile_phone", firstOption.mobile_phone);
                setValue("email", firstOption.email);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields, setValue, insuredPersonsFormData]);

    // Keep customerDistrictId and customerMunicipalityId in sync for queries
    useEffect(() => {
        if (customerDistrict?.value && customerDistrict.value !== districtId) {
            setDistrictId(customerDistrict.value);
        }
        if (
            customerMunicipality?.value &&
            customerMunicipality.value !== municipalityId
        ) {
            setMunicipalityId(customerMunicipality.value);
        }
    }, [customerDistrict, customerMunicipality, districtId, municipalityId]);

    // Memoize form data to prevent unnecessary updates
    const formData = useMemo(() => {
        const profile = watch("profile");
        const customerPersonalIdentificationNumberType = watch(
            "personal_identification_number_type",
        );
        const customerPersonalIdentificationNumber = watch(
            "personal_identification_number",
        );
        const firstName = watch("first_name");
        const lastName = watch("last_name");
        const customerDistrict = watch("district");
        const customerMunicipality = watch("municipality");
        const customerTown = watch("town");
        const customerPostcode = watch("postcode");
        const customerAddress = watch("address");
        const mobilePhone = watch("mobile_phone");
        const email = watch("email");
        const latinFullName = watch("latin_full_name");
        const isMobileNumberAvailable = watch("is_mobile_number_available");

        const insurer = {
            profile: profile,
            personal_identification_number_type:
                customerPersonalIdentificationNumberType?.value || null,
            personal_identification_number:
                customerPersonalIdentificationNumber || "",
            first_name: firstName || "",
            last_name: lastName || "",
            district_id: customerDistrict?.value || null,
            municipality_id: customerMunicipality?.value || null,
            town_id: customerTown?.value || null,
            post_code: customerPostcode || "",
            address: customerAddress || "",
            mobile_phone: mobilePhone,
            email: email || "",
            latin_full_name: latinFullName || "",
        };

        // Merge with existing insuredPersonsFormData, preserving other properties
        return {
            ...insuredPersonsFormData,
            insurer,
            isMobileNumberAvailable,
        };
    }, [
        watch("personal_identification_number_type"),
        watch("personal_identification_number"),
        watch("first_name"),
        watch("last_name"),
        watch("district"),
        watch("municipality"),
        watch("town"),
        watch("postcode"),
        watch("address"),
        watch("mobile_phone"),
        watch("email"),
        watch("is_mobile_number_available"),
        watch("latin_full_name"),
        insuredPersonsFormData,
    ]);

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

    // Update overall form validity
    useEffect(() => {
        setIsInsuredPersonsValid(isValid);
    }, [isValid, setIsInsuredPersonsValid]);

    // Function to trigger validation errors on all form fields
    const triggerErrors = async () => {
        // Define all customer form fields that need validation
        const allFields = [
            "personal_identification_number_type",
            "personal_identification_number",
            "first_name",
            "last_name",
            "district",
            "municipality",
            "town",
            "postcode",
            "address",
            "email",
            "mobile_phone",
            "latin_full_name",
        ];

        // Set all fields as touched to force error display
        allFields.forEach((fieldName) => {
            setValue(fieldName, watch(fieldName), {
                shouldValidate: true,
                shouldTouch: true,
            });
        });

        // Trigger validation
        await trigger();
    };

    const triggerErrorsWithoutShowingErrors = async () => {
        // Define all customer form fields that need validation
        const allFields = [
            "personal_identification_number_type",
            "personal_identification_number",
            "first_name",
            "last_name",
            "district",
            "municipality",
            "town",
            "postcode",
            "address",
            "email",
            "mobile_phone",
            "latin_full_name",
        ];

        // Set all fields as touched to force error display
        allFields.forEach((fieldName) => {
            setValue(fieldName, watch(fieldName), {
                shouldValidate: true,
                shouldTouch: false,
            });
        });

        // Trigger validation
        await trigger();
    };

    // Trigger silent validation after defaults to refresh isValid without showing errors
    /* useEffect(() => {
         if (isFormInitialized) {
             triggerErrorsWithoutShowingErrors();
         }
     }, [isFormInitialized, trigger]);*/

    // Expose form functions to parent component
    useImperativeHandle(ref, () => ({
        triggerErrors,
    }));

    return (
        <Form id="non-resident-insurance-customer-form">
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

                            <BlockStack gap="300">
                                {fields.find((f) => f.key === "profile") &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "profile",
                                        onChangeHandler: (value) => {
                                            setManuallyLocationChanged(false);
                                            if (value.value === 0) {
                                                const defaultDistrict =
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "district",
                                                    )?.selected || null;

                                                setValue(
                                                    "personal_identification_number_type",
                                                    null,
                                                );
                                                setValue(
                                                    "personal_identification_number",
                                                    null,
                                                );
                                                setValue("first_name", null);
                                                setValue("last_name", null);
                                                setValue(
                                                    "district",
                                                    defaultDistrict,
                                                );
                                                setValue("municipality", null);
                                                setMunicipalityId(null);
                                                setValue("town", null);
                                                setValue("postcode", null);
                                                setValue("address", null);
                                                setValue("mobile_phone", null);
                                                setValue("email", null);
                                                toggleFieldEnabled(
                                                    "town",
                                                    true,
                                                );
                                            } else {
                                                setDistrictId(
                                                    value.district_id,
                                                );
                                                setMunicipalityId(
                                                    value.municipality_id,
                                                );
                                                setValue(
                                                    "personal_identification_number_type",
                                                    fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "personal_identification_number_type",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.personal_identification_number_type,
                                                        ),
                                                );
                                                setValue(
                                                    "personal_identification_number",
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
                                                setValue(
                                                    "district",
                                                    fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "district",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.district_id,
                                                        ),
                                                );
                                                if (value.town_id) {
                                                    toggleFieldEnabled(
                                                        "town",
                                                        true,
                                                    );
                                                }
                                                setValue(
                                                    "postcode",
                                                    value.postal_code,
                                                );
                                                setValue(
                                                    "address",
                                                    value.address,
                                                );
                                                setValue(
                                                    "mobile_phone",
                                                    value.mobile_phone,
                                                );
                                                setValue("email", value.email);

                                                triggerErrorsWithoutShowingErrors();
                                                setManuallyLocationChanged(
                                                    false,
                                                );
                                            }
                                            toggleFieldEnabled(
                                                "customer_town",
                                                true,
                                            );
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.profile?.message,
                                            "profile",
                                        ),
                                    })}

                                <InlineStack
                                    gap="600"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName:
                                            "personal_identification_number_type",
                                        fields: fields,
                                        control,
                                        onChangeHandler: (value) => {
                                            const personalIdType = watch(
                                                "personal_identification_number_type",
                                            );

                                            if (
                                                personalIdType?.value !=
                                                value?.value
                                            ) {
                                                setValue(
                                                    "personal_identification_number",
                                                    null,
                                                );
                                                clearErrors(
                                                    "personal_identification_number",
                                                );
                                            }
                                        },
                                        error: shouldShowError(
                                            errors
                                                .personal_identification_number_type
                                                ?.message,
                                            "personal_identification_number_type",
                                        ),
                                    })}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "personal_identification_number",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors
                                                .personal_identification_number
                                                ?.message,
                                            "personal_identification_number",
                                        ),
                                    )}
                                </InlineStack>

                                <InlineStack
                                    gap="600"
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

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "district",
                                        onChangeHandler: (value) => {
                                            setDistrictId(value.value);
                                            setValue("municipality", null);
                                            setValue("town", null);
                                            setValue("postcode", null);
                                            toggleFieldEnabled("town", false);
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.district?.message,
                                            "district",
                                        ),
                                    })}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "municipality",
                                        onRenderHandler: (field) => {
                                            field.values =
                                                customerMunicipalities?.length >
                                                0
                                                    ? customerMunicipalities
                                                    : [];
                                            return field;
                                        },
                                        onChangeHandler: (value) => {
                                            setValue("town", null);
                                            setMunicipalityId(value.value);
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.municipality?.message,
                                            "municipality",
                                        ),
                                    })}
                                </InlineStack>

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "town",
                                        onRenderHandler: (field) => {
                                            field.values =
                                                customerTowns?.length > 0
                                                    ? customerTowns
                                                    : [];
                                            return field;
                                        },
                                        onChangeHandler: (value) => {
                                            setValue(
                                                "postcode",
                                                value.postcode,
                                                {
                                                    shouldValidate: true,
                                                },
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields: fields,
                                        control,
                                        error: shouldShowError(
                                            errors.town?.message,
                                            "town",
                                        ),
                                    })}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "postcode",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.postcode?.message,
                                            "postcode",
                                        ),
                                    )}
                                </InlineStack>

                                {RenderFormFieldsUtils.renderTextField(
                                    "address",
                                    fields,
                                    register,
                                    shouldShowError(
                                        errors.address?.message,
                                        "address",
                                    ),
                                )}

                                <InlineStack
                                    gap="600"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "latin_full_name",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.latin_full_name?.message,
                                            "latin_full_name",
                                        ),
                                    )}

                                    {RenderFormFieldsUtils.renderTextField(
                                        "email",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.email?.message,
                                            "email",
                                        ),
                                    )}
                                </InlineStack>

                                <InlineStack
                                    gap="600"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "mobile_phone",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.mobile_phone?.message,
                                            "mobile_phone",
                                        ),
                                    )}

                                    {RenderFormFieldsUtils.renderCheckboxField(
                                        "is_mobile_number_available",
                                        fields,
                                        control,
                                        watch("is_mobile_number_available") ??
                                            false,
                                        (checked) =>
                                            setValue(
                                                "is_mobile_number_available",
                                                checked,
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
