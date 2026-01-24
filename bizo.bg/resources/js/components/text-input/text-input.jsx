/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

const TextInput = forwardRef((props, ref) => {
    const { type = 'text', placeholder = ' ', disabled = false, invalid = false, prefix, suffix, ...restProps } = props;

    return (
        <div
            className={classNames(
                'bz-text-input',
                disabled && 'bz-text-input--disabled',
                invalid && 'bz-text-input--invalid'
            )}
        >
            {prefix && <span className="bz-text-input__affix bz-text-input__affix--prefix">{prefix}</span>}

            <input
                ref={ref}
                type={type}
                className="bz-text-input__input"
                disabled={disabled}
                placeholder={placeholder}
                {...restProps}
            />

            {suffix && <span className="bz-text-input__affix bz-text-input__affix--suffix">{suffix}</span>}
        </div>
    );
});

export default TextInput;
