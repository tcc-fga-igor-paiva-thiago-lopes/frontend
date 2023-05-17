import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import vueRouter from '@/router';

import AuthService from '../auth';
import APIError from './apiError';
import { presentToast } from '@/utils/toast';

export const DEFAULT_OPTIONS: Partial<HttpOptions> = {
    responseType: 'json',
    readTimeout: parseInt(process.env.VUE_APP_API_TIMEOUT || '5000', 10),
    connectTimeout: parseInt(process.env.VUE_APP_API_TIMEOUT || '5000', 10),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

const getRequestConfig = async (
    options: Partial<HttpOptions>,
    requiresAuth = true
) => ({
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
        ...DEFAULT_OPTIONS.headers,
        ...options.headers,
        ...(requiresAuth && {
            Authorization: `Bearer ${await AuthService.getToken()}`,
        }),
    },
});

const responseErrorHandler = async (response: HttpResponse) => {
    const { status } = response;

    if (status === 401) {
        await AuthService.deleteToken();

        presentToast(
            'Sua sessão expirou, será necessário conectar-se novamente.',
            'danger'
        );

        if (vueRouter.currentRoute.value.name !== 'SignIn') {
            vueRouter.push({ name: 'SignIn' });
        }
    }

    return Promise.reject(new APIError(response));
};

const responseHandler = (response: HttpResponse) => {
    if (response.status >= 400) return responseErrorHandler(response);

    return Promise.resolve(response);
};

export default class APIAdapter {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.verifyApiUrlEnvVariable();

        this.baseUrl = baseUrl
            ? `${process.env.VUE_APP_API_URL}${baseUrl}`
            : `${process.env.VUE_APP_API_URL}`;
    }

    async requestWithoutAuth(options: HttpOptions) {
        console.log(await this.mergeOptions(options, false));

        const response = await CapacitorHttp.request(
            await this.mergeOptions(options, false)
        );

        return responseHandler(response);
    }

    async request(options: HttpOptions) {
        const response = await CapacitorHttp.request(
            await this.mergeOptions(options)
        );

        return responseHandler(response);
    }

    async get(options: HttpOptions) {
        const response = await CapacitorHttp.get(
            await this.mergeOptions(options)
        );

        return responseHandler(response);
    }

    async post(options: HttpOptions) {
        const response = await CapacitorHttp.post(
            await this.mergeOptions(options)
        );

        return responseHandler(response);
    }

    async patch(options: HttpOptions) {
        const response = await CapacitorHttp.patch(
            await this.mergeOptions(options)
        );

        return responseHandler(response);
    }

    async put(options: HttpOptions) {
        const response = await CapacitorHttp.put(
            await this.mergeOptions(options)
        );

        return responseHandler(response);
    }

    async delete(options: HttpOptions) {
        const response = await CapacitorHttp.delete(
            await this.mergeOptions(options)
        );

        return responseHandler(response);
    }

    private async mergeOptions(options: HttpOptions, requiresAuth = true) {
        const defaultOptions = await getRequestConfig(options, requiresAuth);

        return {
            ...defaultOptions,
            ...options,
            url: `${this.baseUrl}${options.url}`,
        };
    }

    private verifyApiUrlEnvVariable() {
        if (!process.env.VUE_APP_API_URL)
            throw Error('Environment variable VUE_APP_API_URL is required');
    }
}
