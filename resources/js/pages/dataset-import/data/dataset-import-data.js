import axios from 'axios';

export async function submitDatasetImport(data) {
    try {
        const response = await axios.post('/datasets', data);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'An error occurred during import.' },
        };
    }
}
