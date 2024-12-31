import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { cookieService } from './cookie';

class Api {
    private static axiosInstance: AxiosInstance | null = null;
    private constructor() { }
    
    
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
            

        }
        return Api.axiosInstance;
    }
}

export const api = Api.getInstance();