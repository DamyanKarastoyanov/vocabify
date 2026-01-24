const RangeOption = (props) => {
    const { value, label } = props;

    return <option value={value} label={label || ""} />;
};

export default RangeOption;
