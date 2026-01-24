/**
 * External dependencies
 */
import classNames from "classnames";
import { forwardRef, useEffect, useRef } from "react";
/**
 * Internal dependencies
 */

import Box from "@/components/box/box";
import BlockStack from "@/components/block-stack/block-stack";
import useRangeProgress from "@/components/range/use-range-progress";
import RangeOption from "@/components/range/range-option";

const Range = forwardRef((props, ref) => {
    const {
        id,
        value,
        onChange,
        disabled = false,
        children,
        ...restProps
    } = props;
    const inputRef = useRef(null);
    const progress = useRangeProgress(value, inputRef);

    return (
        <Box
            style={{
                "--bz-range-progress": `${progress}%`,
            }}
        >
            <BlockStack
                className={classNames("bz-range-wrapper", {
                    "bz-range-wrapper--disabled": disabled,
                })}
                gap="200"
            >
                <input
                    ref={(node) => {
                        inputRef.current = node;
                        if (typeof ref === "function") {
                            ref(node);
                        } else if (ref) {
                            ref.current = node;
                        }
                    }}
                    type="range"
                    value={value}
                    onChange={(e) =>
                        !disabled && onChange?.(Number(e.target.value))
                    }
                    disabled={disabled}
                    id={id}
                    {...restProps}
                />

                <datalist id={`${id}-datalist`}>{children}</datalist>
            </BlockStack>
        </Box>
    );
});

Range.Option = RangeOption;

export default Range;
