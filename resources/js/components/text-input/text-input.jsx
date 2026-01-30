/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
const mergeRefs = (refA, refB) => (el) => {
    if (refA != null) {
        if (typeof refA === 'function') refA(el);
        else refA.current = el;
    }
    if (refB != null) {
        if (typeof refB === 'function') refB(el);
        else refB.current = el;
    }
};

const TextInput = forwardRef((props, ref) => {
    const {
        type = 'text',
        id,
        name,
        value,
        defaultValue,
        placeholder = ' ',
        disabled = false,
        invalid = false,
        error,
        prefix,
        suffix,
        className,
        inputRef,
        ...restProps
    } = props;

    const mergedRef = ref != null || inputRef != null ? mergeRefs(ref, inputRef) : ref;
    const showInvalid = invalid || !!error;

    return (
        <div
            className={classNames(
                'vf-text-input',
                disabled && 'vf-text-input--disabled',
                showInvalid && 'vf-text-input--invalid',
                className
            )}
        >
            {prefix && <span className="vf-text-input__affix vf-text-input__affix--prefix">{prefix}</span>}
            <input
                ref={mergedRef}
                type={type}
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={disabled}
                className={classNames(
                    'vf-text-input__input',
                    showInvalid && 'vf-text-input__input--error'
                )}
                {...restProps}
            />
            {suffix && <span className="vf-text-input__affix vf-text-input__affix--suffix">{suffix}</span>}
        </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
