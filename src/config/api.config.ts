export const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8087',
    timeout: 5000,
    AUTH_COOKIE_NAME: 'auth_token',
    REFRESH_COOKIE_NAME: 'refresh_token',
    TOKEN_EXPIRY_DAYS: 1,
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            REGISTER: '/auth/register'
        },
        USERS: {
            PROFILE: '/users/profile',
            UPDATE: '/users/update'
        }
    }
} as const;