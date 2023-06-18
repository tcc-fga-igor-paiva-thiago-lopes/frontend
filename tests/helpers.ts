import { DOMWrapper } from '@vue/test-utils';

import { HttpOptions } from '@capacitor/core';

export const DEFAULT_API_OPTIONS: Partial<HttpOptions> = {
    responseType: 'json',
    readTimeout: 5000,
    connectTimeout: 5000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

export const fullApiUrl = (endpoint: string, baseUrl = null) =>
    `${baseUrl || process.env.VUE_APP_API_URL}/${endpoint}`;

export const getCSSProperty = (elWrapper: DOMWrapper<Element>, prop: string) =>
    getComputedStyle(elWrapper.element).getPropertyValue(prop);

export const environmentVariablesWrapper = async (
    variables: Record<string, any>,
    callback: () => any
) => {
    const prevEnv = { ...process.env };

    process.env = { ...process.env, ...variables };

    await callback();

    process.env = prevEnv;
};
