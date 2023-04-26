import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import vueRouter from '@/router';
import { presentToast } from '@/utils/toast';
import AuthService from './auth';

export const CONFIG: AxiosRequestConfig = {
    timeout: parseInt(process.env.VUE_APP_API_TIMEOUT || '5000', 10),
    baseURL: `${process.env.VUE_APP_API_URL}/`,
    headers: {
        Accept: 'application/json',
    },
};

const addTokenToRequest = async (config: AxiosRequestConfig = CONFIG) => ({
    ...config,
    headers: {
        ...config.headers,
        Authorization: `Bearer ${await AuthService.getToken()}`,
    },
});

const getRequestConfig = (
    config: AxiosRequestConfig = CONFIG,
    requiresAuth = true
) => (requiresAuth ? addTokenToRequest(config) : config);

const responseErrorHandler = (error: any) => {
    const { response } = error;

    if (response.status === 401) {
        AuthService.deleteToken();
        presentToast(
            'Sua sessão expirou, será necessário conectar-se novamente.',
            'danger'
        );
        if (vueRouter.currentRoute.value.name !== 'SignIn') {
            vueRouter.push({ name: 'Login' });
        }
    }

    return Promise.reject(error);
};

export default class APIAdapter {
    private instance: AxiosInstance;

    constructor(instance?: AxiosInstance) {
        this.instance = instance || axios.create(CONFIG);

        this.instance.interceptors.response.use(
            undefined,
            responseErrorHandler
        );
    }

    async postWithoutAuth(
        path: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ) {
        return this.instance.post(
            path,
            data,
            await getRequestConfig(config, false)
        );
    }

    async get(path: string, config?: AxiosRequestConfig) {
        return this.instance.get(path, await getRequestConfig(config, true));
    }

    async post(
        path: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ) {
        return this.instance.post(
            path,
            data,
            await getRequestConfig(config, true)
        );
    }

    async patch(
        path: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ) {
        return this.instance.patch(
            path,
            data,
            await getRequestConfig(config, true)
        );
    }

    async delete(path: string, config?: AxiosRequestConfig) {
        return this.instance.delete(path, await getRequestConfig(config, true));
    }
}
