/**
 * External dependencies
 */
import { components } from 'react-select';

/**
 * Internal dependencies
 */
import Icon from '@/components/icon/icon';
import IconX from '@/components/icons/x';

const MultiValueRemove = (props) => {
    return (
        <components.MultiValueRemove {...props}>
            <Icon size="400" icon={IconX} />
        </components.MultiValueRemove>
    );
};

export default MultiValueRemove;
