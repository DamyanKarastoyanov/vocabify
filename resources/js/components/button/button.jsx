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
        className,
        ...restProps
    } = props;

    const Component = !!href ? 'a' : 'button';

    return (
        <Component
            ref={ref}
            className={classNames(
                'vf-button',
                `vf-button--variant-${variant}`,
                disabled && 'vf-button--disabled',
                pressed && 'vf-button--pressed',
                loading && 'vf-button--loading',
                className
            )}
            style={{
                ...(width && { '--vf-button-width': width }),
                ...(height && { '--vf-button-height': height }),
            }}
            disabled={disabled}
            {...(!!href ? { href } : { type })}
            {...restProps}
        >
            {prefix && <span className="vf-button__affix vf-button__affix--prefix">{prefix}</span>}

            <span className="vf-button__text">{children}</span>

            {suffix && <span className="vf-button__affix vf-button__affix--suffix">{suffix}</span>}

            {loading && (
                <span className="vf-button__spinner">
                    <Spinner />
                </span>
            )}
        </Component>
    );
});

export default Button;
