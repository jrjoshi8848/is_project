import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001', // Replace with actual API base URL
  withCredentials: true, // Ensure credentials (cookies) are sent with requests
});

let isRefreshing = false; // Prevent multiple refresh attempts

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;
    const { clearAuth } = useAuthStore.getState();

    if (response && response.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        // Send refresh request to get a new access token (if needed)
        const refreshResponse = await apiClient.post('/auth/refresh'); // Assuming this endpoint just returns a message

        // In case we do need to update the access token somehow, add logic here (e.g., if you get the token from another response)
        // Since your backend is only sending a message now, you might want to handle that accordingly (e.g., logging, etc.)
        console.log('Refresh successful: ', refreshResponse.data.message);

        // We don't need to update the access token here since it's handled via cookies
        isRefreshing = false;

        return apiClient.request(originalRequest); // Retry original request
      } catch (err) {
        clearAuth();
        window.location.href = '/login'; // Redirect to login on failure
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;