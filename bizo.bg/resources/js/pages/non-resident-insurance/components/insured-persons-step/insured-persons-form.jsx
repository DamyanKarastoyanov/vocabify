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
import classNames from "classnames";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import Form from "@/components/form/form";
import Text from "@/components/text/text";
import InlineStack from "@/components/inline-stack/inline-stack";
import useGetMunicipalityQuery from "@/pages/non-resident-insurance/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/non-resident-insurance/data/use-get-town-query";
import Surface from "@/components/surface/surface";
import Box from "@/components/box/box";
import Icon from "@/components/icon/icon";
import IconCaretDown from "@/components/icons/caret-down";
import IconCaretUp from "@/components/icons/caret-up";
import IconUser from "@/components/icons/user";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import generateLatinFullName from "@/utils/generate-latin-full-name";
import { useFormDataContext } from "@/pages/non-resident-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/non-resident-insurance/contexts/validity-context";
import InsuredPersonsValidationSchema from "@/pages/non-resident-insurance/validations/insured-persons-validation-schema";
import BasicInsuredPersonValidationSchema from "@/pages/non-resident-insurance/validations/basic-insured-person-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const InsuredPersonsForm = forwardRef(
    ({ onAllSectionsCompleted, onExpandedSectionChange }, ref) => {
        const { non_resident_insurance } = usePage().props;
        const {
            calculatePriceFormData,
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

        const [isFormInitialized, setIsFormInitialized] = useState(false);

        const [fieldsState, setFieldsState] = useState(
            non_resident_insurance.fields || [],
        );
        const fields = fieldsState;
        const { toggleFieldEnabled, toggleFieldVisible } =
            useFieldControls(fields);

        // Get number of insured persons from calculatePriceFormData
        const numberOfInsuredPersons =
            calculatePriceFormData?.customer_groups?.[0]?.count || 1;

        // State for tracking the active section's district/municipality
        const [activeDistrictId, setActiveDistrictId] = useState(() => {
            // Initialize with first section's district
            const currentSection =
                insuredPersonsFormData?.currentExpandedSection;
            if (
                typeof currentSection !== undefined &&
                insuredPersonsFormData?.insuredPersons[currentSection]?.district
            ) {
                return parseInt(
                    insuredPersonsFormData.insuredPersons[
                        insuredPersonsFormData.currentExpandedSection
                    ].district,
                );
            }
            return (
                non_resident_insurance.fields.find((f) => f.key === "district")
                    ?.selected?.value || null
            );
        });

        const [activeMunicipalityId, setActiveMunicipalityId] = useState(() => {
            // Initialize with first section's municipality
            const currentSection =
                insuredPersonsFormData?.currentExpandedSection;
            if (
                typeof currentSection !== undefined &&
                insuredPersonsFormData?.insuredPersons[currentSection]
                    ?.municipality
            ) {
                return parseInt(
                    insuredPersonsFormData.insuredPersons[
                        insuredPersonsFormData.currentExpandedSection
                    ].municipality,
                );
            }
            return null;
        });

        const {
            data: customerMunicipalities,
            invalidateQuery: invalidateCustomerMunicipalityQuery,
        } = useGetMunicipalityQuery(activeDistrictId);

        const {
            data: customerTowns,
            invalidateQuery: invalidateCustomerTownQuery,
        } = useGetTownQuery(activeMunicipalityId);

        // The active section uses the same queries as the legacy approach
        // This means all sections share the same municipality/town data based on the currently active section

        // State for insurer also customer checkbox (only for first person)
        const [isInsurerAlsoACustomer, setIsInsurerAlsoACustomer] = useState(
            insuredPersonsFormData?.isInsurerAlsoACustomer ?? true,
        );

        // State to suppress validation errors during schema transition
        const [suppressValidationErrors, setSuppressValidationErrors] =
            useState(false);

        // State for managing sections - restore from saved data or default to first section
        const [expandedSection, setExpandedSection] = useState(() => {
            // If we have saved form data with a current expanded section, restore it
            if (
                typeof insuredPersonsFormData?.currentExpandedSection ===
                "number"
            ) {
                const idx = insuredPersonsFormData.currentExpandedSection;
                // Normalize invalid values (-1 or out of range) to 0
                if (idx < 0 || idx >= numberOfInsuredPersons) {
                    return 0;
                }
                return idx;
            }
            // Default to first section if no saved state
            return 0;
        });
        const [sectionData, setSectionData] = useState([]);
        const sectionRefs = useRef([]);

        // Flag to track if we're in restoration mode
        const isRestoringFromSavedData = useRef(
            insuredPersonsFormData?.currentExpandedSection !== undefined,
        );

        // Flag to track if we're completing the final section to avoid race condition
        const isCompletingFinalSection = useRef(false);

        // Validate and adjust expanded section if needed (but not during restoration)
        useEffect(() => {
            // Skip all validation if we're restoring from saved data
            if (isRestoringFromSavedData.current) {
                isRestoringFromSavedData.current = false; // Only skip once
                return;
            }

            // If expanded section is greater than available sections, reset to first section
            if (expandedSection >= numberOfInsuredPersons) {
                setExpandedSection(0);
            }
        }, [expandedSection, numberOfInsuredPersons]);

        // Sync expanded section when context updates it externally
        useEffect(() => {
            const externalIndex =
                insuredPersonsFormData?.currentExpandedSection;
            if (
                typeof externalIndex === "number" &&
                externalIndex !== expandedSection
            ) {
                // Normalize external index
                const normalizedIndex =
                    externalIndex < 0 || externalIndex >= numberOfInsuredPersons
                        ? 0
                        : externalIndex;
                setExpandedSection(normalizedIndex);
                updateActiveDistrictMunicipality(normalizedIndex);
            }
        }, [
            insuredPersonsFormData?.currentExpandedSection,
            numberOfInsuredPersons,
        ]);

        // Initial data load - trigger queries if we have IDs
        useEffect(() => {
            if (activeDistrictId) {
                invalidateCustomerMunicipalityQuery();
            }
        }, [activeDistrictId]);

        useEffect(() => {
            if (activeMunicipalityId) {
                invalidateCustomerTownQuery();
            }
        }, [activeMunicipalityId]);

        // Create individual form hook for each section
        const createFormInstance = useCallback(
            (sectionIndex) => {
                const defaultValues = useMemo(() => {
                    if (
                        sectionIndex === 0 &&
                        (typeof insuredPersonsFormData?.isInsurerAlsoACustomer ==
                            "undefined" ||
                            insuredPersonsFormData?.isInsurerAlsoACustomer)
                    ) {
                        const insurer = insuredPersonsFormData?.insurer;

                        if (insuredPersonsFormData?.insurer) {
                            return {
                                profile:
                                    insuredPersonsFormData?.insurer?.profile ||
                                    null,
                                personal_identification_number_type:
                                    fields
                                        .find(
                                            (f) =>
                                                f.key ===
                                                "personal_identification_number_type",
                                        )
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                insurer.personal_identification_number_type,
                                        ) || null,
                                personal_identification_number:
                                    insurer.personal_identification_number ||
                                    null,
                                first_name: insurer.first_name || null,
                                last_name: insurer.last_name || null,
                                district:
                                    fields
                                        .find((f) => f.key === "district")
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                parseInt(insurer.district_id),
                                        ) || null,
                                postcode: insurer.post_code || null,
                                address: insurer.address || null,
                                mobile_phone: insurer.mobile_phone || null,
                                email: insurer.email || null,
                                latin_full_name:
                                    generateLatinFullName(
                                        insurer.first_name,
                                        insurer.last_name,
                                    ) || null,
                                birth_date: (() => {
                                    const firstPerson =
                                        insuredPersonsFormData
                                            ?.insuredPersons?.[0];
                                    if (firstPerson?.birth_date) {
                                        const date = new Date(
                                            firstPerson.birth_date,
                                        );
                                        if (!isNaN(date.getTime())) {
                                            // Return the date as-is to avoid timezone conversion issues
                                            return date;
                                        }
                                    }
                                    if (
                                        fields.find(
                                            (f) => f.key === "birth_date",
                                        )?.selected
                                    ) {
                                        const date = new Date(
                                            fields.find(
                                                (f) => f.key === "birth_date",
                                            )?.selected,
                                        );
                                        if (!isNaN(date.getTime())) {
                                            // Return the date as-is to avoid timezone conversion issues
                                            return date;
                                        }
                                    }
                                    return null;
                                })(),
                                // Initialize municipality and town as raw IDs on init
                                municipality:
                                    insuredPersonsFormData?.currentExpandedSection !==
                                        0 && insurer.municipality_id
                                        ? parseInt(insurer.municipality_id)
                                        : null,
                                town:
                                    insuredPersonsFormData?.currentExpandedSection !==
                                        0 && insurer.town_id
                                        ? parseInt(insurer.town_id)
                                        : null,
                                country:
                                    fields
                                        .find((f) => f.key === "country")
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                insuredPersonsFormData
                                                    .insuredPersons?.[0]
                                                    ?.country,
                                        ) || null,
                                is_mobile_number_available:
                                    insuredPersonsFormData.isMobileNumberAvailable ??
                                    false,
                            };
                        }

                        const profileField = fields.find(
                            (f) => f.key === "profile",
                        );
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
                            if (firstOption?.value !== 0) {
                                if (!isAddressEmpty) {
                                    setActiveDistrictId(
                                        firstOption.district_id,
                                    );
                                    setActiveMunicipalityId(
                                        firstOption.municipality_id,
                                    );
                                } else {
                                    const defaultDistrictId = fields.find(
                                        (f) => f.key === "district",
                                    )?.selected?.value;
                                    setActiveDistrictId(defaultDistrictId);
                                    setActiveMunicipalityId(null);
                                }
                                return {
                                    profile: fields.find(
                                        (f) => f.key === "profile",
                                    )?.values?.[0],
                                    personal_identification_number_type:
                                        fields
                                            .find(
                                                (f) =>
                                                    f.key ===
                                                    "personal_identification_number_type",
                                            )
                                            ?.values?.find(
                                                (v) =>
                                                    v.value ===
                                                    firstOption.personal_identification_number_type,
                                            ) || null,
                                    personal_identification_number:
                                        firstOption.personal_identification_number,
                                    first_name: firstOption.first_name,
                                    last_name: firstOption.last_name,
                                    district: isAddressEmpty
                                        ? fields.find(
                                              (f) => f.key === "district",
                                          )?.selected
                                        : fields
                                              .find((f) => f.key === "district")
                                              ?.values?.find(
                                                  (v) =>
                                                      v.value ===
                                                      firstOption.district_id,
                                              ) || null,
                                    municipality: isAddressEmpty
                                        ? fields.find(
                                              (f) => f.key === "municipality",
                                          )?.selected
                                        : fields
                                              .find(
                                                  (f) =>
                                                      f.key === "municipality",
                                              )
                                              ?.values?.find(
                                                  (v) =>
                                                      v.value ===
                                                      firstOption.municipality_id,
                                              ) || null,
                                    town: !isAddressEmpty
                                        ? fields
                                              .find((f) => f.key === "town")
                                              ?.values?.find(
                                                  (v) =>
                                                      v.value ===
                                                      firstOption.town_id,
                                              )
                                        : null,
                                    postcode: firstOption.postal_code || null,
                                    address: firstOption.address || null,
                                    mobile_phone:
                                        firstOption.mobile_phone || null,
                                    email: firstOption.email || null,
                                    latin_full_name:
                                        generateLatinFullName(
                                            firstOption.first_name,
                                            firstOption.last_name,
                                        ) || null,
                                    birth_date: (() => {
                                        if (firstOption.birth_date) {
                                            const date = new Date(
                                                firstOption.birth_date,
                                            );
                                            if (!isNaN(date.getTime())) {
                                                // Return the date as-is to avoid timezone conversion issues
                                                return date;
                                            }
                                        }
                                        if (
                                            fields.find(
                                                (f) => f.key === "birth_date",
                                            )?.selected
                                        ) {
                                            const date = new Date(
                                                fields.find(
                                                    (f) =>
                                                        f.key === "birth_date",
                                                )?.selected,
                                            );
                                            if (!isNaN(date.getTime())) {
                                                // Return the date as-is to avoid timezone conversion issues
                                                return date;
                                            }
                                        }
                                        return null;
                                    })(),
                                    country:
                                        fields
                                            .find((f) => f.key === "country")
                                            ?.values?.find(
                                                (v) =>
                                                    v.value ===
                                                    firstOption.country_id,
                                            ) || null,
                                    is_mobile_number_available: false,
                                };
                            }
                        }

                        return fields.reduce((acc, field) => {
                            if (
                                field.key &&
                                field.values &&
                                field.values.length > 0
                            ) {
                                acc[field.key] = field.selected
                                    ? field.selected
                                    : undefined;
                            }
                            if (field.key === "profile") {
                                acc.profile =
                                    field.selected ||
                                    (field.values && field.values.length > 0
                                        ? field.values[0]
                                        : undefined);
                            }
                            if (field.key === "district") {
                                acc.district =
                                    field.selected || field.values?.[0];
                            }
                            if (field.key === "municipality") {
                                acc.municipality =
                                    field.selected || field.values?.[0];
                            }
                            if (field.key === "birth_date") {
                                const birthDateValue = field.selected;
                                if (birthDateValue) {
                                    const date = new Date(birthDateValue);
                                    if (!isNaN(date.getTime())) {
                                        // Return the date as-is to avoid timezone conversion issues
                                        acc[field.key] = date;
                                    } else {
                                        acc[field.key] = null;
                                    }
                                } else {
                                    acc[field.key] = null;
                                }
                            }
                            // Initialize checkbox fields with false to prevent uncontrolled to controlled warning
                            if (field.key === "is_mobile_number_available") {
                                acc[field.key] = false;
                            }
                            return acc;
                        }, {});
                    }

                    const savedData =
                        insuredPersonsFormData?.insuredPersons?.[sectionIndex];
                    if (savedData) {
                        // For other sections or first section without customer data
                        return {
                            persons: savedData.persons || null,
                            personal_identification_number_type:
                                fields
                                    .find(
                                        (f) =>
                                            f.key ===
                                            "personal_identification_number_type",
                                    )
                                    ?.values?.find(
                                        (v) => v.value === savedData.pinType,
                                    ) || null,
                            personal_identification_number: savedData.pin || "",
                            first_name: savedData.firstName || "",
                            last_name: savedData.lastName || "",
                            latin_full_name: savedData.latinFullName || "",
                            birth_date: (() => {
                                if (savedData.birth_date) {
                                    const date = new Date(savedData.birth_date);
                                    if (!isNaN(date.getTime())) {
                                        // Return the date as-is to avoid timezone conversion issues
                                        return date;
                                    }
                                }
                                if (
                                    fields.find((f) => f.key === "birth_date")
                                        ?.selected
                                ) {
                                    const date = new Date(
                                        fields.find(
                                            (f) => f.key === "birth_date",
                                        )?.selected,
                                    );
                                    if (!isNaN(date.getTime())) {
                                        // Return the date as-is to avoid timezone conversion issues
                                        return date;
                                    }
                                }
                                return null;
                            })(),
                            district:
                                fields
                                    .find((f) => f.key === "district")
                                    ?.values?.find(
                                        (v) => v.value === savedData.district,
                                    ) || null,
                            // Initialize municipality and town as raw IDs on init
                            municipality:
                                insuredPersonsFormData?.currentExpandedSection !==
                                sectionIndex
                                    ? savedData.municipality || null
                                    : null,
                            town:
                                insuredPersonsFormData?.currentExpandedSection !==
                                sectionIndex
                                    ? savedData.town || null
                                    : null,
                            country:
                                fields
                                    .find((f) => f.key === "country")
                                    ?.values?.find(
                                        (v) => v.value === savedData.country,
                                    ) || null,
                            address: savedData.address || "",
                            postcode: savedData.postcode || "",
                            mobile_phone: savedData.mobilePhone || "",
                            is_mobile_number_available: Boolean(
                                savedData.isMobileNumberAvailable,
                            ),
                        };
                    }
                    return {
                        personal_identification_number_type:
                            fields.find(
                                (f) =>
                                    f.key ===
                                    "personal_identification_number_type",
                            )?.selected || null,
                        personal_identification_number: "",
                        first_name: "",
                        last_name: "",
                        latin_full_name: "",
                        birth_date: (() => {
                            const birthDateField = fields.find(
                                (f) => f.key === "birth_date",
                            );
                            if (birthDateField?.selected) {
                                const date = new Date(birthDateField.selected);
                                if (!isNaN(date.getTime())) {
                                    // Return the date as-is to avoid timezone conversion issues
                                    return date;
                                }
                            }
                            return null;
                        })(),
                        district:
                            fields.find((f) => f.key === "district")
                                ?.selected || null,
                        municipality:
                            fields.find((f) => f.key === "municipality")
                                ?.selected || null,
                        town: null,
                        country:
                            fields.find((f) => f.key === "country")?.selected ||
                            null,
                        address: "",
                        postcode: "",
                        mobile_phone: "",
                        is_mobile_number_available: false,
                    };
                }, [sectionIndex, insuredPersonsFormData, fields]);

                const isFirstPerson = sectionIndex === 0;
                const validationSchema =
                    isFirstPerson && isInsurerAlsoACustomer
                        ? InsuredPersonsValidationSchema
                        : BasicInsuredPersonValidationSchema;

                return useForm({
                    resolver: yupResolver(validationSchema),
                    mode: "onTouched", // Only validate after user has interacted with fields
                    reValidateMode: "onChange", // Re-validate on change after first interaction
                    defaultValues,
                });
            },
            [insuredPersonsFormData, fields, isInsurerAlsoACustomer],
        );

        // Handle section expansion
        const handleSectionToggle = (sectionIndex) => {
            // Allow clicking on any section - no restrictions
            const newExpandedSection =
                expandedSection === sectionIndex ? -1 : sectionIndex;

            // Update active district/municipality when switching sections
            if (
                newExpandedSection !== -1 &&
                newExpandedSection !== expandedSection
            ) {
                updateActiveDistrictMunicipality(newExpandedSection);
            }

            // Reset form initialization flag when changing sections to prevent immediate saving
            setIsFormInitialized(false);
            setExpandedSection(newExpandedSection);
        };

        // Function to update active district/municipality based on section data
        const updateActiveDistrictMunicipality = (sectionIndex) => {
            const sectionFormData = sectionData[sectionIndex]?.data;

            if (sectionIndex === 0 && isInsurerAlsoACustomer) {
                // For first section when insurer is also customer, use insurer data
                const insurerDistrictId =
                    insuredPersonsFormData?.insurer?.district_id;
                const insurerMunicipalityId =
                    insuredPersonsFormData?.insurer?.municipality_id;

                if (insurerDistrictId) {
                    setActiveDistrictId(parseInt(insurerDistrictId));
                }
                if (insurerMunicipalityId) {
                    setActiveMunicipalityId(parseInt(insurerMunicipalityId));
                }
            } else if (sectionFormData) {
                // For other sections, use section form data
                if (sectionFormData.district) {
                    setActiveDistrictId(sectionFormData.district);
                    // Invalidate municipality query to refresh data
                }
                if (sectionFormData.municipality) {
                    setActiveMunicipalityId(
                        parseInt(sectionFormData.municipality),
                    );
                    // Invalidate town query to refresh data
                } else {
                    // Reset municipality if section doesn't have one
                    setActiveMunicipalityId(null);
                }
            } else {
                // Reset to default if no section data
                const defaultDistrictId =
                    non_resident_insurance.fields.find(
                        (f) => f.key === "district",
                    )?.selected?.value || null;
                setActiveDistrictId(defaultDistrictId);
                setActiveMunicipalityId(null);
                // Invalidate queries to refresh with new data
            }
        };

        // Handler for insurance checkbox change (first person only)
        const handleInsuranceCheckboxChange = useCallback(
            (checked, formMethods) => {
                // Suppress validation errors during transition
                setSuppressValidationErrors(true);
                setIsInsurerAlsoACustomer(checked);
                const { setValue, reset, getValues } = formMethods;

                const syncLocationFrom = (source) => {
                    const toNumber = (value) =>
                        value !== undefined && value !== null && value !== ""
                            ? parseInt(value, 10)
                            : null;

                    const districtId = toNumber(
                        source?.district_id ?? source?.district,
                    );
                    const municipalityId = toNumber(
                        source?.municipality_id ?? source?.municipality,
                    );

                    const districtOption = fields
                        .find((f) => f.key === "district")
                        ?.values?.find((v) => v.value === districtId);

                    setValue("district", districtOption || null);
                    setActiveDistrictId(districtId);
                    setActiveMunicipalityId(municipalityId);
                };

                if (!checked) {
                    const personsField = fields.find(
                        (f) => f.key === "persons",
                    );

                    // Only proceed if persons field exists and is visible
                    if (
                        personsField?.isVisible &&
                        personsField?.values &&
                        personsField.values.length > 0
                    ) {
                        const firstPerson = personsField.values[0];
                        setValue("profile", null, { shouldValidate: false });
                        setValue("persons", firstPerson, {
                            shouldValidate: false,
                            shouldTouch: false,
                        });

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
                                        firstPerson.personal_identification_number_type,
                                ) || null,
                        );
                        setValue(
                            "personal_identification_number",
                            firstPerson.personal_identification_number,
                        );
                        setValue("first_name", firstPerson.first_name);
                        // Only set last_name if pinType is not 4 (pinType 4 hides last_name field)
                        if (
                            firstPerson.personal_identification_number_type !==
                            4
                        ) {
                            setValue("last_name", firstPerson.last_name);
                        } else {
                            setValue("last_name", null);
                        }
                        setValue(
                            "latin_full_name",
                            firstPerson.latin_full_name,
                        );
                        syncLocationFrom(firstPerson);
                        setValue("postcode", firstPerson.postcode);
                        setValue("address", firstPerson.address);
                        setValue("mobile_phone", firstPerson.mobile_phone);
                        setValue("email", firstPerson.email);
                        setValue(
                            "is_mobile_number_available",
                            firstPerson.is_mobile_number_available,
                        );
                        setValue(
                            "country",
                            fields
                                .find((f) => f.key === "country")
                                ?.values?.find(
                                    (v) => v.value === firstPerson.country_id,
                                ) || null,
                        );
                    } else {
                        const currentValues = getValues();
                        setTimeout(() => {
                            reset(currentValues, {
                                keepErrors: false,
                                keepDirty: false,
                            });
                        }, 50);
                    }
                    if (insuredPersonsFormData) {
                        setInsuredPersonsFormData({
                            ...insuredPersonsFormData,
                            insurer: null,
                            isInsurerAlsoACustomer: false,
                        });
                    }
                } else {
                    const profileField = fields.find(
                        (f) => f.key === "profile",
                    );
                    if (
                        profileField?.isVisible &&
                        profileField?.values &&
                        profileField.values.length > 0
                    ) {
                        const firstOption = profileField.values[0];
                        setValue("profile", firstOption, {
                            shouldValidate: false,
                            shouldTouch: false,
                        });

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
                                        firstOption.personal_identification_number_type,
                                ) || null,
                        );
                        setValue(
                            "personal_identification_number",
                            firstOption.personal_identification_number,
                        );
                        setValue("first_name", firstOption.first_name || null);
                        // Only set last_name if pinType is not 4 (pinType 4 hides last_name field)
                        if (
                            firstOption.personal_identification_number_type !==
                            4
                        ) {
                            setValue(
                                "last_name",
                                firstOption.last_name || null,
                            );
                        } else {
                            setValue("last_name", null);
                        }
                        setValue(
                            "latin_full_name",
                            firstOption.latin_full_name || null,
                        );
                        syncLocationFrom(firstOption);
                        setValue("postcode", firstOption.postal_code || null);
                        setValue("address", firstOption.address || null);
                        setValue(
                            "mobile_phone",
                            firstOption.mobile_phone || null,
                        );
                        setValue("email", firstOption.email || null);
                        setValue(
                            "is_mobile_number_available",
                            firstOption.is_mobile_number_available,
                        );
                        setValue(
                            "country",
                            fields
                                .find((f) => f.key === "country")
                                ?.values?.find(
                                    (v) => v.value === firstOption.country_id,
                                ) || null,
                        );
                    }
                    if (insuredPersonsFormData) {
                        setInsuredPersonsFormData({
                            ...insuredPersonsFormData,
                            isInsurerAlsoACustomer: true,
                        });
                    }
                }

                setTimeout(() => {
                    setSuppressValidationErrors(false);
                }, 100);
            },
            [fields, insuredPersonsFormData, setInsuredPersonsFormData],
        );

        // Update section data on field changes
        const updateSectionData = useCallback(
            (sectionIndex, formData, isCompleted) => {
                setSectionData((prev) => {
                    const updated = [...prev];

                    // Initialize section if it doesn't exist yet
                    if (!updated[sectionIndex]) {
                        updated[sectionIndex] = {
                            id: sectionIndex,
                            isCompleted: false,
                            data: {},
                        };
                    }

                    updated[sectionIndex] = {
                        ...updated[sectionIndex],
                        // Only update isCompleted if explicitly provided (not undefined)
                        isCompleted:
                            isCompleted !== undefined
                                ? isCompleted
                                : updated[sectionIndex].isCompleted,
                        data: formData,
                    };
                    return updated;
                });
            },
            [],
        );

        const handleNextSection = (sectionIndex, formData) => {
            // Check if this is the final section
            const isLastSection = sectionIndex === numberOfInsuredPersons - 1;

            if (isLastSection) {
                // Set flag to prevent useEffect from overriding our validity state
                isCompletingFinalSection.current = true;

                // This is the final section with "Завърши" button
                // Check if all sections are now completed and trigger callback
                const updatedSectionData = sectionData.map((section, index) =>
                    index === sectionIndex
                        ? { ...section, isCompleted: true }
                        : section,
                );

                const allCompleted = updatedSectionData.every(
                    (section) => section.isCompleted,
                );

                // Update section data and validity state together
                updateSectionData(sectionIndex, formData, true);
                setIsInsuredPersonsValid(allCompleted);

                if (allCompleted && onAllSectionsCompleted) {
                    // Small delay to ensure state updates are processed
                    setTimeout(() => {
                        onAllSectionsCompleted(allCompleted);
                        // Reset flag after callback is triggered
                        isCompletingFinalSection.current = false;
                    }, 100);
                } else {
                    // Reset flag if not all completed
                    isCompletingFinalSection.current = false;
                }
            } else {
                // Mark current section as completed and move to next section
                updateSectionData(sectionIndex, formData, true);
                const nextSection = sectionIndex + 1;
                setExpandedSection(nextSection);
            }
        };

        // Render individual section
        const renderSection = (sectionIndex) => {
            const section = sectionData[sectionIndex] || {
                id: sectionIndex,
                isCompleted: false,
                data: {},
            };
            const isExpanded = expandedSection === sectionIndex;
            const isCompleted = section.isCompleted;
            // All sections are now clickable - no restrictions on navigation
            const isClickable = true;

            return (
                <SectionCard
                    ref={(el) => (sectionRefs.current[sectionIndex] = el)}
                    key={sectionIndex}
                    sectionIndex={sectionIndex}
                    isExpanded={isExpanded}
                    isCompleted={isCompleted}
                    isClickable={isClickable}
                    onToggle={() => handleSectionToggle(sectionIndex)}
                    onNext={handleNextSection}
                    onUpdateData={updateSectionData}
                    fields={fields}
                    createFormInstance={createFormInstance}
                    numberOfInsuredPersons={numberOfInsuredPersons}
                    isInsurerAlsoACustomer={isInsurerAlsoACustomer}
                    handleInsuranceCheckboxChange={
                        handleInsuranceCheckboxChange
                    }
                    suppressValidationErrors={suppressValidationErrors}
                    customerMunicipalities={customerMunicipalities}
                    customerTowns={customerTowns}
                    activeDistrictId={activeDistrictId}
                    setActiveDistrictId={setActiveDistrictId}
                    activeMunicipalityId={activeMunicipalityId}
                    setActiveMunicipalityId={setActiveMunicipalityId}
                    insuredPersonsFormData={insuredPersonsFormData}
                    sectionData={sectionData}
                    showAlert={showAlert}
                    toggleFieldVisible={toggleFieldVisible}
                    toggleFieldEnabled={toggleFieldEnabled}
                    setFieldsState={setFieldsState}
                />
            );
        };

        // Update overall form validity (but not during final section completion to avoid race condition)
        useEffect(() => {
            // Don't update validity if we're in the middle of completing the final section
            if (isCompletingFinalSection.current) {
                return;
            }

            const allCompleted = sectionData.every(
                (section) => section.isCompleted,
            );
            setIsInsuredPersonsValid(allCompleted);
        }, [sectionData, setIsInsuredPersonsValid]);

        // Memoize form data to prevent unnecessary updates
        const formData = useMemo(() => {
            const insuredPersons = sectionData.map((section) => section.data);
            return {
                insurer:
                    isInsurerAlsoACustomer && insuredPersons[0]
                        ? {
                              profile: insuredPersons[0].profile || null,
                              personal_identification_number_type:
                                  insuredPersons[0].pinType || null,
                              personal_identification_number:
                                  insuredPersons[0].pin || "",
                              first_name: insuredPersons[0].firstName || "",
                              last_name: insuredPersons[0].lastName || "",
                              district_id: insuredPersons[0].district || null,
                              municipality_id:
                                  insuredPersons[0].municipality || null,
                              town_id: insuredPersons[0].town || null,
                              post_code: insuredPersons[0].postcode || "",
                              address: insuredPersons[0].address || "",
                              mobile_phone: insuredPersons[0].mobilePhone || "",
                              latin_full_name:
                                  insuredPersons[0].latinFullName || "",
                              email: insuredPersons[0].email || "",
                          }
                        : insuredPersonsFormData?.insurer || null,
                insuredPersons,
                isInsurerAlsoACustomer,
                currentExpandedSection: expandedSection, // Add currently opened section
            };
        }, [
            sectionData,
            isInsurerAlsoACustomer,
            expandedSection,
            insuredPersonsFormData?.insurer,
        ]);

        // Notify parent when expanded section changes
        useEffect(() => {
            if (typeof onExpandedSectionChange === "function") {
                onExpandedSectionChange(
                    expandedSection,
                    numberOfInsuredPersons,
                );
            }
        }, [expandedSection, numberOfInsuredPersons, onExpandedSectionChange]);

        // Expose imperative API to parent
        useImperativeHandle(
            ref,
            () => ({
                validateCurrentAndNext: async () => {
                    const currentRef = sectionRefs.current[expandedSection];
                    if (
                        currentRef &&
                        typeof currentRef.validateAndNext === "function"
                    ) {
                        return await currentRef.validateAndNext();
                    }
                    return false;
                },
                isLastSection: () =>
                    expandedSection === numberOfInsuredPersons - 1,
                areAllSectionsCompleted: () =>
                    sectionData.every((s) => s?.isCompleted),
            }),
            [expandedSection, numberOfInsuredPersons, sectionData],
        );

        // Keep reference to previous form data for comparison
        const prevFormDataRef = useRef();

        // Update form data context only when formData actually changes
        useEffect(() => {
            let isFormInitializedLocal = false;

            if (!insuredPersonsFormData) {
                isFormInitializedLocal = true;
            }

            if (
                insuredPersonsFormData &&
                (!isInsurerAlsoACustomer ||
                    (isInsurerAlsoACustomer &&
                        JSON.stringify(formData.insurer) ===
                            JSON.stringify(insuredPersonsFormData.insurer))) &&
                JSON.stringify(
                    formData.insuredPersons[
                        insuredPersonsFormData.currentExpandedSection
                    ],
                ) ===
                    JSON.stringify(
                        insuredPersonsFormData.insuredPersons[
                            insuredPersonsFormData.currentExpandedSection
                        ],
                    ) &&
                JSON.stringify(formData.isInsurerAlsoACustomer) ===
                    JSON.stringify(
                        insuredPersonsFormData.isInsurerAlsoACustomer,
                    )
            ) {
                isFormInitializedLocal = true;
            }

            if (isFormInitializedLocal) {
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
                setLastVisitedStep(2);
                prevFormDataRef.current = formData;
            }
        }, [
            formData,
            setInsuredPersonsFormData,
            setLastVisitedStep,
            isFormInitialized,
            insuredPersonsFormData,
        ]);

        return (
            <Form id="non-resident-insurance-insured-persons-form">
                <BlockStack gap="400">
                    {Array.from(
                        { length: numberOfInsuredPersons },
                        (_, index) => renderSection(index),
                    )}
                </BlockStack>
            </Form>
        );
    },
);

// Function to check if a person is already selected in another section
const checkForDuplicatePerson = (
    selectedPerson,
    currentSectionIndex,
    sectionData,
) => {
    if (!selectedPerson || selectedPerson.value === 0) {
        return { isDuplicate: false };
    }

    // Check all other sections for the same person
    for (let i = 0; i < sectionData.length; i++) {
        if (i === currentSectionIndex) {
            continue; // Skip current section
        }

        const sectionPersonData = sectionData[i].data;
        if (sectionPersonData) {
            // Check both persons field and profile field
            const isPersonsDuplicate =
                sectionPersonData.persons === selectedPerson.value;
            const isProfileDuplicate =
                sectionPersonData.profile === selectedPerson.value;

            if (isPersonsDuplicate || isProfileDuplicate) {
                return {
                    isDuplicate: true,
                    sectionIndex: i,
                    personName: `${selectedPerson.first_name} ${selectedPerson.last_name}`,
                    sectionNumber: i + 1,
                };
            }
        }
    }

    return { isDuplicate: false };
};

// Individual Section Card Component
const SectionCard = forwardRef(
    (
        {
            sectionIndex,
            isExpanded,
            isCompleted,
            isClickable,
            onToggle,
            onNext,
            onUpdateData,
            fields,
            createFormInstance,
            numberOfInsuredPersons,
            isInsurerAlsoACustomer,
            handleInsuranceCheckboxChange,
            suppressValidationErrors,
            customerMunicipalities,
            customerTowns,
            activeDistrictId,
            setActiveDistrictId,
            activeMunicipalityId,
            setActiveMunicipalityId,
            insuredPersonsFormData,
            sectionData,
            showAlert,
            toggleFieldVisible,
            toggleFieldEnabled,
            setFieldsState,
        },
        ref,
    ) => {
        const formInstance = createFormInstance(sectionIndex);
        const {
            register,
            control,
            watch,
            setValue,
            formState: { errors, isValid, touchedFields },
            trigger,
            clearErrors,
            reset,
            getValues,
        } = formInstance;

        const [manuallyLocationChanged, setManuallyLocationChanged] =
            useState(false);

        useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

        // Helper function to determine if we should show errors
        const shouldShowError = (errorMessage, fieldName) => {
            const hasBeenTouched = fieldName
                ? touchedFields[fieldName]
                : Object.keys(touchedFields).length > 0;
            return !suppressValidationErrors && hasBeenTouched && errorMessage;
        };

        // Watch individual fields to avoid infinite loops
        const pinType = watch("personal_identification_number_type");
        const pin = watch("personal_identification_number");
        const firstName = watch("first_name");
        const lastName = watch("last_name");
        const latinFullName = watch("latin_full_name");
        const birth_date = watch("birth_date");
        const district = watch("district");
        const municipality = watch("municipality");
        const town = watch("town");
        const country = watch("country");
        const address = watch("address");
        const postcode = watch("postcode");

        // Watch customer-specific fields (first person only)
        const profile = watch("profile");
        const persons = watch("persons");

        // Watch fields for all persons
        const mobilePhone = watch("mobile_phone");
        const email = watch("email");
        const isMobileNumberAvailable = watch("is_mobile_number_available");

        // All sections now use the shared active district/municipality state
        // This ensures that the currently opened section gets the correct data

        // Create modified fields array with mobile phone field enabled/disabled based on checkbox
        const modifiedFields = useMemo(() => {
            return fields.map((field) =>
                field.key === "mobile_phone"
                    ? { ...field, isEnabled: !isMobileNumberAvailable }
                    : field,
            );
        }, [fields, isMobileNumberAvailable]);

        // Auto-generate latin full name
        useEffect(() => {
            if (pinType?.value === 4) {
                // When ID type is 4, use only first name
                if (firstName) {
                    setValue(
                        "latin_full_name",
                        generateLatinFullName(firstName, "").trim(),
                        { shouldValidate: true },
                    );
                }
            } else {
                // For other ID types, use both first and last name
                if (firstName && lastName) {
                    setValue(
                        "latin_full_name",
                        generateLatinFullName(firstName, lastName),
                        { shouldValidate: true }, // Prevent validation trigger
                    );
                }
            }
        }, [firstName, lastName, pinType?.value, setValue]);

        // Handle last_name visibility based on personal_identification_number_type
        const prevPinTypeRef = useRef(pinType?.value);
        const isInitialMountRef = useRef(true);

        // Set initial visibility on mount
        useEffect(() => {
            if (isInitialMountRef.current) {
                isInitialMountRef.current = false;
                const initialPinType = pinType?.value;

                if (initialPinType === 4) {
                    toggleFieldVisible("last_name", false);
                    setValue("last_name", null);
                    setValue("latin_full_name", null);
                    setFieldsState((prevFields) => [...prevFields]);
                }
            }
        }, []);

        useEffect(() => {
            const currentPinType = pinType?.value;
            const prevPinType = prevPinTypeRef.current;

            // Only update if pinType actually changed
            if (currentPinType !== prevPinType) {
                prevPinTypeRef.current = currentPinType;

                if (currentPinType === 4) {
                    toggleFieldVisible("last_name", false);
                    setValue("last_name", null);
                    setValue("latin_full_name", null);
                    // Create new array reference to trigger re-render
                    setFieldsState((prevFields) => [...prevFields]);
                } else {
                    toggleFieldVisible("last_name", true);
                    // Create new array reference to trigger re-render
                    setFieldsState((prevFields) => [...prevFields]);
                }
            }
        }, [pinType?.value, toggleFieldVisible, setValue, setFieldsState]);

        // Trigger validation when isInsurerAlsoACustomer changes (for first person only)
        useEffect(() => {
            if (sectionIndex === 0 && !suppressValidationErrors) {
                const timeoutId = setTimeout(() => {
                    trigger(undefined, { shouldFocus: false });
                }, 100);
                return () => clearTimeout(timeoutId);
            }
        }, [
            isInsurerAlsoACustomer,
            trigger,
            sectionIndex,
            suppressValidationErrors,
        ]);

        // Handle mobile phone field state based on checkbox (for all persons)
        useEffect(() => {
            if (isMobileNumberAvailable) {
                // Clear mobile phone field when checkbox is checked
                setValue("mobile_phone", null, { shouldValidate: true });
            }
        }, [isMobileNumberAvailable, setValue]);

        // Note: activeDistrictId and activeMunicipalityId are updated directly in onChangeHandler
        // No need for a sync useEffect as it would cause infinite loops

        // Set default municipality value when customerMunicipalities loads (first person only)
        useEffect(() => {
            if (!isExpanded) return;

            if (customerMunicipalities?.length === 1) {
                setValue("municipality", customerMunicipalities[0], {
                    shouldValidate: true,
                });
                setActiveMunicipalityId(customerMunicipalities[0].value);
            }
            if (manuallyLocationChanged) {
                return;
            }

            const municipalityFromProfile = watch("profile")?.municipality_id;
            const municipalityFromPersons = watch("persons")?.municipality_id;
            const municipalityFromSaved =
                insuredPersonsFormData?.insuredPersons?.[sectionIndex]
                    ?.municipality;
            const municipalityIdToUse =
                municipalityFromProfile ||
                municipalityFromPersons ||
                municipalityFromSaved;

            const savedMunicipality = customerMunicipalities?.find(
                (m) => m.value === parseInt(municipalityIdToUse),
            );

            if (
                customerMunicipalities?.length > 0 &&
                municipalityIdToUse &&
                savedMunicipality
            ) {
                if (savedMunicipality) {
                    setManuallyLocationChanged(false);
                    setValue("municipality", savedMunicipality, {
                        shouldValidate: false,
                    });
                    setActiveMunicipalityId(savedMunicipality.value);
                }
            }
        }, [
            customerMunicipalities,
            insuredPersonsFormData?.insuredPersons?.[sectionIndex]
                ?.municipality,
            persons?.municipality_id,
            profile?.municipality_id,
            isInsurerAlsoACustomer,
            manuallyLocationChanged,
        ]);

        // Set default town value when customerTowns loads (first person only)
        useEffect(() => {
            if (!isExpanded) return;

            if (manuallyLocationChanged) {
                return;
            }

            const currentTownValue = watch("town");
            const townFromProfile = profile?.town_id;
            const townFromPersons = persons?.town_id;
            const townFromSaved =
                insuredPersonsFormData?.insuredPersons?.[sectionIndex]?.town;

            // Don't override if town was explicitly set to null
            // But allow restoration if there's saved data from previous step
            if (
                currentTownValue === null &&
                !townFromProfile &&
                !townFromPersons &&
                !townFromSaved
            ) {
                return;
            }
            const townIdToUse =
                townFromProfile || townFromPersons || townFromSaved;
            const defaultTown = customerTowns?.find(
                (townItem) => townItem.value === parseInt(townIdToUse),
            );

            if (customerTowns?.length > 0 && townIdToUse && defaultTown) {
                if (defaultTown) {
                    setValue("town", defaultTown, {
                        shouldValidate: false,
                    });
                }
            }
        }, [
            customerTowns,
            insuredPersonsFormData?.insuredPersons?.[sectionIndex]?.town,
            persons?.town_id,
            profile?.town_id,
            isInsurerAlsoACustomer,
            watch,
            manuallyLocationChanged,
        ]);

        // Memoize form data to prevent unnecessary updates
        const currentFormData = useMemo(() => {
            const parsedMunicipality = parseInt(municipality)
                ? parseInt(municipality)
                : municipality?.value;
            const parsedTown = parseInt(town) ? parseInt(town) : town?.value;

            return {
                profile: profile || null,
                persons: persons || null,
                pinType: pinType?.value || null,
                pin: pin || "",
                firstName: firstName || "",
                lastName: lastName || "",
                latinFullName: latinFullName || "",
                birth_date: birth_date || null,
                district: district?.value || null,
                municipality: parsedMunicipality || null,
                town: parsedTown || null,
                country: country?.value || null,
                address: address || "",
                postcode: postcode || "",
                mobilePhone: mobilePhone || "",
                email: email || "",
                isMobileNumberAvailable: Boolean(
                    isMobileNumberAvailable ?? false,
                ),
            };
        }, [
            pinType,
            pin,
            firstName,
            lastName,
            latinFullName,
            birth_date,
            district,
            municipality,
            town,
            country,
            address,
            postcode,
            profile,
            mobilePhone,
            email,
            isMobileNumberAvailable,
        ]);

        // Keep reference to previous form data for comparison
        const prevFormDataRef = useRef();

        // Update section data on field changes with deep comparison
        useEffect(() => {
            // Deep comparison helper function
            const isEqual = (obj1, obj2) => {
                return JSON.stringify(obj1) === JSON.stringify(obj2);
            };

            // Only update if form has any meaningful data and it has changed
            const hasData = Object.values(currentFormData).some(
                (value) => value && value !== "",
            );
            const hasChanged =
                !prevFormDataRef.current ||
                !isEqual(prevFormDataRef.current, currentFormData);

            if (hasData && hasChanged) {
                // Check if we should restore completion state from saved data
                const savedSectionData =
                    insuredPersonsFormData?.insuredPersons?.[sectionIndex];
                const currentExpandedSection =
                    insuredPersonsFormData?.currentExpandedSection;

                let shouldBeCompleted = undefined;
                if (savedSectionData && currentExpandedSection !== undefined) {
                    // Restore completion logic from saved state
                    if (
                        currentExpandedSection > 0 &&
                        sectionIndex < currentExpandedSection
                    ) {
                        shouldBeCompleted = true;
                    } else if (
                        savedSectionData &&
                        Object.values(savedSectionData).some(
                            (v) => v && v !== "",
                        )
                    ) {
                        shouldBeCompleted =
                            currentExpandedSection !== sectionIndex;
                    }
                }

                onUpdateData(sectionIndex, currentFormData, shouldBeCompleted);
                prevFormDataRef.current = currentFormData;
            }
        }, [
            currentFormData,
            sectionIndex,
            onUpdateData,
            insuredPersonsFormData?.insuredPersons,
            insuredPersonsFormData?.currentExpandedSection,
        ]);

        // Update completion state based on form validity
        useEffect(() => {
            // Only downgrade completion if user has interacted with the form
            const hasBeenTouched = Object.keys(touchedFields || {}).length > 0;
            if (isCompleted && !isValid && hasBeenTouched) {
                onUpdateData(sectionIndex, currentFormData, false);
            }
        }, [
            isValid,
            isCompleted,
            sectionIndex,
            onUpdateData,
            currentFormData,
            touchedFields,
        ]);

        const handleNext = async () => {
            // Always trigger validation to show errors
            const isFormValid = await trigger();

            if (isFormValid) {
                onNext(sectionIndex, currentFormData);

                // Scroll to top when moving to next section
                window.scrollTo(0, 0);
            } else {
                // Force all fields to be touched so validation errors show
                const allFields = [
                    "personal_identification_number_type",
                    "personal_identification_number",
                    "first_name",
                    "last_name",
                    "latin_full_name",
                    "district",
                    "municipality",
                    "town",
                    "country",
                    "address",
                    "postcode",
                    "mobile_phone",
                ];

                // Add customer-specific fields for first person if insurer is also customer
                if (sectionIndex === 0 && isInsurerAlsoACustomer) {
                    allFields.push("email");
                }

                // Set all fields as touched to force error display
                allFields.forEach((fieldName) => {
                    setValue(fieldName, watch(fieldName), {
                        shouldValidate: true,
                        shouldTouch: true,
                    });
                });
            }
        };

        useImperativeHandle(ref, () => ({
            validateAndNext: handleNext,
        }));

        const sectionTitle = `Застраховано лице ${sectionIndex + 1}`;
        const personName =
            watch("first_name") && watch("last_name")
                ? `${watch("first_name")} ${watch("last_name")}`
                : "";

        return (
            <Surface>
                <Box padding="1000">
                    <BlockStack gap="800">
                        {/* Section Header */}
                        <InlineStack
                            gap="400"
                            blockAlign="center"
                            className={classNames(
                                "bz-insured-person-section-header",
                                {
                                    "bz-insured-person-section-header--clickable":
                                        isClickable,
                                    "bz-insured-person-section-header--completed":
                                        isCompleted,
                                },
                            )}
                            onClick={isClickable ? onToggle : undefined}
                        >
                            <Icon icon={IconUser} size="600" />
                            <BlockStack gap="100">
                                <Text variant="heading-m">{sectionTitle}</Text>
                                {isCompleted && personName && (
                                    <Text variant="body-s" color="gray-600">
                                        {personName}
                                    </Text>
                                )}
                            </BlockStack>
                            {isClickable && (
                                <Box marginInlineStart="auto">
                                    <Icon
                                        icon={
                                            isExpanded
                                                ? IconCaretUp
                                                : IconCaretDown
                                        }
                                        size="400"
                                        color="brand-500"
                                    />
                                </Box>
                            )}
                        </InlineStack>

                        {/* Section Content */}
                        {isExpanded && (
                            <BlockStack
                                gap="400"
                                className="bz-insured-person-section-content"
                            >
                                {fields.find((f) => f.key === "profile")
                                    ?.isVisible &&
                                    sectionIndex === 0 &&
                                    isInsurerAlsoACustomer &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "profile",
                                        onChangeHandler: (value) => {
                                            setManuallyLocationChanged(false);
                                            const isAddressEmpty =
                                                value.district_id === null &&
                                                value.municipality_id ===
                                                    null &&
                                                value.town_id === null;
                                            if (value.value === 0) {
                                                const defaultDistrict =
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "district",
                                                    )?.selected || null;

                                                setActiveDistrictId(
                                                    defaultDistrict?.value,
                                                );
                                                setActiveMunicipalityId(null);
                                                setValue(
                                                    "personal_identification_number_type",
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "personal_identification_number_type",
                                                    )?.selected || null,
                                                );
                                                setValue(
                                                    "personal_identification_number",
                                                    null,
                                                );
                                                setValue("first_name", null);
                                                setValue("last_name", null);
                                                setValue("profile", null);
                                                setValue("persons", null);
                                                setValue(
                                                    "district",
                                                    defaultDistrict || null,
                                                );
                                                setValue("municipality", null);
                                                setValue("town", null);
                                                setValue("postcode", null);
                                                setValue("address", null);
                                                setValue("mobile_phone", null);
                                                setValue("email", null);
                                                setValue(
                                                    "latin_full_name",
                                                    null,
                                                );
                                                setValue("country", null);
                                                setManuallyLocationChanged(
                                                    false,
                                                );
                                            } else {
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
                                                const currentDistrict =
                                                    isAddressEmpty
                                                        ? fields.find(
                                                              (f) =>
                                                                  f.key ===
                                                                  "district",
                                                          )?.selected
                                                        : fields
                                                              .find(
                                                                  (f) =>
                                                                      f.key ===
                                                                      "district",
                                                              )
                                                              ?.values?.find(
                                                                  (v) =>
                                                                      v.value ===
                                                                      value.district_id,
                                                              ) || null;
                                                setValue(
                                                    "district",
                                                    currentDistrict,
                                                );
                                                setActiveDistrictId(
                                                    currentDistrict?.value,
                                                );

                                                const currentMunicipality =
                                                    isAddressEmpty
                                                        ? fields.find(
                                                              (f) =>
                                                                  f.key ===
                                                                  "municipality",
                                                          )?.selected
                                                        : fields
                                                              .find(
                                                                  (f) =>
                                                                      f.key ===
                                                                      "municipality",
                                                              )
                                                              ?.values?.find(
                                                                  (v) =>
                                                                      v.value ===
                                                                      value.municipality_id,
                                                              ) || null;
                                                setValue(
                                                    "municipality",
                                                    currentMunicipality,
                                                );
                                                setActiveMunicipalityId(
                                                    currentMunicipality?.value,
                                                );

                                                if (!isAddressEmpty) {
                                                    const currentTown = fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "town",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.town_id,
                                                        );
                                                    setValue(
                                                        "town",
                                                        currentTown,
                                                    );
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
                                                setValue(
                                                    "country",
                                                    fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "country",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.country_id,
                                                        ),
                                                );
                                                trigger();
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

                                {fields.find((f) => f.key === "persons")
                                    .isVisible &&
                                    ((sectionIndex === 0 &&
                                        !isInsurerAlsoACustomer) ||
                                        sectionIndex > 0) &&
                                    RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "persons",
                                        onChangeHandler: (value) => {
                                            setManuallyLocationChanged(false);
                                            if (value.value === 0) {
                                                const defaultDistrict =
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "district",
                                                    )?.selected;

                                                setActiveDistrictId(
                                                    defaultDistrict?.value,
                                                );
                                                setActiveMunicipalityId(null);
                                                setValue(
                                                    "personal_identification_number_type",
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "personal_identification_number_type",
                                                    )?.selected || null,
                                                );
                                                setValue(
                                                    "personal_identification_number",
                                                    null,
                                                );
                                                setValue("first_name", null);
                                                setValue("last_name", null);
                                                setValue(
                                                    "latin_full_name",
                                                    null,
                                                );
                                                setValue("country", null);
                                                setValue(
                                                    "district",
                                                    defaultDistrict || null,
                                                );
                                                setValue("municipality", null);
                                                setValue("town", null);
                                                setValue("postcode", null);
                                                setValue("address", null);
                                                setValue("mobile_phone", null);
                                            } else {
                                                // Check for duplicate person selection
                                                const duplicateCheck =
                                                    checkForDuplicatePerson(
                                                        value,
                                                        sectionIndex,
                                                        sectionData,
                                                    );

                                                if (
                                                    duplicateCheck.isDuplicate
                                                ) {
                                                    // Show alert for duplicate person
                                                    showAlert({
                                                        title: "Дублирано лице",
                                                        message: `Лицето "${duplicateCheck.personName}" вече е избрано в секция ${duplicateCheck.sectionNumber}. Моля, изберете друго лице.`,
                                                        status: "warning",
                                                        closable: true,
                                                    });
                                                }

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
                                                    "latin_full_name",
                                                    value.latin_full_name,
                                                );
                                                const isAddressEmpty =
                                                    value.district_id ===
                                                        null ||
                                                    value.municipality_id ===
                                                        null ||
                                                    value.town_id === null;

                                                const currentDistrict =
                                                    isAddressEmpty
                                                        ? fields.find(
                                                              (f) =>
                                                                  f.key ===
                                                                  "district",
                                                          )?.selected
                                                        : fields
                                                              .find(
                                                                  (f) =>
                                                                      f.key ===
                                                                      "district",
                                                              )
                                                              ?.values?.find(
                                                                  (v) =>
                                                                      v.value ===
                                                                      value.district_id,
                                                              ) || null;
                                                setValue(
                                                    "district",
                                                    currentDistrict,
                                                );

                                                setActiveDistrictId(
                                                    currentDistrict?.value,
                                                );
                                                const currentMunicipality =
                                                    isAddressEmpty
                                                        ? fields.find(
                                                              (f) =>
                                                                  f.key ===
                                                                  "municipality",
                                                          )?.selected
                                                        : fields
                                                              .find(
                                                                  (f) =>
                                                                      f.key ===
                                                                      "municipality",
                                                              )
                                                              ?.values?.find(
                                                                  (v) =>
                                                                      v.value ===
                                                                      value.municipality_id,
                                                              ) || null;
                                                setValue(
                                                    "municipality",
                                                    currentMunicipality,
                                                );

                                                setActiveMunicipalityId(
                                                    currentMunicipality?.value,
                                                );
                                                setValue(
                                                    "municipality",
                                                    currentMunicipality,
                                                );

                                                if (!isAddressEmpty) {
                                                    const currentTown = fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "town",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.town_id,
                                                        );
                                                    setValue(
                                                        "town",
                                                        currentTown,
                                                    );
                                                } else {
                                                    setValue("town", null);
                                                }

                                                setValue(
                                                    "country",
                                                    fields
                                                        .find(
                                                            (f) =>
                                                                f.key ===
                                                                "country",
                                                        )
                                                        ?.values?.find(
                                                            (v) =>
                                                                v.value ===
                                                                value.country_id,
                                                        ),
                                                );
                                                setValue(
                                                    "postcode",
                                                    value.postcode,
                                                );
                                                setValue(
                                                    "address",
                                                    value.address,
                                                );
                                                setValue(
                                                    "mobile_phone",
                                                    value.mobile_phone,
                                                );
                                            }
                                        },
                                        fields,
                                        control,
                                        error: shouldShowError(
                                            errors.persons?.message,
                                            "persons",
                                        ),
                                    })}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName:
                                            "personal_identification_number_type",
                                        fields,
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

                                <InlineStack
                                    gap="800"
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

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "country",
                                        fields,
                                        control,
                                        error: shouldShowError(
                                            errors.country?.message,
                                            "country",
                                        ),
                                    })}
                                </InlineStack>

                                {(pinType?.value == 2 ||
                                    pinType?.value == 3) && ( // ЛНЧ или НДС
                                    <InlineStack
                                        gap="800"
                                        rowGap="300"
                                        align="space-between"
                                    >
                                        {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                            "birth_date",
                                            fields,
                                            control,
                                            errors.birth_date?.message,
                                            {
                                                minDate: new Date().setFullYear(
                                                    new Date().getFullYear() -
                                                        120,
                                                ),
                                                maxDate: new Date(),
                                                useEnhancedHeader: true,
                                            },
                                        )}

                                        <BlockStack></BlockStack>
                                    </InlineStack>
                                )}

                                <InlineStack
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "district",
                                        onChangeHandler: (value) => {
                                            setValue("municipality", null);
                                            setValue("town", null);
                                            setValue("postcode", null);
                                            // Update the active district and invalidate queries
                                            setActiveDistrictId(value.value);
                                            setActiveMunicipalityId(null);
                                            setManuallyLocationChanged(true);
                                        },
                                        fields,
                                        control,
                                        error: shouldShowError(
                                            errors.district?.message,
                                            "district",
                                        ),
                                    })}

                                    {RenderFormFieldsUtils.renderSelectField({
                                        fieldName: "municipality",
                                        onRenderHandler: (field) => {
                                            // All sections use the same municipality data based on active district
                                            field.values =
                                                customerMunicipalities?.length >
                                                0
                                                    ? customerMunicipalities
                                                    : [];
                                            return field;
                                        },
                                        onChangeHandler: (value) => {
                                            setValue("town", null);

                                            // Update the active municipality and invalidate town query
                                            setActiveMunicipalityId(
                                                value.value,
                                            );
                                            setManuallyLocationChanged(true);
                                        },
                                        fields,
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
                                            // All sections use the same town data based on active municipality
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
                                        fields,
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
                                    gap="800"
                                    rowGap="300"
                                    align="space-between"
                                >
                                    {RenderFormFieldsUtils.renderTextField(
                                        "mobile_phone",
                                        modifiedFields,
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
                                        isMobileNumberAvailable,
                                        (checked) =>
                                            setValue(
                                                "is_mobile_number_available",
                                                checked,
                                            ),
                                    )}
                                </InlineStack>

                                {/* Insurance checkbox for first person only */}
                                {sectionIndex === 0 && (
                                    <Box paddingBlockStart="200">
                                        {RenderFormFieldsUtils.renderCheckboxField(
                                            "is_insurer_also_a_customer",
                                            fields,
                                            control,
                                            isInsurerAlsoACustomer,
                                            (checked) =>
                                                handleInsuranceCheckboxChange(
                                                    checked,
                                                    {
                                                        reset,
                                                        getValues,
                                                        setValue,
                                                    },
                                                ),
                                        )}
                                    </Box>
                                )}

                                {sectionIndex === 0 &&
                                    isInsurerAlsoACustomer &&
                                    RenderFormFieldsUtils.renderTextField(
                                        "email",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.email?.message,
                                            "email",
                                        ),
                                    )}

                                {sectionIndex === 0 &&
                                    !isInsurerAlsoACustomer &&
                                    RenderFormFieldsUtils.renderTextField(
                                        "insurer_email",
                                        fields,
                                        register,
                                        shouldShowError(
                                            errors.insurer_email?.message,
                                            "insurer_email",
                                        ),
                                    )}

                                {/* External step button handles Next/Continue */}
                            </BlockStack>
                        )}
                    </BlockStack>
                </Box>
            </Surface>
        );
    },
);

export default InsuredPersonsForm;
