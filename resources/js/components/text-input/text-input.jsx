/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
const TextInput = forwardRef((props, ref) => {
    const {
        type = 'text',
        id,
        name,
        value,
        defaultValue,
        placeholder,
        disabled = false,
        error,
        className,
        ...restProps
    } = props;

    return (
        <div className={classNames('vf-text-input', className)}>
            <input
                ref={ref}
                type={type}
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={disabled}
                className={classNames(
                    'vf-text-input__input',
                    error && 'vf-text-input__input--error'
                )}
                {...restProps}
            />
            {error && (
                <span className="vf-text-input__error">{error}</span>
            )}
        </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
