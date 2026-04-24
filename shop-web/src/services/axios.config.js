import axios from "axios";

// ================== AXIOS INSTANCE ==================
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ================== REQUEST INTERCEPTOR ==================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================== REFRESH LOGIC ==================
let isRefreshing = false;
let queue = [];

const processQueue = (token) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

// ================== RESPONSE INTERCEPTOR ==================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // ❌ 403
    if (status === 403) {
      window.location.href = "/403";
      return Promise.reject(error);
    }

    // ❌ không phải 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // ❌ tránh loop
    if (
      originalRequest.url.includes("/auth/refresh") ||
      window.location.pathname === "/login"
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ================== QUEUE ==================
    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/refresh`,
        { refreshToken }
      );

      const newAccessToken = res.data.data.accessToken;
      const newRefreshToken = res.data.data.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      processQueue(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
