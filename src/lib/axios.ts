import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { cookieService } from './cookie';

class Api {
    private static axiosInstance: AxiosInstance | null = null;

    private constructor() {}

    public static getInstance(): AxiosInstance {
        if (!Api.axiosInstance) {
            Api.axiosInstance = axios.create({
                baseURL: API_CONFIG.baseURL,
                timeout: API_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            // Setup interceptors
            Api.axiosInstance.interceptors.request.use(
                (config: InternalAxiosRequestConfig) => {
                    const token = cookieService.get(API_CONFIG.AUTH_COOKIE_NAME);
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            Api.axiosInstance.interceptors.response.use(
                (response) => response,
                (error) => {
                    if (error?.response?.status === 401) {
                        //TODO TRY TO GET NEW TOKEN WITH REFRESH IF AGAIN HIT 401 then return ERROR
                        cookieService.remove(API_CONFIG.AUTH_COOKIE_NAME);
                    }
                    return Promise.reject(error);
                }
            );
        }
        return Api.axiosInstance;
    }
}

export const api = Api.getInstance();