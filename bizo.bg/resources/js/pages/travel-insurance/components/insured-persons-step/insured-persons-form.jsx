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
import useGetMunicipalityQuery from "@/pages/travel-insurance/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/travel-insurance/data/use-get-town-query";
import Surface from "@/components/surface/surface";
import Icon from "@/components/icon/icon";
import IconCaretDown from "@/components/icons/caret-down";
import IconCaretUp from "@/components/icons/caret-up";
import IconUser from "@/components/icons/user";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import generateLatinFullName from "@/utils/generate-latin-full-name";
import Box from "@/components/box/box";
import { useFormDataContext } from "@/pages/travel-insurance/contexts/form-data-context";
import { useValidityContext } from "@/pages/travel-insurance/contexts/validity-context";
import InsuredPersonsValidationSchema from "@/pages/travel-insurance/validations/insured-persons-validation-schema";
import BasicInsuredPersonValidationSchema from "@/pages/travel-insurance/validations/basic-insured-person-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import useFieldControls from "@/hooks/use-field-controls";

const InsuredPersonsForm = forwardRef(
    ({ onAllSectionsCompleted, onExpandedSectionChange }, ref) => {
        const { travel_insurance } = usePage().props;
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
            travel_insurance.fields || [],
        );
        const fields = fieldsState;
        const { toggleFieldEnabled, toggleFieldVisible } =
            useFieldControls(fields);
        const numberOfInsuredPersons =
            calculatePriceFormData.customer_groups[0].count;
        const [customerDistrictId, setCustomerDistrictId] = useState(() => {
            if (insuredPersonsFormData?.customer?.district_id) {
                const parsedId = parseInt(
                    insuredPersonsFormData.customer.district_id,
                );
                return parsedId;
            }
            return (
                travel_insurance.fields.find(
                    (f) => f.key === "customer_district",
                )?.selected?.value || null
            );
        });

        const [customerMunicipalityId, setCustomerMunicipalityId] = useState(
            () => {
                return insuredPersonsFormData?.customer?.municipality_id
                    ? parseInt(insuredPersonsFormData.customer.municipality_id)
                    : null;
            },
        );

        // Additional customer form data state
        const [customerFormData, setCustomerFormData] = useState(() => {
            const customer = insuredPersonsFormData?.customer;

            return {
                district_id: customer?.district_id || null,
                municipality_id: null,
                town_id: null,
                post_code: customer?.post_code || "",
                address: customer?.address || "",
                mobile_phone: customer?.mobile_phone || "",
                email: customer?.email || "",
            };
        });

        const {
            data: customerMunicipalities,
            invalidateQuery: invalidateCustomerMunicipalityQuery,
        } = useGetMunicipalityQuery(customerDistrictId);

        const {
            data: customerTowns,
            invalidateQuery: invalidateCustomerTownQuery,
        } = useGetTownQuery(customerMunicipalityId);

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
            if (insuredPersonsFormData?.currentExpandedSection !== undefined) {
                return insuredPersonsFormData.currentExpandedSection;
            }
            // Default to first section if no saved state
            return 0;
        });
        const [sectionData, setSectionData] = useState(() => {
            // Initialize section data based on numberOfInsuredPersons
            const sections = [];
            const currentExpandedSection =
                insuredPersonsFormData?.currentExpandedSection;

            for (let i = 0; i < numberOfInsuredPersons; i++) {
                // Check if we have saved data for this section
                const savedSectionData =
                    insuredPersonsFormData?.insuredPersons?.[i];
                const hasData =
                    savedSectionData &&
                    Object.values(savedSectionData).some(
                        (value) => value && value !== "",
                    );

                // Better completion logic:
                // - If we have a saved expanded section > 0, all sections before it should be completed
                // - If a section has meaningful data, it should be completed (unless it's the current expanded one)
                let isCompleted = false;

                if (
                    currentExpandedSection !== undefined &&
                    currentExpandedSection > 0
                ) {
                    // If we're restoring a section > 0, mark all previous sections as completed
                    isCompleted = i < currentExpandedSection;
                } else if (hasData) {
                    // If section has meaningful data, mark as completed (but not if it's the currently expanded one)
                    isCompleted = currentExpandedSection !== i;
                }

                sections.push({
                    id: i,
                    isCompleted,
                    data: savedSectionData || {},
                });
            }
            return sections;
        });

        // Flag to track if we're in restoration mode
        const isRestoringFromSavedData = useRef(
            insuredPersonsFormData?.currentExpandedSection !== undefined,
        );

        // Flag to track if we're completing the final section to avoid race condition
        const isCompletingFinalSection = useRef(false);
        const sectionRefs = useRef([]);

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
                        const customer = insuredPersonsFormData?.customer;
                        const firstPerson =
                            insuredPersonsFormData?.insuredPersons?.[0];

                        if (insuredPersonsFormData?.customer) {
                            return {
                                profile:
                                    insuredPersonsFormData?.customer?.profile ||
                                    null,
                                customer_personal_identification_number_type:
                                    fields
                                        .find(
                                            (f) =>
                                                f.key ===
                                                "customer_personal_identification_number_type",
                                        )
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                customer.personal_identification_number_type,
                                        ) || null,
                                customer_personal_identification_number:
                                    customer.personal_identification_number ||
                                    null,
                                first_name: customer.first_name || null,
                                last_name: customer.last_name || null,
                                customer_district:
                                    fields
                                        .find(
                                            (f) =>
                                                f.key === "customer_district",
                                        )
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                parseInt(customer.district_id),
                                        ) || null,
                                customer_municipality:
                                    fields
                                        .find(
                                            (f) =>
                                                f.key ===
                                                "customer_municipality",
                                        )
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                parseInt(
                                                    customer.municipality_id,
                                                ),
                                        ) || null,
                                customer_town:
                                    fields
                                        .find((f) => f.key === "customer_town")
                                        ?.values?.find(
                                            (v) =>
                                                v.value ===
                                                parseInt(customer.town_id),
                                        ) || null,
                                customer_postcode: customer.post_code || null,
                                customer_address: customer.address || null,
                                mobile_phone: customer.mobile_phone || null,
                                email: customer.email || null,
                                latin_full_name:
                                    generateLatinFullName(
                                        customer.first_name,
                                        customer.last_name,
                                    ) || null,
                                is_student:
                                    customer.is_student == 1 ? true : false,
                                birth_date: (() => {
                                    if (firstPerson.birth_date) {
                                        const date = new Date(
                                            firstPerson.birth_date,
                                        );
                                        if (!isNaN(date.getTime())) {
                                            date.setHours(0, 0, 0, 0);
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
                                            date.setHours(0, 0, 0, 0);
                                            return date;
                                        }
                                    }
                                    return null;
                                })(),
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
                                return {
                                    profile: fields.find(
                                        (f) => f.key === "profile",
                                    )?.values?.[0],
                                    customer_personal_identification_number_type:
                                        fields
                                            .find(
                                                (f) =>
                                                    f.key ===
                                                    "customer_personal_identification_number_type",
                                            )
                                            ?.values?.find(
                                                (v) =>
                                                    v.value ===
                                                    firstOption.personal_identification_number_type,
                                            ) || null,
                                    customer_personal_identification_number:
                                        firstOption.personal_identification_number,
                                    first_name: firstOption.first_name,
                                    last_name: firstOption.last_name,
                                    birth_date: (() => {
                                        if (firstOption.birth_date) {
                                            const date = new Date(
                                                firstOption.birth_date,
                                            );
                                            if (!isNaN(date.getTime())) {
                                                date.setHours(0, 0, 0, 0);
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
                                                date.setHours(0, 0, 0, 0);
                                                return date;
                                            }
                                        }
                                        return null;
                                    })(),
                                    customer_district: isAddressEmpty
                                        ? fields.find(
                                              (f) =>
                                                  f.key === "customer_district",
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
                                                      firstOption.district_id,
                                              ) || null,
                                    customer_municipality: isAddressEmpty
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
                                                      firstOption.municipality_id,
                                              ) || null,
                                    customer_town: !isAddressEmpty
                                        ? fields
                                              .find(
                                                  (f) =>
                                                      f.key === "customer_town",
                                              )
                                              ?.values?.find(
                                                  (v) =>
                                                      v.value ===
                                                      firstOption.town_id,
                                              )
                                        : null,
                                    customer_postcode:
                                        firstOption.postal_code || null,
                                    customer_address:
                                        firstOption.address || null,
                                    mobile_phone:
                                        firstOption.mobile_phone || null,
                                    email: firstOption.email || null,
                                    latin_full_name:
                                        generateLatinFullName(
                                            firstOption.first_name,
                                            firstOption.last_name,
                                        ) || null, // Initialize checkbox field with false
                                    is_student:
                                        firstOption.is_student == 1
                                            ? true
                                            : false,
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
                            // Initialize checkbox fields with false to prevent uncontrolled to controlled warning
                            if (field.key === "is_student") {
                                acc[field.key] = false;
                            }
                            if (field.key === "profile") {
                                acc.profile =
                                    field.selected ||
                                    (field.values && field.values.length > 0
                                        ? field.values[0]
                                        : undefined);
                            }
                            if (field.key === "birth_date") {
                                acc[field.key] =
                                    new Date(field.selected).setHours(
                                        0,
                                        0,
                                        0,
                                        0,
                                    ) || null;
                            }
                            return acc;
                        }, {});
                    }

                    const savedData =
                        insuredPersonsFormData?.insuredPersons?.[sectionIndex];
                    if (savedData) {
                        // For other sections or first section without customer data
                        return {
                            persons: savedData.persons,
                            customer_personal_identification_number_type:
                                fields
                                    .find(
                                        (f) =>
                                            f.key ===
                                            "customer_personal_identification_number_type",
                                    )
                                    ?.values?.find(
                                        (v) => v.value === savedData.pinType,
                                    ) || null,
                            customer_personal_identification_number:
                                savedData.pin || "",
                            first_name: savedData.firstName || "",
                            last_name: savedData.lastName || "",
                            latin_full_name: savedData.latinFullName || "",
                            is_student: savedData.isStudent || false,
                            birth_date: (() => {
                                if (savedData.birth_date) {
                                    const date = new Date(savedData.birth_date);
                                    if (!isNaN(date.getTime())) {
                                        date.setHours(0, 0, 0, 0);
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
                                        date.setHours(0, 0, 0, 0);
                                        return date;
                                    }
                                }
                                return null;
                            })(),
                        };
                    }

                    return {
                        customer_personal_identification_number_type:
                            fields.find(
                                (f) =>
                                    f.key ===
                                    "customer_personal_identification_number_type",
                            )?.selected || null,
                        customer_personal_identification_number: "",
                        first_name: "",
                        last_name: "",
                        latin_full_name: "",
                        is_student: false,
                        birth_date: (() => {
                            const birthDateField = fields.find(
                                (f) => f.key === "birth_date",
                            );
                            if (birthDateField?.selected) {
                                const date = new Date(birthDateField.selected);
                                if (!isNaN(date.getTime())) {
                                    date.setHours(0, 0, 0, 0);
                                    return date;
                                }
                            }
                            return null;
                        })(),
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
            setExpandedSection(newExpandedSection);
        };

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

        // Handler for insurance checkbox change (first person only)
        const handleInsuranceCheckboxChange = useCallback(
            (checked, formMethods) => {
                // Suppress validation errors during transition
                setSuppressValidationErrors(true);
                setIsInsurerAlsoACustomer(checked);
                const { setValue, reset, getValues } = formMethods;
                // If changing to false (not insurer also customer), auto-select first person
                if (!checked) {
                    const personsField = fields.find(
                        (f) => f.key === "persons",
                    );

                    // Only proceed if persons field exists and is visible
                    if (personsField?.isVisible && personsField?.values) {
                        const firstPerson = personsField.values[0];
                        if (personsField.values.length > 1) {
                            setValue("persons", firstPerson, {
                                shouldValidate: false,
                                shouldTouch: false,
                            });

                            setValue(
                                "is_student",
                                firstPerson.isStudent == 1 ? true : false,
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
                                            firstPerson.personal_identification_number_type,
                                    ) || null,
                            );
                            setValue(
                                "customer_personal_identification_number",
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
                        } else if (personsField.values.length === 1) {
                            setValue("persons", firstPerson);
                            setValue("is_student", null);
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
                            setValue("latin_full_name", null);
                        }
                    } else {
                        const currentValues = getValues();
                        setTimeout(() => {
                            reset(currentValues, {
                                keepErrors: false,
                                keepDirty: false,
                            });
                        }, 50);
                    }

                    setInsuredPersonsFormData({
                        ...insuredPersonsFormData,
                        customer: null,
                    });
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
                        const isAddressEmpty =
                            firstOption.district_id === null &&
                            firstOption.municipality_id === null &&
                            firstOption.town_id === null;

                        setValue("profile", firstOption, {
                            shouldValidate: false,
                            shouldTouch: false,
                        });

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
                                        firstOption.personal_identification_number_type,
                                ) || null,
                        );
                        setValue(
                            "customer_personal_identification_number",
                            firstOption.personal_identification_number,
                        );
                        setValue("first_name", firstOption.first_name);
                        // Only set last_name if pinType is not 4 (pinType 4 hides last_name field)
                        if (
                            firstOption.personal_identification_number_type !==
                            4
                        ) {
                            setValue("last_name", firstOption.last_name);
                        } else {
                            setValue("last_name", null);
                        }
                        setValue(
                            "latin_full_name",
                            firstOption.latin_full_name,
                        );
                        setValue(
                            "is_student",
                            firstOption.is_student == 1 ? true : false,
                        );

                        const currentDistrict = isAddressEmpty
                            ? fields.find((f) => f.key === "customer_district")
                                  ?.selected
                            : fields
                                  .find((f) => f.key === "customer_district")
                                  ?.values?.find(
                                      (v) =>
                                          v.value === firstOption.district_id,
                                  ) || null;
                        setValue("customer_district", currentDistrict);
                        setCustomerDistrictId(currentDistrict?.value);

                        const currentMunicipality = isAddressEmpty
                            ? fields.find(
                                  (f) => f.key === "customer_municipality",
                              )?.selected
                            : fields
                                  .find(
                                      (f) => f.key === "customer_municipality",
                                  )
                                  ?.values?.find(
                                      (v) =>
                                          v.value ===
                                          firstOption.municipality_id,
                                  ) || null;
                        setValue("customer_municipality", currentMunicipality);
                        setCustomerMunicipalityId(currentMunicipality?.value);

                        if (!isAddressEmpty) {
                            const currentTown = fields
                                .find((f) => f.key === "customer_town")
                                ?.values?.find(
                                    (v) => v.value === firstOption.town_id,
                                );
                            setValue("customer_town", currentTown);
                        }

                        setValue("customer_postcode", firstOption.postal_code);
                        setValue("customer_address", firstOption.address);
                        setValue("mobile_phone", firstOption.mobile_phone);
                        setValue("email", firstOption.email);
                    }
                }
            },
            [fields],
        );

        // Update section data on field changes
        const updateSectionData = useCallback(
            (sectionIndex, formData, isCompleted) => {
                setSectionData((prev) => {
                    const updated = [...prev];
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

                // Collapse the final section
                //setExpandedSection(-1);
            } else {
                // Mark current section as completed and move to next section
                updateSectionData(sectionIndex, formData, true);
                const nextSection = sectionIndex + 1;
                setExpandedSection(nextSection);
            }
        };

        // Render individual section
        const renderSection = (sectionIndex) => {
            const section = sectionData[sectionIndex];
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
                    invalidateCustomerMunicipalityQuery={
                        invalidateCustomerMunicipalityQuery
                    }
                    invalidateCustomerTownQuery={invalidateCustomerTownQuery}
                    customerDistrictId={customerDistrictId}
                    setCustomerDistrictId={setCustomerDistrictId}
                    customerMunicipalityId={customerMunicipalityId}
                    setCustomerMunicipalityId={setCustomerMunicipalityId}
                    customerFormData={customerFormData}
                    setCustomerFormData={setCustomerFormData}
                    insuredPersonsFormData={insuredPersonsFormData}
                    sectionData={sectionData}
                    showAlert={showAlert}
                    toggleFieldEnabled={toggleFieldEnabled}
                    toggleFieldVisible={toggleFieldVisible}
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

        // Notify parent when expanded section changes
        useEffect(() => {
            if (typeof onExpandedSectionChange === "function") {
                onExpandedSectionChange(
                    expandedSection,
                    numberOfInsuredPersons,
                );
            }
        }, [expandedSection, numberOfInsuredPersons, onExpandedSectionChange]);

        // Memoize form data to prevent unnecessary updates
        const formData = useMemo(() => {
            const insuredPersons = sectionData.map((section) => section.data);
            return {
                customer:
                    isInsurerAlsoACustomer && insuredPersons[0]
                        ? {
                              profile: insuredPersons[0].profile || null,
                              personal_identification_number_type:
                                  insuredPersons[0].pinType || null,
                              personal_identification_number:
                                  insuredPersons[0].pin || "",
                              first_name: insuredPersons[0].firstName || "",
                              last_name: insuredPersons[0].lastName || "",
                              district_id: customerFormData.district_id || null,
                              municipality_id:
                                  customerFormData.municipality_id || null,
                              town_id: customerFormData.town_id || null,
                              post_code: customerFormData.post_code || "",
                              address: customerFormData.address || "",
                              mobile_phone: customerFormData.mobile_phone || "",
                              email: customerFormData.email || "",
                          }
                        : insuredPersonsFormData?.customer || null,
                insuredPersons,
                isInsurerAlsoACustomer,
                currentExpandedSection: expandedSection, // Add currently opened section
            };
        }, [
            sectionData,
            isInsurerAlsoACustomer,
            expandedSection,
            customerFormData,
            insuredPersonsFormData?.customer,
        ]);

        // Keep reference to previous form data for comparison
        const prevFormDataRef = useRef();

        // Update form data context only when formData actually changes
        useEffect(() => {
            let isFormInitializedLocal = false;

            if (!insuredPersonsFormData) {
                isFormInitializedLocal = true;
            }

            if (
                insuredPersonsFormData?.currentExpandedSection !== undefined &&
                insuredPersonsFormData?.insuredPersons &&
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
                console.log("update form data");
                setInsuredPersonsFormData(formData);
                setLastVisitedStep(2);
                prevFormDataRef.current = formData;
            }
        }, [
            formData,
            setInsuredPersonsFormData,
            setLastVisitedStep,
            isFormInitialized,
        ]);

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

        return (
            <Form id="travel-insurance-insured-persons-form">
                <BlockStack gap="800">
                    {Array.from(
                        { length: numberOfInsuredPersons },
                        (_, index) => renderSection(index),
                    )}
                </BlockStack>
            </Form>
        );
    },
);

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
            invalidateCustomerMunicipalityQuery,
            invalidateCustomerTownQuery,
            customerDistrictId,
            setCustomerDistrictId,
            customerMunicipalityId,
            setCustomerMunicipalityId,
            customerFormData,
            setCustomerFormData,
            insuredPersonsFormData,
            sectionData, // Add sectionData prop
            showAlert, // Add showAlert prop
            toggleFieldEnabled,
            toggleFieldVisible,
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
        const persons = watch("persons");
        const pinType = watch("customer_personal_identification_number_type");
        const pin = watch("customer_personal_identification_number");
        const firstName = watch("first_name");
        const lastName = watch("last_name");
        const latinFullName = watch("latin_full_name");
        const isStudent = watch("is_student");
        const birth_date = watch("birth_date");

        // Watch customer-specific fields (first person only)
        const profile = watch("profile");
        const customerDistrict = watch("customer_district");
        const customerMunicipality = watch("customer_municipality");
        const customerTown = watch("customer_town");
        const customerPostCode = watch("customer_postcode");
        const customerAddress = watch("customer_address");
        const customerEmail = watch("email");
        const customerMobilePhone = watch("mobile_phone");

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

        // Update customer form data when relevant fields change (first person only)
        useEffect(() => {
            if (sectionIndex === 0 && isInsurerAlsoACustomer) {
                setCustomerFormData((prev) => ({
                    ...prev,
                    district_id: customerDistrict?.value || null,
                    municipality_id: customerMunicipality?.value || null,
                    town_id: customerTown?.value || null,
                    post_code: customerPostCode || "",
                    address: customerAddress || "",
                    mobile_phone: customerMobilePhone || "",
                    email: customerEmail || "",
                }));
            }
        }, [
            sectionIndex,
            isInsurerAlsoACustomer,
            customerDistrict,
            customerMunicipality,
            customerTown,
            customerPostCode,
            customerAddress,
            customerMobilePhone,
            customerEmail,
            setCustomerFormData,
        ]);

        // Keep customerDistrictId and customerMunicipalityId in sync for queries (first person only)
        useEffect(() => {
            if (sectionIndex === 0 && isInsurerAlsoACustomer) {
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
            }
        }, [
            sectionIndex,
            isInsurerAlsoACustomer,
            customerDistrict,
            customerMunicipality,
            customerDistrictId,
            customerMunicipalityId,
            setCustomerDistrictId,
            setCustomerMunicipalityId,
            isInsurerAlsoACustomer,
        ]);

        // Set default municipality value when customerMunicipalities loads (first person only)
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
                sectionIndex === 0 &&
                isInsurerAlsoACustomer &&
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
            sectionIndex,
            isInsurerAlsoACustomer,
            customerMunicipalities,
            insuredPersonsFormData?.customer?.municipality_id,
            profile?.municipality_id,
            isInsurerAlsoACustomer,
            manuallyLocationChanged,
        ]);

        // Set default town value when customerTowns loads (first person only)
        useEffect(() => {
            if (manuallyLocationChanged) {
                return;
            }

            const currentTownValue = watch("town");

            // Don't override if town was explicitly set to null
            if (currentTownValue === null && !profile?.town_id) {
                return;
            }

            const townFromProfile = profile?.town_id;
            const townFromSaved = insuredPersonsFormData?.customer?.town_id;
            const townIdToUse = townFromProfile || townFromSaved;

            if (
                sectionIndex === 0 &&
                isInsurerAlsoACustomer &&
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
            sectionIndex,
            isInsurerAlsoACustomer,
            customerTowns,
            insuredPersonsFormData?.customer?.town_id,
            profile?.town_id,
            manuallyLocationChanged,
        ]);

        // Memoize form data to prevent unnecessary updates
        const currentFormData = useMemo(() => {
            return {
                persons: persons || null,
                profile: profile || null,
                pinType: pinType?.value || null,
                pin: pin || "",
                firstName: firstName || "",
                lastName: lastName || "",
                latinFullName: latinFullName || "",
                isStudent: isStudent || false,
                birth_date: (() => {
                    if (birth_date !== undefined && birth_date !== null) {
                        // Format as MySQL datetime string (YYYY-MM-DD HH:MM:SS)
                        const date = new Date(birth_date);
                        if (!isNaN(date.getTime())) {
                            date.setHours(0, 0, 0, 0);
                            return date
                                .toISOString()
                                .slice(0, 19)
                                .replace("T", " ");
                        }
                    }
                    return null;
                })(),
            };
        }, [
            pinType,
            pin,
            firstName,
            lastName,
            latinFullName,
            isStudent,
            persons,
            profile,
            birth_date,
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
                // Don't override completion state when updating with form data
                // Only the explicit user actions (like clicking "Next") should change completion state
                onUpdateData(sectionIndex, currentFormData, undefined);
                prevFormDataRef.current = currentFormData;
            }
        }, [currentFormData, sectionIndex, onUpdateData]);

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
                const formData = {
                    persons: watch("persons") || null,
                    profile: watch("profile") || null,
                    pinType: watch(
                        "customer_personal_identification_number_type",
                    )?.value,
                    pin: watch("customer_personal_identification_number"),
                    firstName: watch("first_name"),
                    lastName: watch("last_name"),
                    latinFullName: watch("latin_full_name"),
                    isStudent: watch("is_student") || false,
                    birth_date: (() => {
                        const birthDateValue = watch("birth_date");
                        if (
                            birthDateValue !== undefined &&
                            birthDateValue !== null
                        ) {
                            // Format as MySQL datetime string (YYYY-MM-DD HH:MM:SS)
                            const date = new Date(birthDateValue);
                            if (!isNaN(date.getTime())) {
                                date.setHours(0, 0, 0, 0);
                                return date
                                    .toISOString()
                                    .slice(0, 19)
                                    .replace("T", " ");
                            }
                        }
                        return null;
                    })(),
                };
                onNext(sectionIndex, formData);

                // Scroll to top when moving to next section
                window.scrollTo(0, 0);
            } else {
                // Force all fields to be touched so validation errors show
                const allFields = [
                    "customer_personal_identification_number_type",
                    "customer_personal_identification_number",
                    "first_name",
                    "last_name",
                    "latin_full_name",
                    "birth_date",
                ];

                // Add customer-specific fields for first person if insurer is also customer
                if (sectionIndex === 0 && isInsurerAlsoACustomer) {
                    allFields.push(
                        "customer_district",
                        "customer_municipality",
                        "customer_town",
                        "customer_postcode",
                        "customer_address",
                        "email",
                        "mobile_phone",
                    );
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

        useImperativeHandle(ref, () => ({ validateAndNext: handleNext }));

        const sectionTitle = `Застраховано лице ${sectionIndex + 1}`;
        const personName =
            watch("first_name") && watch("last_name")
                ? `${watch("first_name")} ${watch("last_name")}`
                : "";

        // Function to check if a person is already selected in another section
        const checkForDuplicatePerson = (
            selectedPerson,
            currentSectionIndex,
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
                                <Icon
                                    icon={
                                        isExpanded ? IconCaretUp : IconCaretDown
                                    }
                                    size="400"
                                    color="brand-500"
                                />
                            )}
                        </InlineStack>

                        {/* Section Content */}
                        {isExpanded && (
                            <BlockStack
                                gap="400"
                                className="bz-insured-person-section-content"
                            >
                                {fields.find((f) => f.key === "profile")
                                    .isVisible &&
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
                                                setValue(
                                                    "customer_district",
                                                    fields.find(
                                                        (f) =>
                                                            f.key ===
                                                            "customer_district",
                                                    )?.selected || null,
                                                );
                                                setValue(
                                                    "customer_municipality",
                                                    null,
                                                );
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
                                                setValue(
                                                    "latin_full_name",
                                                    null,
                                                );
                                            } else {
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
                                                    toggleFieldEnabled(
                                                        "customer_town",
                                                        true,
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
                                                setValue(
                                                    "latin_full_name",
                                                    null,
                                                );
                                                setValue("is_student", false);
                                            } else {
                                                // Check for duplicate person selection
                                                const duplicateCheck =
                                                    checkForDuplicatePerson(
                                                        value,
                                                        sectionIndex,
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
                                                setValue(
                                                    "latin_full_name",
                                                    value.latin_full_name,
                                                );
                                                setValue(
                                                    "is_student",
                                                    value.is_student == 1
                                                        ? true
                                                        : false,
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

                                    {RenderFormFieldsUtils.renderCheckboxField(
                                        "is_student",
                                        fields,
                                        control,
                                        watch("is_student") ?? false,
                                        (checked) =>
                                            setValue("is_student", checked, {
                                                shouldValidate: false,
                                            }),
                                    )}
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

                                {/* Insurance checkbox for first person only */}
                                {sectionIndex === 0 &&
                                    RenderFormFieldsUtils.renderCheckboxField(
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

                                {sectionIndex === 0 &&
                                    isInsurerAlsoACustomer && (
                                        <BlockStack gap="400">
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
                                                                {
                                                                    shouldValidate: false,
                                                                },
                                                            );
                                                            setValue(
                                                                "customer_town",
                                                                null,
                                                                {
                                                                    shouldValidate: false,
                                                                },
                                                            );
                                                            toggleFieldEnabled(
                                                                "customer_town",
                                                                false,
                                                            );
                                                            setValue(
                                                                "customer_postcode",
                                                                null,
                                                            );
                                                            setCustomerDistrictId(
                                                                value.value,
                                                            );
                                                            setManuallyLocationChanged(
                                                                true,
                                                            );
                                                        },
                                                        fields: fields,
                                                        control,
                                                        error: shouldShowError(
                                                            errors
                                                                .customer_district
                                                                ?.message,
                                                            "customer_district",
                                                        ),
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
                                                                {
                                                                    shouldValidate: false,
                                                                },
                                                            );
                                                            setValue(
                                                                "customer_postcode",
                                                                null,
                                                            );
                                                            toggleFieldEnabled(
                                                                "customer_town",
                                                                true,
                                                            );
                                                            setCustomerMunicipalityId(
                                                                value.value,
                                                            );
                                                            setManuallyLocationChanged(
                                                                true,
                                                            );
                                                        },
                                                        fields: fields,
                                                        control,
                                                        error: shouldShowError(
                                                            errors
                                                                .customer_municipality
                                                                ?.message,
                                                            "customer_municipality",
                                                        ),
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
                                                        fieldName:
                                                            "customer_town",
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
                                                        error: shouldShowError(
                                                            errors.customer_town
                                                                ?.message,
                                                            "customer_town",
                                                        ),
                                                    },
                                                )}

                                                {RenderFormFieldsUtils.renderTextField(
                                                    "customer_postcode",
                                                    fields,
                                                    register,
                                                    shouldShowError(
                                                        errors.customer_postcode
                                                            ?.message,
                                                        "customer_postcode",
                                                    ),
                                                )}
                                            </InlineStack>

                                            {RenderFormFieldsUtils.renderTextField(
                                                "customer_address",
                                                fields,
                                                register,
                                                shouldShowError(
                                                    errors.customer_address
                                                        ?.message,
                                                    "customer_address",
                                                ),
                                            )}

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
                                                        errors.mobile_phone
                                                            ?.message,
                                                        "mobile_phone",
                                                    ),
                                                )}
                                            </InlineStack>
                                        </BlockStack>
                                    )}
                            </BlockStack>
                        )}
                    </BlockStack>
                </Box>
            </Surface>
        );
    },
);

export default InsuredPersonsForm;
