/**
 * External dependencies
 */
import { forwardRef, useState, useCallback } from "react";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import BlockStack from "@/components/block-stack/block-stack";
import InlineStack from "@/components/inline-stack/inline-stack";
import Button from "@/components/button/button";
import Icon from "@/components/icon/icon";
import FormLabel from "@/components/form-label/form-label";
import TextInput from "@/components/TextInput";
import Box from "@/components/box/box";
import IconPlus from "@/components/icons/plus";
import IconMinus from "@/components/icons/minus";

const NumberCounter = forwardRef((props, ref) => {
    const {
        label = null,
        value: controlledValue,
        onChange,
        min = 1,
        max = null,
        className,
        disabled = false,
        ...restProps
    } = props;

    const [internalValue, setInternalValue] = useState(
        controlledValue !== undefined ? controlledValue : min,
    );
    const currentValue =
        controlledValue !== undefined ? controlledValue : internalValue;

    const handleIncrement = useCallback(() => {
        if (disabled) return;

        const startValue = currentValue === null ? min : currentValue;
        if (max !== null && startValue >= max) return;

        const newValue = startValue + 1;
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    }, [currentValue, max, min, disabled, controlledValue, onChange]);

    const handleDecrement = useCallback(() => {
        if (disabled) return;

        const startValue = currentValue === null ? min : currentValue;
        if (min !== null && startValue <= min) return;

        const newValue = startValue - 1;
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    }, [currentValue, min, disabled, controlledValue, onChange]);

    const handleInputChange = useCallback(
        (event) => {
            if (disabled) return;

            const inputValue = event.target.value;

            // Allow empty input (which represents null)
            if (inputValue === "") {
                if (controlledValue === undefined) {
                    setInternalValue(null);
                }
                onChange?.(null);
                return;
            }

            // Parse the input as a number
            const numericValue = parseInt(inputValue, 10);

            // Validate that it's a valid number
            if (isNaN(numericValue)) {
                return;
            }

            // Clamp the value to min/max bounds
            let clampedValue = Math.max(min, numericValue);
            if (max !== null) {
                clampedValue = Math.min(max, clampedValue);
            }

            if (controlledValue === undefined) {
                setInternalValue(clampedValue);
            }
            onChange?.(clampedValue);
        },
        [min, max, disabled, controlledValue, onChange],
    );

    const handleInputBlur = useCallback(
        (event) => {
            if (disabled) return;

            const inputValue = event.target.value;

            // If input is empty on blur, keep it as null (don't auto-reset to min)
            if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
                if (controlledValue === undefined) {
                    setInternalValue(null);
                }
                onChange?.(null);
            }
        },
        [disabled, controlledValue, onChange],
    );

    // Determine display value for the input
    const displayValue = currentValue === null ? "" : currentValue;

    return (
        <Box
            ref={ref}
            className={classNames("bz-number-counter", className)}
            {...restProps}
        >
            <BlockStack gap="200">
                {label && <FormLabel>{label}</FormLabel>}

                <Box className="bz-number-counter__container">
                    <InlineStack align="center">
                        <Box className="bz-number-counter__button">
                            <Button
                                variant="plain"
                                disabled={
                                    disabled ||
                                    (currentValue !== null &&
                                        currentValue <= min)
                                }
                                onClick={handleDecrement}
                                aria-label="Decrease"
                            >
                                <Icon
                                    icon={IconMinus}
                                    size="600"
                                    color="brand-500"
                                />
                            </Button>
                        </Box>

                        <Box className="bz-number-counter__value">
                            <TextInput
                                type="number"
                                value={displayValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                disabled={disabled}
                                min={min}
                                max={max}
                                placeholder=""
                                className="bz-number-counter__input"
                            />
                        </Box>

                        <Box className="bz-number-counter__button">
                            <Button
                                variant="plain"
                                disabled={
                                    disabled ||
                                    (max !== null &&
                                        currentValue !== null &&
                                        currentValue >= max)
                                }
                                onClick={handleIncrement}
                                aria-label="Increase"
                            >
                                <Icon
                                    icon={IconPlus}
                                    size="600"
                                    color="brand-500"
                                />
                            </Button>
                        </Box>
                    </InlineStack>
                </Box>
            </BlockStack>
        </Box>
    );
});

export default NumberCounter;
