/**
 * External dependencies
 */
import { FixedSizeList as List } from 'react-window';
import React, { useMemo } from 'react';

const SelectMenuVirtualList = (props) => {
    const { maxHeight } = props;

    const memoizedChildren = useMemo(() => props.children, [props.children]);
    const length = useMemo(() => props.options.length, [props.options]);

    return (
        <List className="bz-select__menu-virtual-list" height={maxHeight} itemCount={length} itemSize={35}>
            {({ index, style }) => <div style={style}>{memoizedChildren[index]}</div>}
        </List>
    );
};

export default SelectMenuVirtualList;
