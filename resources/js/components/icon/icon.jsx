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
            className={classNames('vf-icon', className)}
            style={{
                '--vf-icon-size': `var(--vf-size-${size})`,
                ...(color && { '--vf-icon-color': `var(--vf-color-${color})` }),
            }}
            {...restProps}
        >
            {cloneElement(icon, {
                className: 'vf-icon__svg',
            })}
        </span>
    );
});

Icon.displayName = 'Icon';

export default Icon;
