/**
 * External dependencies
 */
import { useState, useEffect } from "react";

/**
 * Internal dependencies
 */
import Text from "@/components/text/text";
import BlockStack from "@/components/block-stack/block-stack";
import Box from "@/components/box/box";
import { token } from "@/tokens/tokens";

const MinMaxAmount = (props) => {
    const { minValue, maxValue, value, onChange } = props;
    const [sliderValue, setSliderValue] = useState(value || minValue);
    const isInteractive = !!onChange;

    useEffect(() => {
        if (value !== undefined && value !== null && value !== "") {
            setSliderValue(parseFloat(value));
        }
    }, [value]);

    const handleSliderChange = (event) => {
        const newValue = parseFloat(event.target.value);
        setSliderValue(newValue);
        if (onChange) {
            onChange(newValue.toString());
        }
    };

    // Format the numbers with spaces as thousand separators
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    if (!isInteractive) {
        return (
            <Box height={token("size.1800")}>
                <BlockStack gap="200">
                    <div className="bz-min-max-amount__header"></div>

                    <div className="bz-min-max-amount__container bz-min-max-amount__container--static">
                        <div className="bz-min-max-amount__base-line bz-min-max-amount__base-line--static"></div>
                    </div>

                    <div className="bz-min-max-amount__text-container">
                        <div className="bz-min-max-amount__text bz-min-max-amount__text--left">
                            <Text variant="body-s" color="text-secondary">
                                {formatNumber(minValue)} лв
                            </Text>
                        </div>
                        <div className="bz-min-max-amount__text bz-min-max-amount__text--right">
                            <Text variant="body-s" color="text-secondary">
                                {formatNumber(maxValue)} лв
                            </Text>
                        </div>
                    </div>
                </BlockStack>
            </Box>
        );
    }

    const sliderPercentage =
        ((sliderValue - minValue) / (maxValue - minValue)) * 100;

    return (
        <Box height={token("size.1800")}>
            <BlockStack gap="200">
                <div className="bz-min-max-amount__header">
                    <Text variant="body-m" color="text-secondary">
                        Сума
                    </Text>
                    <Text variant="body-m" color="dark-500">
                        {formatNumber(sliderValue)}лв
                    </Text>
                </div>
                <div className="bz-min-max-amount__container">
                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="bz-min-max-amount__slider bz-min-max-amount__slider--interactive"
                        style={{
                            "--slider-percentage": `${sliderPercentage}%`,
                        }}
                    />
                </div>
                <div className="bz-min-max-amount__text-container">
                    <div className="bz-min-max-amount__text bz-min-max-amount__text--left">
                        <Text variant="body-s" color="text-secondary">
                            {formatNumber(minValue)} лв
                        </Text>
                    </div>
                    <div className="bz-min-max-amount__text bz-min-max-amount__text--right">
                        <Text variant="body-s" color="text-secondary">
                            {formatNumber(maxValue)} лв
                        </Text>
                    </div>
                </div>
            </BlockStack>
        </Box>
    );
};

export default MinMaxAmount;
