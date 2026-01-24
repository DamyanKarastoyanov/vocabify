import { components } from "react-select";
import classNames from "classnames";

const Option = (props) => {
    const { children, innerRef, innerProps, data, ...restProps } = props;

    const newInnerProps = { ...innerProps };

    delete newInnerProps.onMouseOver;
    delete newInnerProps.onMouseMove;

    const hideRadioButton = data?.hideRadioButton || false;

    return (
        <components.Option
            {...restProps}
            innerRef={innerRef}
            innerProps={newInnerProps}
            className={classNames(
                restProps.className,
                hideRadioButton && "bz-select__option--hide-radio",
            )}
        >
            {children}
        </components.Option>
    );
};

export default Option;
