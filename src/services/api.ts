import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import vueRouter from '@/router';

const CONFIG: AxiosRequestConfig = {
    timeout: parseInt(process.env.VUE_APP_API_TIMEOUT || '5000', 10),
    baseURL: `${process.env.VUE_APP_API_URL}/`,
    headers: {
        Accept: 'application/json',
    },
};

const addTokenToRequest = (config: AxiosRequestConfig = CONFIG) => ({
    ...config,
    headers: {
        ...config.headers,
        // TODO: add token to requests
        // Authorization: `Bearer ${getToken()}`,
    },
});

const getRequestConfig = (
    config: AxiosRequestConfig = CONFIG,
    requiresAuth = true
) => (requiresAuth ? addTokenToRequest(config) : config);

const responseErrorHandler = (error: any) => {
    const { response } = error;

    if (response.status === 401) {
        // TODO: handle unauthorized request

        if (window.location.pathname !== '/login') {
            vueRouter.push({ name: 'Login' });
        }
    }

    return Promise.reject(error);
};

export default class APIAdapter {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create(CONFIG);

        this.instance.interceptors.response.use(
            undefined,
            responseErrorHandler
        );
    }

    async getWithoutAuth(path: string, config?: AxiosRequestConfig) {
        return this.instance.get(path, getRequestConfig(config, false));
    }

    async postWithoutAuth(
        path: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ) {
        return this.instance.post(path, data, getRequestConfig(config, false));
    }

    async get(path: string, config?: AxiosRequestConfig) {
        return this.instance.get(path, getRequestConfig(config, true));
    }

    async post(
        path: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ) {
        return this.instance.post(path, data, getRequestConfig(config, true));
    }

    async patch(
        path: string,
        data?: Record<string, any>,
        config?: AxiosRequestConfig
    ) {
        return this.instance.patch(path, data, getRequestConfig(config, true));
    }

    async delete(path: string, config?: AxiosRequestConfig) {
        return this.instance.delete(path, getRequestConfig(config, true));
    }
}