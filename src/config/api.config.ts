import { ApiConfig } from "@/types/api.types";

const getApiUrl = (): string => {
    const apiUrl = import.meta.env.REACT_APP_API_URL;
    if (!apiUrl) {
        console.warn('VITE_API_URL is not defined, using default localhost:8087');
        return 'http://localhost:8087';
    }
    return apiUrl;
};

export const API_CONFIG: ApiConfig = {
    baseURL: getApiUrl(),
    timeout: 5000,
    AUTH_COOKIE_NAME: 'auth_token',
    REFRESH_COOKIE_NAME: 'refresh_token',
    TOKEN_EXPIRY_DAYS: 1,
    IS_PRODUCTION: import.meta.env.PROD,
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            REGISTER: '/auth/register'
        },
        USERS: {
            GET_USER_DATA: '/users/get-data/'
        },
        ADMIN: {
            GETUSERS: '/admin/get-users',
            DELETEUSER: '/admin/delete-user/',
            UPDATE_USER: '/admin/update'
        }
    }
} as const;

export const getFullUrl = (endpoint: string): string => {
    return `${API_CONFIG.baseURL}${endpoint}`;
};

export const getCookieOptions = (expiryDays: number = API_CONFIG.TOKEN_EXPIRY_DAYS) => ({
    expires: expiryDays,
    secure: API_CONFIG.IS_PRODUCTION,
    sameSite: 'strict' as const
});
