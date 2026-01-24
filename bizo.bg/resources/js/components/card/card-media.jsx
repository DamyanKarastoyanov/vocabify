const CardMedia = (props) => {
    const { children, ...restProps } = props;

    return (
        <div className="bz-card__media" {...restProps}>
            {children}
        </div>
    );
};

export default CardMedia;
