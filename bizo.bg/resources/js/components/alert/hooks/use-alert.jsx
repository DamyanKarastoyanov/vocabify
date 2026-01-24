/**
 * External dependencies
 */
import { toast } from "sonner";
import { useRef } from "react";
import { isEmpty } from "lodash";

/**
 * Internal dependencies
 */
import { token } from "@/tokens/tokens";

const useAlert = (Component, toastOptions = {}, shouldDismissPrevAlerts) => {
    const hasToastOptions = !isEmpty(toastOptions);

    const isToastInfinite =
        hasToastOptions && toastOptions.duration == Infinity;

    const defaultOptions = {
        className: "bz-alert-toast-container",
        position: "bottom-right",
        unstyled: true,
        style: {
            ...(hasToastOptions && isToastInfinite
                ? {}
                : { width: token("size.8800") }),
        },
    };
    const options = { ...defaultOptions, ...toastOptions };

    const toastIdRef = useRef(null);

    const closeAlert = (toastId) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toastIdRef.current !== null && toast.dismiss(toastIdRef.current);
        }
    };

    const showAlert = (componentProps = {}) => {
        if (shouldDismissPrevAlerts) {
            toast.dismiss();
        }

        const toastId = toast.custom((id) => {
            return (
                <Component onClose={() => closeAlert(id)} {...componentProps} />
            );
        }, options);

        toastIdRef.current = toastId;
    };

    return { showAlert, closeAlert };
};

export default useAlert;
