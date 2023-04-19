import { Preferences } from '@capacitor/preferences';
import vueRouter from '@/router';
import APIAdapter from './api';
export default class AuthService {
    private static instance: AuthService;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }

    getToken = async () => {
        return Preferences.get({ key: 'token' });
    };

    logIn = async (email: string, password: string) => {
        const api = new APIAdapter();

        await api
            .postWithoutAuth('/truck-drivers/login', {
                email: email,
                password: password,
            })
            .then((response) => {
                this.setToken(response.data.token);
                vueRouter.push({ name: 'Home' });
            });
    };

    logOut = async () => {
        await this.deleteToken();
        vueRouter.push({ name: 'Login' });
    };

    private hasToken = async () => {
        return !!this.getToken();
    };

    private deleteToken = async () => {
        return Preferences.remove({ key: 'token' });
    };

    private setToken = async (token: string) => {
        Preferences.set({ key: 'token', value: token });
    };
}
