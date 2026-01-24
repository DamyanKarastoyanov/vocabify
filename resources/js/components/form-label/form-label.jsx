/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
const FormLabel = (props) => {
    const {
        htmlFor,
        required = false,
        children,
        className,
        ...restProps
    } = props;

    return (
        <label
            htmlFor={htmlFor}
            className={classNames('vf-form-label', className)}
            {...restProps}
        >
            {children}
            {required && <span className="vf-form-label__required">*</span>}
        </label>
    );
};

export default FormLabel;
