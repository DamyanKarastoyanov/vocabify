/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

const Textarea = forwardRef((props, ref) => {
    const { invalid, disabled, ...rest } = props;

    return (
        <textarea
            ref={ref}
            className={classNames(
                'bz-textarea',
                invalid && 'bz-textarea--invalid',
                disabled && 'bz-textarea--disabled'
            )}
            disabled={disabled}
            {...rest}
        />
    );
});

export default Textarea;
