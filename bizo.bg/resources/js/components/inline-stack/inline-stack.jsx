/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import getCssProps from '@/utils/get-css-props';

const InlineStack = forwardRef(function InlineStack(props, ref) {
    const {
        as,
        align,
        className,
        blockAlign,
        wrap = true,
        gap = '0',
        rowGap,
        style: inlineStyles,
        ...restProps
    } = props;

    const Component = as || 'div';

    const style = {
        ...inlineStyles,
        '--bz-inline-stack-gap': `var(--bz-space-${gap})`,
        '--bz-inline-stack-wrap': wrap ? 'wrap' : 'nowrap',
        '--bz-inline-stack-row-gap': `var(--bz-space-${rowGap ?? gap})`,
        ...getCssProps('inline-stack', [
            ['align', align],
            ['block-align', blockAlign],
        ]),
    };

    return <Component ref={ref} className={classNames('bz-inline-stack', className)} style={style} {...restProps} />;
});

export default InlineStack;
