export type Endpoints = {
    readonly AUTH: {
        readonly LOGIN: string;
        readonly LOGOUT: string;
        readonly REFRESH: string;
        readonly REGISTER: string;
    };
    readonly USERS: {
        readonly GET_USER_DATA: string;
    };
    readonly ADMIN: {
        readonly GETUSERS: string
        readonly DELETEUSER: string;
        readonly UPDATE_USER: string;
    };
    readonly OFFICES: {
        readonly GET_OFFICES: string;
        readonly GET_OFFICE_DATA: string;
    };
    readonly RESERVATIONS: {
        readonly MAKE_RESERVATION: string;
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
