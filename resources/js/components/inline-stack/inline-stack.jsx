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
        '--vf-inline-stack-gap': `var(--vf-space-${gap})`,
        '--vf-inline-stack-wrap': wrap ? 'wrap' : 'nowrap',
        '--vf-inline-stack-row-gap': `var(--vf-space-${rowGap ?? gap})`,
        ...getCssProps('inline-stack', [
            ['align', align],
            ['block-align', blockAlign],
        ]),
    };

    return <Component ref={ref} className={classNames('vf-inline-stack', className)} style={style} {...restProps} />;
});

export default InlineStack;
