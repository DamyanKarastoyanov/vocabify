/**
 * External dependencies
 */
import axios from 'axios';

/**
 * @type {import('axios').AxiosInstance}
 */
const httpClient = axios.create({
    baseURL: window.location.origin,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Set up CSRF token from meta tag
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    httpClient.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

export default httpClient;
