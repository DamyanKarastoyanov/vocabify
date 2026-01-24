/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCheckVignetteMutation = () => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(
                route("vignette-check.submit"),
                data,
            );
            return response.data;
        },
    });
};

export default useCheckVignetteMutation;
