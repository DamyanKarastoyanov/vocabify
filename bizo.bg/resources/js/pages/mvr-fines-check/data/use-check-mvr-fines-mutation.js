/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCheckMVRFinesMutation = () => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                route("mvr-fines-check.submit"),
                data,
            );
            return response.data;
        },
    });
};

export default useCheckMVRFinesMutation;
