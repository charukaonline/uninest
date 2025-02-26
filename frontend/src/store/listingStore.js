import axios from 'axios';

const API_URL = 'http://localhost:5000/api/listings';

export const addListing = async (formData) => {
    try {
        console.log('Sending request to:', `${API_URL}/add-listing`);
        console.log('FormData content:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await axios.post(`${API_URL}/add-listing`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        console.log('Response received:', response);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        throw error;
    }
};