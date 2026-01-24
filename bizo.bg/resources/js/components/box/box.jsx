/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import sanitizeCssProperties from '@/utils/sanitize-css-props';
import getCssProps from '@/utils/get-css-props';

const Box = forwardRef((props, ref) => {
    const {
        as,
        className,
        position,
        height,
        minHeight,
        maxHeight,
        width,
        minWidth,
        maxWidth,
        padding,
        paddingBlock,
        paddingBlockStart,
        paddingBlockEnd,
        paddingInline,
        paddingInlineStart,
        paddingInlineEnd,
        insetBlockStart,
        insetBlockEnd,
        insetInlineStart,
        insetInlineEnd,
        borderRadius,
        borderStartStartRadius,
        borderStartEndRadius,
        borderEndStartRadius,
        borderEndEndRadius,
        backgroundColor,
        color,
        opacity,
        cursor,
        dangerouslySetInlineStyle,
        children,
        ...restProps
    } = props;
    const Component = as ?? 'div';

    const style = sanitizeCssProperties({
        position,
        opacity,
        cursor,
        ...getCssProps('box', [
            ['width', width],
            ['min-width', minWidth],
            ['max-width', maxWidth],
            ['height', height],
            ['min-height', minHeight],
            ['max-height', maxHeight],
            [
                'padding-block-start',
                paddingBlockStart || paddingBlock || padding,
                (value) => `var(--bz-space-${value})`,
            ],
            ['padding-block-end', paddingBlockEnd || paddingBlock || padding, (value) => `var(--bz-space-${value})`],
            [
                'padding-inline-start',
                paddingInlineStart || paddingInline || padding,
                (value) => `var(--bz-space-${value})`,
            ],
            ['padding-inline-end', paddingInlineEnd || paddingInline || padding, (value) => `var(--bz-space-${value})`],
            [
                'border-start-start-radius',
                borderStartStartRadius || borderRadius,
                (value) => `var(--bz-border-radius-${value})`,
            ],
            [
                'border-start-end-radius',
                borderStartEndRadius || borderRadius,
                (value) => `var(--bz-border-radius-${value})`,
            ],
            [
                'border-end-start-radius',
                borderEndEndRadius || borderRadius,
                (value) => `var(--bz-border-radius-${value})`,
            ],
            [
                'border-end-end-radius',
                borderEndStartRadius || borderRadius,
                (value) => `var(--bz-border-radius-${value})`,
            ],
            ['inset-block-start', insetBlockStart, (value) => `var(--bz-space-${value})`],
            ['inset-block-end', insetBlockEnd, (value) => `var(--bz-space-${value})`],
            ['inset-inline-start', insetInlineStart, (value) => `var(--bz-space-${value})`],
            ['inset-inline-end', insetInlineEnd, (value) => `var(--bz-space-${value})`],
            ['background-color', backgroundColor, (value) => `var(--bz-color-${value})`],
            ['color', color, (value) => `var(--bz-color-${value})`],
        ]),
        ...(dangerouslySetInlineStyle?.__style ?? {}),
    });

    return (
        <Component className={classNames('bz-box', className)} ref={ref} style={style} {...restProps}>
            {children}
        </Component>
    );
});

export default Box;
