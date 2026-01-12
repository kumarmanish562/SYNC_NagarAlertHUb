import axios from 'axios';

// Default to localhost for development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Uploads an image to the backend for AI verification (Gemini).
 * @param {File} imageFile - The image file object.
 * @returns {Promise<Object>} - The verification result.
 */
export const verifyImageWithAI = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await api.post('/api/verify-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("AI Verification Error:", error);
        throw error;
    }
};

/**
 * Submits a report to the backend (Firebase + Alerts).
 * @param {Object} reportData - The report details.
 * @returns {Promise<Object>} - The submission result.
 */
export const submitReportToBackend = async (reportData) => {
    try {
        const response = await api.post('/api/submit-report', reportData);
        return response.data;
    } catch (error) {
        console.error("Report Submission Error:", error);
        throw error;
    }
};

export default api;

