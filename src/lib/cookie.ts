import Cookies from 'js-cookie';

interface CookieOptions {
    expires?: number | Date;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

const defaultOptions: CookieOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: 7
};

export const cookieService = {
    set(name: string, value: string, options: Partial<Cookies.CookieAttributes> = {}) {
        const finalOptions = {
            ...defaultOptions,
            ...options
        };

        if (typeof finalOptions.expires === 'number') {
            finalOptions.expires = new Date(Date.now() + finalOptions.expires * 24 * 60 * 60 * 1000);
        }

        Cookies.set(name, value, finalOptions);

        try {
            localStorage.setItem(name, value);
        } catch (error) {
            console.warn('Failed to set localStorage backup:', error);
        }
    },

    get(name: string) {
        const cookieValue = Cookies.get(name);
        
        if (!cookieValue) {
            try {
                return localStorage.getItem(name);
            } catch (error) {
                console.warn('Failed to get from localStorage:', error);
            }
        }

        return cookieValue;
    },

    remove(name: string, options: Partial<Cookies.CookieAttributes> = {}) {
        Cookies.remove(name, {
            ...defaultOptions,
            ...options
        });

        try {
            localStorage.removeItem(name);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }
};