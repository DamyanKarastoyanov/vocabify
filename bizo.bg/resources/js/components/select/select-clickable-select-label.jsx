/**
 * External dependencies
 */
import { components } from 'react-select';

/**
 * Internal dependencies
 */
import Button from '@/components/button/button';

const ClickableLabel = (props) => {
    const { data, onClickSelectedLabel } = props;
    const { label, value } = data;

    return (
        <components.MultiValueLabel {...props}>
            <div className="bz-select__clickable-label">
                <Button
                    variant="plain"
                    onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        onClickSelectedLabel && onClickSelectedLabel(data);
                    }}
                >
                    {label}
                </Button>
            </div>
        </components.MultiValueLabel>
    );
};

export default ClickableLabel;
