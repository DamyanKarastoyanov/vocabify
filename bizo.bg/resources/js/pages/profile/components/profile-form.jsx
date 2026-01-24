/**
 * External dependencies
 */
import { usePage, router } from "@inertiajs/react";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * Internal dependencies
 */
import profileFormValidationSchema from "@/pages/profile/validation/profile-form-validation-schema";
import { useScrollToError } from "@/hooks/use-scroll-to-error";
import generateLatinFullName from "@/utils/generate-latin-full-name";
import useGetMunicipalityQuery from "@/pages/profile/data/use-get-municipality-query";
import useGetTownQuery from "@/pages/profile/data/use-get-town-query";
import useEditProfileMutation from "@/pages/profile/data/use-edit-profile";
import useResetPasswordRequestMutation from "@/pages/profile/data/use-reset-password-request-mutation";
import useChangePasswordMutation from "@/pages/profile/data/use-change-password-mutation";
import useAlert from "@/components/alert/hooks/use-alert";
import Alert from "@/components/alert/alert";
import resetPasswordFormValidationSchema from "@/pages/profile/validation/reset-password-form-validation.schema";
import ProfileDataForm from "@/pages/profile/components/profile-data-form";
import ResetPasswordRequestForm from "@/pages/profile/components/reset-password-request-form";
import { stripHash } from "@/utils/hash-utils";

const ProfileForm = () => {
    const { profile, auth } = usePage().props;
    const { user } = auth;
    const { email } = user;

    const fields = profile.fields || [];
    const [isResetPasswordRequestFormOpen, setIsResetPasswordRequestFormOpen] =
        useState(() => {
            const url = new URL(window.location.href);
            return url.searchParams.get("resetPasswordRequest") === "open";
        });

    const { showAlert: showSuccessAlert, closeAlert: closeSuccessAlert } =
        useAlert(Alert, {
            duration: Infinity,
            style: {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            },
        });

    const [districtId, setDistrictId] = useState(() => {
        return (
            fields.find((f) => f.key === "address_district")?.selected?.value ||
            null
        );
    });

    const [municipalityId, setMunicipalityId] = useState(() => {
        return (
            fields.find((f) => f.key === "address_municipality")?.selected
                ?.value || null
        );
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        control,
        setValue,
        watch,
        clearErrors,
    } = useForm({
        defaultValues: useMemo(() => {
            return fields.reduce((acc, field) => {
                const { key, selected } = field || {};
                if (key) {
                    if (key === "profile_birth_date" && selected === null) {
                        return acc;
                    }
                    acc[key] = selected;
                }
                return acc;
            }, {});
        }, [fields]),
        resolver: yupResolver(
            isResetPasswordRequestFormOpen
                ? resetPasswordFormValidationSchema
                : profileFormValidationSchema,
        ),
        mode: "onChange",
    });

    useScrollToError(errors, !isValid && Object.keys(errors).length > 0);

    const identityType = watch("profile_personal_identification_number_type");
    const isCompany = identityType?.value === 4;

    // Auto-generate latin full name when first and last names change
    useEffect(() => {
        if (watch("profile_first_name") && watch("profile_last_name")) {
            setValue(
                "profile_latin_full_name",
                generateLatinFullName(
                    watch("profile_first_name"),
                    watch("profile_last_name"),
                ),
            );
        }
    }, [watch("profile_first_name"), watch("profile_last_name"), setValue]);

    const {
        data: municipalities,
        invalidateQuery: invalidateMunicipalityQuery,
    } = useGetMunicipalityQuery(districtId);
    const { data: towns, invalidateQuery: invalidateTownQuery } =
        useGetTownQuery(municipalityId);
    const { mutate: resetPasswordRequest } = useResetPasswordRequestMutation();
    const { mutate: editProfile, isPending: isEditingProfile } =
        useEditProfileMutation();
    const { mutate: changePassword, isPending: isChangingPassword } =
        useChangePasswordMutation();

    const handleResetPasswordRequest = () => {
        resetPasswordRequest(
            { email, source: "profile_form" },
            {
                onSuccess: (response) => {
                    setIsResetPasswordRequestFormOpen(true);
                    stripHash();
                    router.reload({
                        data: {
                            resetPasswordRequest: "open",
                        },
                        preserveState: true,
                        preserveScroll: true,
                    });
                },
                onError: (error) => {
                    showSuccessAlert({
                        title: "Настъпи грешка",
                        message: error.message,
                        status: "error",
                        closable: true,
                        cta: {
                            label: "OK",
                            actionFun: () => {
                                closeSuccessAlert();
                            },
                        },
                    });
                },
            },
        );
    };

    const onSubmit = (data) => {
        const transformedData = Object.entries(data || {}).reduce(
            (acc, [key, value]) => {
                switch (key) {
                    case "profile_personal_identification_number_type":
                    case "address_district":
                    case "address_municipality":
                    case "address_town":
                        acc[key] = value.value || null;
                        break;
                    case "profile_birth_date":
                        acc[key] = (() => {
                            if (value !== undefined && value !== null) {
                                // Format as MySQL datetime string (YYYY-MM-DD HH:MM:SS) without timezone conversion
                                const date = new Date(value);
                                if (!isNaN(date.getTime())) {
                                    const year = date.getFullYear();
                                    const month = String(
                                        date.getMonth() + 1,
                                    ).padStart(2, "0");
                                    const day = String(date.getDate()).padStart(
                                        2,
                                        "0",
                                    );
                                    return `${year}-${month}-${day} 00:00:00`;
                                }
                            }
                            return null;
                        })();
                        break;
                    default:
                        acc[key] = value;
                }
                return acc;
            },
            {},
        );

        editProfile(transformedData, {
            onSuccess: () => {
                showSuccessAlert({
                    title: "Успешно запазване",
                    message: "Промените са запазени",
                    status: "success",
                    closable: true,
                    cta: {
                        label: "OK",
                        actionFun: () => {
                            closeSuccessAlert();
                        },
                    },
                });
            },
            onError: (error) => {
                showSuccessAlert({
                    title: "Настъпи грешка",
                    message: error.message,
                    status: "error",
                    closable: true,
                    cta: {
                        label: "OK",
                        actionFun: () => {
                            closeSuccessAlert();
                        },
                    },
                });
            },
        });
    };
    const onResetPasswordSubmit = (data) => {
        changePassword(
            {
                current_password: data.current_password,
                password: data.password,
                password_confirmation: data.password_confirmation,
            },
            {
                onSuccess: () => {
                    showSuccessAlert({
                        title: "Успешно запазване",
                        message: "Паролата е променена успешно",
                        status: "success",
                        closable: true,
                        cta: {
                            label: "OK",
                            actionFun: () => {
                                closeSuccessAlert();
                            },
                        },
                    });
                    setIsResetPasswordRequestFormOpen(false);
                    const url = new URL(window.location.href);
                    url.searchParams.delete("resetPasswordRequest");
                    router.get(
                        url.pathname + url.search,
                        {},
                        {
                            preserveState: true,
                            preserveScroll: true,
                        },
                    );
                },
                onError: (error) => {
                    showSuccessAlert({
                        title: "Настъпи грешка",
                        message: error.response?.data?.message,
                        status: "error",
                        closable: true,
                        cta: {
                            label: "OK",
                            actionFun: () => {
                                closeSuccessAlert();
                            },
                        },
                    });
                },
            },
        );
    };

    return isResetPasswordRequestFormOpen ? (
        <ResetPasswordRequestForm
            fields={fields}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onResetPasswordSubmit={onResetPasswordSubmit}
            isChangingPassword={isChangingPassword}
        />
    ) : (
        <ProfileDataForm
            fields={fields}
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            isCompany={isCompany}
            municipalities={municipalities}
            towns={towns}
            invalidateMunicipalityQuery={invalidateMunicipalityQuery}
            invalidateTownQuery={invalidateTownQuery}
            setDistrictId={setDistrictId}
            setMunicipalityId={setMunicipalityId}
            handleResetPasswordRequest={handleResetPasswordRequest}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
        />
    );
};

export default ProfileForm;
