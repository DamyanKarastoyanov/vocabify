/**
 * External dependencies
 */
import classNames from 'classnames';

const FormLabel = (props) => {
    const { invalid, disabled, required, ...restProps } = props;

    return (
        <label
            className={classNames(
                'bz-form-label',
                invalid && 'bz-form-label--invalid',
                disabled && 'bz-form-label--disabled',
                required && 'bz-form-label--required'
            )}
            {...restProps}
        />
    );
};

export default FormLabel;
