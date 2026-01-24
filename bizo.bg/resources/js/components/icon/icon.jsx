/**
 * External dependencies
 */
import { cloneElement, forwardRef } from 'react';
import classNames from 'classnames';

const Icon = forwardRef((props, ref) => {
    const { className, icon, size = '500', color, ...restProps } = props;

    return (
        <span
            ref={ref}
            className={classNames('bz-icon', className)}
            style={{
                '--bz-icon-size': `var(--bz-size-${size})`,
                ...(color && { '--bz-icon-color': `var(--bz-color-${color})` }),
            }}
            {...restProps}
        >
            {cloneElement(icon, {
                className: 'bz-icon__svg',
            })}
        </span>
    );
});

export default Icon;
