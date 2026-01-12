import api from './backendService';

/**
 * Uploads an image via the Backend Proxy to bypass CORS issues with Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path (ignored by backend proxy currently, but kept for signature).
 * @returns {Promise<string>} - The public download URL.
 */
export const uploadImage = async (file, path = 'reports') => {
    if (!file) return null;

    try {
        const formData = new FormData();
        formData.append('image', file);

        // Post to our new Flask endpoint
        const response = await api.post('/api/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data && response.data.success) {
            return response.data.url;
        } else {
            throw new Error(response.data?.error || 'Upload failed');
        }
    } catch (error) {
        console.error("Upload Error (Proxy):", error);
        throw error;
    }
};
