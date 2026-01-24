/**
 * External dependencies
 */
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import Icon from '@/components/icon/icon';
import IconCircleNotch from '@/components/icons/circle-notch';

const Spinner = forwardRef((props, ref) => {
    return (
        <span ref={ref} className="bz-spinner">
            <Icon icon={IconCircleNotch} {...props} />
        </span>
    );
});

export default Spinner;
