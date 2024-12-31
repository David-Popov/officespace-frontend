export type Endpoints = {
    readonly AUTH: {
        readonly LOGIN: string;
        readonly LOGOUT: string;
        readonly REFRESH: string;
        readonly REGISTER: string;
        readonly GET_LOGGED_USER: string
    };
    readonly USERS: {
        readonly GET_USER_DATA: string;
        GET_USER_BY_EMAIL: string;
    };
    readonly ADMIN: {
        readonly GETUSERS: string;
        readonly DELETEUSER: string;
        readonly DELETECOMPANY: string;
        readonly UPDATE_USER: string;
        readonly GETCOMPANIES: string;
        readonly GETRESERVATIONS: string
        readonly GET_COMPANY_BY_ID: string;
        readonly UPDATE_COMPANY: string
    };
    readonly OFFICES: {
        readonly GET_OFFICES: string;
        readonly GET_OFFICE_DATA: string;
        readonly UPDATE_OFFICE: string;
        readonly ADD_OFFICE_RESOURCES: string;
        readonly ADD_OFFICE_RESOURCE: string;
        readonly REMOVE_OFFICE_RESOURCE: string;
        readonly CREATE_OFFICE: string;
        readonly GET_ALL_OFFICES: string;
        readonly GET_OFFICE_BY_ID: string;
        readonly GET_OFFICE_TYPES: string;
        readonly GET_OFFICES_STATUSES: string;
        readonly FILTER_OFFICES: string;
        readonly GET_AVAILABLE_ROOMS: string;
        readonly DELETE_OFFICE: string;
    };
    readonly RESERVATIONS: {
        readonly UPDATE: string;
        readonly CREATE: string;
        readonly GET_BY_ID: string;
        readonly GET_BY_USER_ID: string;
        readonly GET_BY_OFFICE_ROOM_ID: string;
        readonly GET_STATUSES: string;
        readonly DELETE: string;
    };
    readonly TICKETS: {
        readonly CREATE: string;
        readonly UPDATE_STATUS: string;
        readonly GET_ALL_BY_USER: string;
        readonly DELETE: string;
    };
    readonly NOTIFICATIONS: {
        readonly MARK_AS_READ: string
    }
};

    export type ApiConfig = {
        readonly baseURL: string;
        readonly timeout: number;
        readonly AUTH_COOKIE_NAME: string;
        readonly REFRESH_COOKIE_NAME: string;
        readonly TOKEN_EXPIRY_DAYS: number;
        readonly ENDPOINTS: Endpoints;
        readonly IS_PRODUCTION: boolean;
    };
