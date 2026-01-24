/*
 * External dependencies
 */
import { Controller } from "react-hook-form";
import { useEffect } from "react";

/**
 * Internal dependencies
 */
import TextInput from "@/components/text-input/text-input";
import Select from "@/components/select/select";
import DateAndTimePicker from "@/components/date-and-time-picker/date-and-time-picker";
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Text from "@/components/text/text";
import FormLabel from "@/components/form-label/form-label";
import Checkbox from "@/components/checkbox/checkbox";
import InlineError from "@/components/inline-error/inline-error";
import Range from "@/components/range/range";
import Box from "@/components/box/box";
import { token } from "@/tokens/tokens";

const RenderFormFieldsUtils = {
    renderTextField: (fieldName, fields, register, error) => {
        return fields.map((field) => {
            if (field.key === fieldName && field.isVisible) {
                return (
                    <BlockStack
                        key={field.key}
                        gap="200"
                        className="bz-input-field-holder"
                    >
                        <FormLabel required={field.isRequired}>
                            {field.label}
                        </FormLabel>

                        <TextInput
                            id={field.key}
                            required={field.isRequired}
                            disabled={!field.isEnabled}
                            invalid={!!error}
                            placeholder={field?.placeholder || "Въведи"}
                            {...register(field.key)}
                        />
                        {error && <InlineError>{error}</InlineError>}
                    </BlockStack>
                );
            }
            return null;
        });
    },
    renderNumberTextField: (fieldName, fields, register, error) => {
        return fields.map((field) => {
            if (field.key === fieldName && field.isVisible) {
                return (
                    <BlockStack
                        key={field.key}
                        gap="200"
                        className="bz-input-field-holder"
                    >
                        <FormLabel required={field.isRequired}>
                            {field.label}
                        </FormLabel>

                        <TextInput
                            id={field.key}
                            placeholder={field?.placeholder || "Въведи"}
                            required={field.isRequired}
                            disabled={!field.isEnabled}
                            invalid={!!error}
                            type="number"
                            {...register(field.key)}
                        />
                        {error && <InlineError>{error}</InlineError>}
                    </BlockStack>
                );
            }
            return null;
        });
    },
    renderSelectField: ({
        fieldName,
        onRenderHandler,
        onChangeHandler,
        fields,
        control,
        error,
    }) => {
        return fields.map((field) => {
            if (field.key === fieldName && field.isVisible) {
                return (
                    <BlockStack
                        key={field.key}
                        gap="200"
                        className="bz-input-field-holder"
                    >
                        {field.label && (
                            <FormLabel required={field.isRequired}>
                                {field.label}
                            </FormLabel>
                        )}

                        <Controller
                            name={field.key}
                            control={control}
                            render={({ field: controllerField }) => {
                                if (onRenderHandler) {
                                    field = onRenderHandler(field);
                                }

                                return (
                                    <>
                                        <Select
                                            {...controllerField}
                                            placeholder={
                                                field?.placeholder || "Избери"
                                            }
                                            disabled={
                                                field.values.length === 0 ||
                                                !field.isEnabled
                                            }
                                            options={field.values}
                                            isSearchable={
                                                field.values.length > 10
                                            }
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 99999,
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    zIndex: 99999,
                                                    maxHeight: "200px",
                                                }),
                                                menuList: (base) => ({
                                                    ...base,
                                                    maxHeight: "200px",
                                                }),
                                            }}
                                            invalid={!!error}
                                            onChange={(value) => {
                                                if (onChangeHandler) {
                                                    onChangeHandler(value);
                                                }

                                                controllerField.onChange(value);
                                            }}
                                        />
                                        {error && (
                                            <InlineError>{error}</InlineError>
                                        )}
                                    </>
                                );
                            }}
                        />
                    </BlockStack>
                );
            }
            return null;
        });
    },

    renderDateAndTimePickerField: (
        fieldName,
        fields,
        control,
        error,
        options = {},
    ) => {
        return fields.map((field) => {
            if (field.key === fieldName && field.isVisible) {
                // Default date constraints - can be overridden via options
                const defaultConstraints = {
                    minDate: new Date(),
                    maxDate: new Date().setFullYear(
                        new Date().getFullYear() + 1,
                    ),
                };

                // Merge with provided options
                const constraints = { ...defaultConstraints, ...options };

                return (
                    <BlockStack
                        key={field.key}
                        gap="200"
                        className="bz-input-field-holder"
                    >
                        <FormLabel required={field.isRequired}>
                            {field.label}
                        </FormLabel>

                        <Controller
                            name={fieldName}
                            control={control}
                            render={({ field: controllerField }) => (
                                <>
                                    <DateAndTimePicker
                                        startDate={
                                            controllerField.value
                                                ? new Date(
                                                      controllerField.value,
                                                  )
                                                : null
                                        }
                                        minDate={constraints.minDate}
                                        maxDate={constraints.maxDate}
                                        fieldInput={true}
                                        showTime={false}
                                        invalid={!!error}
                                        placeholder={
                                            field?.placeholder || "Избери"
                                        }
                                        useEnhancedHeader={
                                            options.useEnhancedHeader || false
                                        }
                                        onChange={(date) =>
                                            controllerField.onChange(date)
                                        }
                                    />
                                    {error && (
                                        <InlineError>{error}</InlineError>
                                    )}
                                </>
                            )}
                        />
                    </BlockStack>
                );
            }
            return null;
        });
    },

    renderCheckboxField: (
        fieldName,
        fields,
        control,
        isChecked,
        setIsChecked,
        id,
    ) => {
        return fields.map((field) => {
            if (field.key === fieldName && field.isVisible) {
                return (
                    <BlockStack
                        key={`${field.key}_wrapper`}
                        gap="200"
                        className="bz-input-field-holder"
                        align="end"
                    >
                        <Box height={token("size.600")} />

                        <BlockStack align="center">
                            <Controller
                                name={field.key}
                                control={control}
                                render={({ field: controllerField }) => (
                                    <Checkbox
                                        key={id ?? field.key}
                                        id={id ?? field.key}
                                        label={field.label}
                                        checked={isChecked ?? false}
                                        disabled={!field.isEnabled}
                                        onChange={() => {
                                            if (field.isEnabled) {
                                                const newValue = !(
                                                    isChecked ?? false
                                                );
                                                setIsChecked(newValue);
                                                controllerField.onChange(
                                                    newValue,
                                                );
                                            }
                                        }}
                                        name={controllerField.name}
                                        value={controllerField.value}
                                    />
                                )}
                            />
                        </BlockStack>
                    </BlockStack>
                );
            }
        });
    },

    renderRangeField: (fieldName, fields, control, error) => {
        return fields.map((field) => {
            if (field.key === fieldName && field.isVisible) {
                return (
                    <BlockStack
                        key={`${field.key}_wrapper`}
                        gap="200"
                        className="bz-input-field-holder"
                    >
                        <Controller
                            name={field.key}
                            control={control}
                            render={({ field: controllerField }) => {
                                const currentIndex =
                                    field.values?.findIndex(
                                        (option) =>
                                            option.value ===
                                            controllerField.value?.value,
                                    ) ?? 0;

                                const selectedOption =
                                    field.values[currentIndex];

                                // Format label with comma separators
                                const formatLabel = (label) => {
                                    if (!label) return label;

                                    // Extract number and any suffix (like "лв")
                                    const match = label.match(/^(\d+)(.*)$/);
                                    if (match) {
                                        const number = match[1];
                                        const suffix = match[2];
                                        // Format number with commas
                                        const formattedNumber = number.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ",",
                                        );
                                        return formattedNumber + suffix;
                                    }
                                    return label;
                                };

                                const displayValue = selectedOption
                                    ? formatLabel(selectedOption.label)
                                    : "";

                                return (
                                    <>
                                        <InlineStack align="space-between">
                                            <FormLabel
                                                required={field.isRequired}
                                            >
                                                {field.label}
                                            </FormLabel>

                                            <Text
                                                variant="body-m"
                                                color="dark-500"
                                            >
                                                {displayValue}
                                            </Text>
                                        </InlineStack>

                                        <Range
                                            key={field.key}
                                            value={currentIndex}
                                            onChange={(index) => {
                                                const selectedOption =
                                                    field.values[index];
                                                controllerField.onChange(
                                                    selectedOption,
                                                );
                                            }}
                                            min={0}
                                            max={field.values.length - 1}
                                            step={1}
                                        >
                                            {field.values.map(
                                                (option, index) => {
                                                    const isFirst = index === 0;
                                                    const isLast =
                                                        index ===
                                                        field.values.length - 1;

                                                    return (
                                                        <Range.Option
                                                            key={`${option.value}-${index}`}
                                                            value={index}
                                                            label={
                                                                isFirst ||
                                                                isLast
                                                                    ? formatLabel(
                                                                          option.label,
                                                                      )
                                                                    : undefined
                                                            }
                                                        />
                                                    );
                                                },
                                            )}
                                        </Range>
                                    </>
                                );
                            }}
                        />

                        {error && <InlineError>{error}</InlineError>}
                    </BlockStack>
                );
            }
            return null;
        });
    },
};

export default RenderFormFieldsUtils;
