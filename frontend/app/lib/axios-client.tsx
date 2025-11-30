import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setTokens, clearTokens } from "./token-service";
import { BACK_URL } from "./fields";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || BACK_URL;

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// no auth interceptor here
export const axiosAuth = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: RetriableConfig;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.config.headers = item.config.headers ?? {};
      item.config.headers["Authorization"] = `Bearer ${token}`;
      item.resolve(axiosClient(item.config));
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as RetriableConfig | undefined;
    if (!originalConfig) return Promise.reject(error);

    const status = error.response?.status;
    const url = originalConfig.url || "";
    const hasAccessToken = !!getAccessToken();

    const isAuthEndpoint =
      url.startsWith("/auth/login") ||
      url.startsWith("/auth/register") ||
      url.startsWith("/auth/refresh");

    if (
      status === 401 &&
      !originalConfig._retry &&
      hasAccessToken &&
      !isAuthEndpoint
    ) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;

      try {

        const res = await axiosAuth.post("/auth/refresh");
        
        const newAccessToken = (res.data as any).accessToken;

        // only store access token; refresh stays in HttpOnly cookie
        setTokens(newAccessToken, "null");

        processQueue(null, newAccessToken);

        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosClient(originalConfig);
      } catch (refreshError) {
        clearTokens();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
