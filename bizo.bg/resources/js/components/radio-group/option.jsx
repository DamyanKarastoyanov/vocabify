import React from "react";
import PropTypes from "prop-types";
import RadioContext from "./radio-context";

const Option = ({ value, children, disabled }) => {
    const { selectedValue, onChange, name } = React.useContext(RadioContext);

    return (
        <label
            className={`radio-option ${disabled ? "radio-option--disabled" : ""}`}
        >
            <input
                type="radio"
                name={name}
                value={value}
                checked={selectedValue === value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="radio-option__input"
            />
            <span className="radio-option__radio"></span>
            <span className="radio-option__label">{children}</span>
        </label>
    );
};

Option.propTypes = {
    value: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
};

export default Option;
