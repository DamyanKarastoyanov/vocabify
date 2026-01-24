/**
 * External dependencies
 */
import axios from "axios";

/**
 * @type {import('axios').AxiosInstance}
 */
const httpClient = axios.create({
    baseURL: window.location.origin,
});

export default httpClient;
