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

const getRequestOptions = async (
    options: HttpOptions,
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

    requestWithoutAuth(options: HttpOptions) {
        return this.runOperation('request', options, false);
    }

    request(options: HttpOptions) {
        return this.runOperation('request', options);
    }

    get(options: HttpOptions) {
        return this.runOperation('get', options);
    }

    post(options: HttpOptions) {
        return this.runOperation('post', options);
    }

    patch(options: HttpOptions) {
        return this.runOperation('patch', options);
    }

    put(options: HttpOptions) {
        return this.runOperation('put', options);
    }

    delete(options: HttpOptions) {
        return this.runOperation('delete', options);
    }

    private async runOperation(
        method: keyof typeof CapacitorHttp,
        options: HttpOptions,
        requiresAuth = true
    ) {
        const response = await CapacitorHttp[method](
            await getRequestOptions(
                { ...options, url: `${this.baseUrl}${options.url}` },
                requiresAuth
            )
        );

        return responseHandler(response);
    }

    private verifyApiUrlEnvVariable() {
        if (!process.env.VUE_APP_API_URL)
            throw Error('Environment variable VUE_APP_API_URL is required');
    }
}
