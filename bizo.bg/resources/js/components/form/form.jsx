/**
 * External dependencies
 */
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';

const Form = (props) => {
    const { children, defaultValues, formValues, ...restProps } = props;

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isEqual(defaultValues, formValues)) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes!';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [defaultValues, formValues]);

    return <form {...restProps}>{children}</form>;
};

export default Form;
