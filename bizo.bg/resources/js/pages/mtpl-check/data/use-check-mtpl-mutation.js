/**
 * External dependencies
 */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCheckMtplMutation = () => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(route("mtpl-check.submit"), data);
            return response.data;
        },
    });
};

export default useCheckMtplMutation;
