/**
 * External dependencies
 */
import { forwardRef } from 'react';

const Spinner = forwardRef((props, ref) => {
    return (
        <span ref={ref} className="vf-spinner" {...props}>
            <svg
                className="vf-spinner__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="vf-spinner__circle"
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="43.98"
                    strokeDashoffset="10.99"
                />
            </svg>
        </span>
    );
});

export default Spinner;
