import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001', // replace with actual API base URL
});

let isRefreshing = false; // Flag to track refresh attempt in progress

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;
    const { clearAuth } = useAuthStore.getState();

    if (response && response.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post('/auth/refresh'); // Refresh token endpoint
        const { accessToken } = refreshResponse.data; // Assuming data contains access token

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        isRefreshing = false;

        return apiClient.request(originalRequest); // Retry original request with new token
      } catch (err) {
        clearAuth();
        window.location.href = '/login'; // Redirect to login on failure
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;