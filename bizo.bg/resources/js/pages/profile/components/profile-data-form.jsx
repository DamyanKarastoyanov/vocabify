/**
 * Internal dependencies
 */
import Form from "@/components/form/form";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Surface from "@/components/surface/surface";
import RenderFormFieldsUtils from "@/utils/render-form-fields-utils";
import Text from "@/components/text/text";
import Button from "@/components/button/button";
import Box from "@/components/box/box";
import IconUser from "@/components/icons/user";
import Icon from "@/components/icon/icon";
import IconBuilding from "@/components/icons/building";
import { token } from "@/tokens/tokens";
import useFieldControls from "@/hooks/use-field-controls";

const ProfileDataForm = (props) => {
    const {
        fields,
        register,
        errors,
        control,
        setValue,
        isCompany,
        municipalities,
        towns,
        invalidateMunicipalityQuery,
        invalidateTownQuery,
        setDistrictId,
        setMunicipalityId,
        handleResetPasswordRequest,
        onSubmit,
        handleSubmit,
    } = props;

    const { toggleFieldEnabled } = useFieldControls(fields);

    return (
        <>
            <Form id="profile-form">
                <BlockStack gap="800" className="bz-profile-data-form">
                    <Surface>
                        <Box padding="1000">
                            <BlockStack gap="800">
                                <InlineStack gap="400" blockAlign="center">
                                    <Icon icon={IconUser} size="600" />

                                    <Text variant="heading-m">Лични данни</Text>
                                </InlineStack>

                                <BlockStack
                                    gap="400"
                                    className="bz-profile-data-form-box-content"
                                >
                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderTextField(
                                            "profile_first_name",
                                            fields,
                                            register,
                                            errors.profile_first_name?.message,
                                        )}
                                        {!isCompany &&
                                            RenderFormFieldsUtils.renderTextField(
                                                "profile_last_name",
                                                fields,
                                                register,
                                                errors.profile_last_name
                                                    ?.message,
                                            )}
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName:
                                                    "profile_personal_identification_number_type",
                                                fields: fields,
                                                onChangeHandler: () => {
                                                    setValue(
                                                        "profile_personal_identification_number",
                                                        null,
                                                    );
                                                },
                                                control,
                                                error: errors
                                                    .profile_personal_identification_number_type
                                                    ?.message,
                                            },
                                        )}
                                        {RenderFormFieldsUtils.renderTextField(
                                            "profile_personal_identification_number",
                                            fields,
                                            register,
                                            errors
                                                .profile_personal_identification_number
                                                ?.message,
                                        )}
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderTextField(
                                            "email",
                                            fields,
                                            register,
                                            errors.email?.message,
                                        )}
                                        {RenderFormFieldsUtils.renderTextField(
                                            "profile_phone",
                                            fields,
                                            register,
                                            errors.profile_phone?.message,
                                        )}
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderTextField(
                                            "profile_driver_license",
                                            fields,
                                            register,
                                            errors.profile_driver_license
                                                ?.message,
                                        )}
                                        {RenderFormFieldsUtils.renderTextField(
                                            "profile_latin_full_name",
                                            fields,
                                            register,
                                            errors.profile_latin_full_name
                                                ?.message,
                                        )}
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderDateAndTimePickerField(
                                            "profile_birth_date",
                                            fields,
                                            control,
                                            errors.profile_birth_date?.message,
                                            {
                                                minDate: new Date().setFullYear(
                                                    new Date().getFullYear() -
                                                        120,
                                                ),
                                                maxDate: new Date(),
                                                useEnhancedHeader: true,
                                            },
                                        )}
                                        <BlockStack className="bz-input-field-holder"></BlockStack>
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </Surface>

                    <Surface>
                        <Box padding="1000">
                            <BlockStack gap="800">
                                <InlineStack gap="400" blockAlign="center">
                                    <Icon icon={IconBuilding} size="600" />

                                    <Text variant="heading-m">
                                        Информация за адрес
                                    </Text>
                                </InlineStack>

                                <BlockStack
                                    gap="400"
                                    className="bz-profile-data-form-box-content"
                                >
                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName: "address_district",
                                                fields: fields,
                                                control,
                                                onChangeHandler: (value) => {
                                                    setValue(
                                                        "address_municipality",
                                                        null,
                                                    );
                                                    setValue(
                                                        "address_town",
                                                        null,
                                                    );
                                                    setValue(
                                                        "address_postcode",
                                                        null,
                                                    );
                                                    toggleFieldEnabled(
                                                        "address_town",
                                                        false,
                                                    );
                                                    invalidateMunicipalityQuery();
                                                    invalidateTownQuery();
                                                    setDistrictId(value.value);
                                                },
                                                error: errors.address_district
                                                    ?.message,
                                            },
                                        )}
                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName:
                                                    "address_municipality",
                                                fields: fields,
                                                control,
                                                onRenderHandler: (field) => {
                                                    field.values =
                                                        municipalities?.length >
                                                        0
                                                            ? municipalities
                                                            : [];
                                                    return field;
                                                },
                                                onChangeHandler: (value) => {
                                                    setValue(
                                                        "address_municipality",
                                                        {
                                                            ...value,
                                                            value: value.value.toString(),
                                                        },
                                                    );
                                                    setValue(
                                                        "address_town",
                                                        null,
                                                    );
                                                    setValue(
                                                        "address_postcode",
                                                        null,
                                                    );
                                                    toggleFieldEnabled(
                                                        "address_town",
                                                        true,
                                                    );
                                                    invalidateTownQuery();
                                                    setMunicipalityId(
                                                        value.value,
                                                    );
                                                },
                                                error: errors
                                                    .address_municipality
                                                    ?.message,
                                            },
                                        )}
                                    </InlineStack>
                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderSelectField(
                                            {
                                                fieldName: "address_town",
                                                fields: fields,
                                                control,
                                                onRenderHandler: (field) => {
                                                    field.values =
                                                        towns?.length > 0
                                                            ? towns
                                                            : [];
                                                    return field;
                                                },
                                                onChangeHandler: (value) => {
                                                    setValue("address_town", {
                                                        ...value,
                                                        value: value.value.toString(),
                                                    });
                                                    setValue(
                                                        "address_postcode",
                                                        value.postcode,
                                                    );
                                                },
                                                error: errors.address_town
                                                    ?.message,
                                            },
                                        )}
                                        {RenderFormFieldsUtils.renderTextField(
                                            "address_postcode",
                                            fields,
                                            register,
                                            errors.address_postcode?.message,
                                        )}
                                    </InlineStack>

                                    <InlineStack
                                        align="space-between"
                                        rowGap="300"
                                        gap="800"
                                    >
                                        {RenderFormFieldsUtils.renderTextField(
                                            "address_address",
                                            fields,
                                            register,
                                            errors.address_address?.message,
                                        )}
                                        <BlockStack className="bz-input-field-holder"></BlockStack>
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </Surface>

                    <InlineStack align="space-between">
                        <Button
                            variant="outline"
                            onClick={handleResetPasswordRequest}
                        >
                            <Text>Смяна на парола</Text>
                        </Button>

                        <Button
                            width={token("size.3600")}
                            onClick={handleSubmit(onSubmit)}
                        >
                            <Text>Запази</Text>
                        </Button>
                    </InlineStack>
                </BlockStack>
            </Form>
        </>
    );
};

export default ProfileDataForm;
