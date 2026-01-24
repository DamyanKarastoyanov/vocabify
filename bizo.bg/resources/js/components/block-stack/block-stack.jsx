/**
 * External dependencies
 */
import { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import getCssProps from '@/utils/get-css-props';

const BlockStack = forwardRef(function BlockStack(props, ref) {
    const { as, align, className, inlineAlign, gap = '0', height, ...restProps } = props;

    const Component = as || 'div';

    const style = {
        '--bz-block-stack-gap': `var(--bz-space-${gap})`,
        height,
        ...getCssProps('block-stack', [
            ['align', align],
            ['inline-align', inlineAlign],
        ]),
    };

    return <Component ref={ref} className={classNames('bz-block-stack', className)} style={style} {...restProps} />;
});

export default BlockStack;
