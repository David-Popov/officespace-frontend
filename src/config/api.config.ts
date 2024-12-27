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
            // PROFILE: '/users/profile',
            // UPDATE: '/users/update',
            GET_USER_DATA: '/users/get-data/',
            GET_USER_BY_EMAIL: '/users/email/'
        },
        ADMIN: {
            GETUSERS: '/admin/get-users',
            DELETEUSER: '/admin/delete-user/',
            UPDATE_USER: '/admin/update'
        },
        OFFICES: {
            GET_OFFICES: '/office-rooms',
            GET_OFFICE_DATA: '/office-rooms/',
            UPDATE_OFFICE: '/office-rooms/update/{id}',
            ADD_OFFICE_RESOURCES: '/office-rooms/{officeRoomId}/resources',
            ADD_OFFICE_RESOURCE: '/office-rooms/{officeRoomId}/resources/{resourceId}',
            REMOVE_OFFICE_RESOURCE: '/office-rooms/{officeRoomId}/resources/{resourceId}',
            CREATE_OFFICE: '/office-rooms/create',
            GET_ALL_OFFICES: '/office-rooms',
            GET_OFFICE_BY_ID: '/office-rooms/{id}',
            GET_OFFICE_TYPES: '/office-rooms/get-types',
            GET_OFFICES_STATUSES: '/office-rooms/get-statuses',
            FILTER_OFFICES: '/office-rooms/filter',
            GET_AVAILABLE_ROOMS: '/office-rooms/availability',
            DELETE_OFFICE: '/office-rooms/delete/{id}',
        },
        RESERVATIONS: {
            UPDATE: '/reservations/update/{id}',
            CREATE: '/reservations/create',
            GET_BY_ID: '/reservations/{id}',
            GET_BY_USER_ID: '/reservations/user/{userId}',
            GET_BY_OFFICE_ROOM_ID: '/reservations/office-room/{officeRoomId}',
            GET_STATUSES: '/reservations/get-statuses',
            DELETE: '/reservations/delete/{id}',
        },
        TICKETS: {
            CREATE: '/tickets/create',
            UPDATE_STATUS: '/tickets/update-status/{id}/status',
            GET_ALL_BY_USER: '/tickets/all/{userId}',
            DELETE: '/tickets/delete/{id}',
        },
    },
} as const;

export const getFullUrl = (endpoint: string): string => {
    return `${API_CONFIG.baseURL}${endpoint}`;
};

export const getCookieOptions = (expiryDays: number = API_CONFIG.TOKEN_EXPIRY_DAYS) => ({
    expires: expiryDays,
    secure: API_CONFIG.IS_PRODUCTION,
    sameSite: 'strict' as const
});
