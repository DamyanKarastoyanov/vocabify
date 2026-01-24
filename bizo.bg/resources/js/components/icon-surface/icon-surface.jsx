const IconSurface = (props) => {
    const { color, style, ...restProps } = props;

    return (
        <div
            className="bz-icon-surface"
            style={{
                ...(color && {
                    "--bz-icon-surface-background-color": `var(--bz-color-${color})`,
                }),
                ...style,
            }}
            {...restProps}
        />
    );
};

export default IconSurface;
