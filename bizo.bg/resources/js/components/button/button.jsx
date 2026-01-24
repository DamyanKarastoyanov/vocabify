/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Spinner from '@/components/spinner/spinner';

const Button = forwardRef((props, ref) => {
    const {
        type = 'button',
        variant = 'primary',
        href,
        disabled = false,
        pressed = false,
        loading = false,
        width,
        height,
        children,
        prefix,
        suffix,
        ...restProps
    } = props;

    const Component = !!href ? 'a' : 'button';

    return (
        <Component
            ref={ref}
            className={classNames(
                'bz-button',
                `bz-button--variant-${variant}`,
                disabled && 'bz-button--disabled',
                pressed && 'bz-button--pressed',
                loading && 'bz-button--loading'
            )}
            style={{
                ...(width && { '--bz-button-width': width }),
                ...(height && { '--bz-button-height': height }),
            }}
            disabled={disabled}
            {...(!!href ? { href } : { type })}
            {...restProps}
        >
            {prefix && <span className="bz-button__affix bz-button__affix--prefix">{prefix}</span>}

            <span className="bz-button__text">{children}</span>

            {suffix && <span className="bz-button__affix bz-button__affix--suffix">{suffix}</span>}

            {loading && (
                <span className="bz-button__spinner">
                    <Spinner />
                </span>
            )}
        </Component>
    );
});

export default Button;
