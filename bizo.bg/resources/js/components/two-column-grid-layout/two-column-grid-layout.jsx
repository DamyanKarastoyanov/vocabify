const TwoColumnGridLayout = (props) => {
    const { children } = props;

    return (
        <div className="bz-grid-layout">
            {children}
        </div>
    );
};

export default TwoColumnGridLayout;
