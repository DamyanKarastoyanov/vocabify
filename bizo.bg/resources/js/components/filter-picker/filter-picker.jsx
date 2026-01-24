/**
 * External dependencies
 */
import { forwardRef, useState, useEffect, useRef } from "react";
import classNames from "classnames";

/**
 * Internal dependencies
 */
import Icon from "@/components/icon/icon";
import Button from "@/components/button/button";
import IconCaretDown from "@/components/icons/caret-down";
import InlineStack from "@/components/inline-stack/inline-stack";
import BlockStack from "@/components/block-stack/block-stack";
import Text from "@/components/text/text";

const FilterPicker = forwardRef((props, ref) => {
    const {
        values = [],
        selectedValue = null,
        title = "",
        onChange,
        disabled = false,
        className,
        ...restProps
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [alignRight, setAlignRight] = useState(false);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Check if dropdown would overflow and flip it if needed
    useEffect(() => {
        if (isOpen && triggerRef.current && dropdownRef.current) {
            // Use requestAnimationFrame to ensure DOM is fully rendered
            requestAnimationFrame(() => {
                if (!triggerRef.current || !dropdownRef.current) return;

                const triggerRect = triggerRef.current.getBoundingClientRect();
                const dropdownRect =
                    dropdownRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const padding = 16; // Minimum padding from viewport edge

                // Check if dropdown would overflow on the right
                const wouldOverflowRight =
                    triggerRect.left + dropdownRect.width >
                    viewportWidth - padding;

                // Check available space on both sides
                const spaceOnRight = viewportWidth - triggerRect.right;
                const spaceOnLeft = triggerRect.left;

                // Flip to right alignment if:
                // 1. It would overflow on the right AND
                // 2. There's more space on the left OR
                // 3. The dropdown is wider than available space on right
                const shouldAlignRight =
                    (wouldOverflowRight && spaceOnLeft > spaceOnRight) ||
                    (dropdownRect.width > spaceOnRight &&
                        spaceOnLeft > spaceOnRight);

                setAlignRight(shouldAlignRight);
            });
        } else {
            setAlignRight(false);
        }
    }, [isOpen]);

    const handleSelect = (value) => {
        if (onChange) {
            onChange(value);
        }
        setIsOpen(false);
    };

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    const displayText = selectedValue || title;

    return (
        <div
            className={classNames(
                "bz-filter-picker",
                alignRight && "bz-filter-picker--align-right",
                className,
            )}
            {...restProps}
        >
            {isOpen && (
                <div
                    className="bz-filter-picker__overlay"
                    onClick={handleClickOutside}
                />
            )}

            <Button
                ref={(node) => {
                    triggerRef.current = node;
                    if (ref) {
                        if (typeof ref === "function") {
                            ref(node);
                        } else {
                            ref.current = node;
                        }
                    }
                }}
                variant="secondary"
                className={classNames(
                    "bz-filter-picker__trigger",
                    disabled && "bz-filter-picker__trigger--disabled",
                    isOpen && "bz-filter-picker__trigger--open",
                    !selectedValue && "bz-filter-picker__trigger--placeholder",
                )}
                onClick={handleToggle}
                disabled={disabled}
            >
                <InlineStack gap="100" wrap={false} blockAlign="center">
                    <BlockStack>
                        <Text as="span" variant="body-m" color="brand-500">
                            {displayText}
                        </Text>
                        <div className="bz-filter-picker__text-line"></div>
                    </BlockStack>
                    <Icon
                        icon={IconCaretDown}
                        className={classNames(
                            "bz-filter-picker__icon",
                            isOpen && "bz-filter-picker__icon--rotated",
                        )}
                    />
                </InlineStack>
            </Button>

            {isOpen && (
                <div ref={dropdownRef} className="bz-filter-picker__dropdown">
                    <div className="bz-filter-picker__menu">
                        {selectedValue && (
                            <Button
                                variant="ghost"
                                className="bz-filter-picker__option bz-filter-picker__option--clear"
                                onClick={() => handleSelect(null)}
                            >
                                Изчисти
                            </Button>
                        )}
                        {values.map((option) => (
                            <Button
                                key={option}
                                variant="ghost"
                                className={classNames(
                                    "bz-filter-picker__option",
                                    selectedValue === option &&
                                        "bz-filter-picker__option--selected",
                                )}
                                onClick={() => handleSelect(option)}
                            >
                                <span className="bz-filter-picker__option-text">
                                    {option}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

FilterPicker.displayName = "FilterPicker";

export default FilterPicker;
