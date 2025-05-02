import { getToken } from './auth';

export const isAuthenticated = () => {
    return Boolean(getToken());
};