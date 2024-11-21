import Cookies from 'js-cookie';

interface CookieOptions {
    expires?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

const defaultOptions: CookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
};

export const cookieService = {
    set(name: string, value: string, options: Partial<Cookies.CookieAttributes> = {}) {
        Cookies.set(name, value, {
            ...defaultOptions,
            ...options
        });
    },

    get(name: string) {
        return Cookies.get(name);
    },

    remove(name: string, options: Partial<Cookies.CookieAttributes> = {}) {
        Cookies.remove(name, {
            ...defaultOptions,
            ...options
        });
    }
};