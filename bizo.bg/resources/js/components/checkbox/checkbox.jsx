/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from '@/components/icon/icon';
import IconCheck from '@/components/icons/check';

const Checkbox = (props) => {
    const { id, label, invalid, checked, disabled, ...restProps } = props;

    return (
        <label
            htmlFor={id}
            className={classNames(
                'bz-checkbox',
                invalid && 'bz-checkbox--invalid',
                disabled && 'bz-checkbox--disabled',
                checked && 'bz-checkbox--checked'
            )}
        >
            <input
                id={id}
                type="checkbox"
                className="bz-checkbox__input"
                checked={checked}
                disabled={disabled}
                {...restProps}
            />

            <span className="bz-checkbox__button">
                <Icon icon={IconCheck} size="300" />
            </span>

            {label && <span className="bz-checkbox__label">{label}</span>}
        </label>
    );
};

export default Checkbox;
