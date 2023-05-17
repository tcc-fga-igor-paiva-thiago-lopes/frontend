import APIAdapter from '@/services/api';
import { Preferences } from '@capacitor/preferences';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';

import APIError from '@/services/api/apiError';
import { environmentVariablesWrapper } from '../../helpers';

jest.mock('@/router', () => ({
    default: { push: jest.fn(), currentRoute: { value: { name: 'Home' } } },
}));

jest.mock('@capacitor/core', () => ({
    CapacitorHttp: {
        request: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('@capacitor/preferences', () => ({
    Preferences: { get: jest.fn() },
}));

let apiAdapter: APIAdapter;

const DEFAULT_CONFIG: Partial<HttpOptions> = {
    responseType: 'json',
    readTimeout: 5000,
    connectTimeout: 5000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

const truckDriverOne = {
    created_at: '2023-04-03 23:40:51.702511+00:00',
    email: 'bbbb@mail.com',
    id: 23,
    last_sign_in_at: null,
    name: 'bbbb',
    updated_at: '2023-04-03 23:40:51.702511+00:00',
};

type CapacitorHttpMethods = keyof typeof CapacitorHttp;

beforeAll(() => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';
});

describe('apiService', () => {
    beforeEach(() => {
        apiAdapter = new APIAdapter();

        (Preferences as jest.Mocked<typeof Preferences>).get.mockClear();

        jest.spyOn(Preferences, 'get').mockImplementation(() =>
            Promise.resolve({ value: '123' })
        );
    });

    it('should call and return API response data in POST without auth request', async () => {
        const expectedResponse = {
            status: 200,
            headers: {},
            url: 'http://localhost:5000/truck-drivers/login',
            data: { token: '123123' },
        };

        jest.spyOn(CapacitorHttp, 'request').mockImplementation(() =>
            Promise.resolve(expectedResponse)
        );

        const request_data = { email: 'john@mail.com', password: 'Abc12345' };

        const response = await apiAdapter.requestWithoutAuth({
            method: 'POST',
            url: '/truck-drivers/login',
            data: request_data,
        });

        expect(response).toEqual(expectedResponse);
        expect(CapacitorHttp.request).toBeCalledWith({
            ...DEFAULT_CONFIG,
            method: 'POST',
            data: request_data,
            url: 'http://localhost:5000/truck-drivers/login',
        });
        expect(Preferences.get).toHaveBeenCalledTimes(0);
    });

    it('Should throw error when API base URL environment variable is not defined', async () => {
        await environmentVariablesWrapper({ VUE_APP_API_URL: '' }, () => {
            expect(() => {
                new APIAdapter();
            }).toThrow('Environment variable VUE_APP_API_URL is required');
        });
    });

    it.each([
        [
            'get',
            {
                status: 200,
                path: '/truck-drivers',
                requestOptions: {},
                responseData: { data: [truckDriverOne] },
            },
        ],
        [
            'post',
            {
                status: 201,
                path: '/truck-drivers',
                requestOptions: {
                    data: {
                        name: 'John',
                        email: 'john@mail.com',
                        password: 'Abc12345',
                        password_confirmation: 'Abc12345',
                    },
                },
                responseData: { data: truckDriverOne },
            },
        ],
        [
            'patch',
            {
                status: 200,
                path: '/truck-drivers/23',
                requestOptions: { data: { name: 'John Doe' } },
                responseData: { data: truckDriverOne },
            },
        ],
        [
            'put',
            {
                status: 200,
                path: '/truck-drivers/23',
                requestOptions: {
                    data: { ...truckDriverOne, name: 'John Doe' },
                },
                responseData: { data: truckDriverOne },
            },
        ],
        [
            'delete',
            {
                status: 200,
                path: '/truck-drivers',
                requestOptions: {},
                responseData: {},
            },
        ],
        [
            'request',
            {
                status: 200,
                path: '/truck-drivers/login',
                requestOptions: {
                    method: 'POST',
                    data: { email: 'john@mail.com', password: 'Abc12345' },
                },
                responseData: { data: { token: '123' } },
            },
        ],
    ])(
        'should return API response data in %p call with authorization header',
        async (
            method: string,
            params: {
                status: number;
                path: string;
                requestOptions: Partial<HttpOptions>;
                responseData: Partial<HttpResponse>;
            }
        ) => {
            const { path, status, requestOptions, responseData } = params;

            const expectedResponse = {
                status,
                headers: {},
                url: `http://localhost:5000${path}`,
                ...responseData,
            };

            jest.spyOn(CapacitorHttp, method as never).mockImplementation(
                () => Promise.resolve(expectedResponse) as never
            );

            jest.spyOn(Preferences, 'get').mockImplementation(
                () => Promise.resolve({ value: '123' }) as never
            );

            const response = await apiAdapter[method as CapacitorHttpMethods]({
                ...requestOptions,
                url: path,
            });

            expect(response).toEqual(expectedResponse);
            expect(
                CapacitorHttp[method as CapacitorHttpMethods]
            ).toBeCalledWith({
                ...DEFAULT_CONFIG,
                ...requestOptions,
                headers: {
                    ...DEFAULT_CONFIG.headers,
                    Authorization: 'Bearer 123',
                },
                url: `http://localhost:5000${path}`,
            });
            expect(Preferences.get).toHaveBeenCalledWith({ key: 'token' });
        }
    );

    it.each([
        ['get', 400, { data: {} }],
        ['post', 403, { data: { name: 'John' } }],
        ['patch', 404, { data: { name: 'John Doe' } }],
        ['put', 422, { data: { name: 'John', email: 'john@mail.com' } }],
        ['delete', 500, { data: {} }],
        ['request', 503, { method: 'POST', data: {} }],
    ])(
        'Should return throw APIError when %p call fails with %p response code',
        async (
            method: string,
            status: number,
            options: Partial<HttpOptions>
        ) => {
            const expectedResponse = {
                status,
                headers: {},
                url: 'http://localhost:5000/truck-drivers',
                data: {
                    message: 'Not working',
                },
            };

            jest.spyOn(CapacitorHttp, method as never).mockImplementation(
                () => Promise.resolve(expectedResponse) as never
            );

            try {
                await apiAdapter[method as CapacitorHttpMethods]({
                    ...options,
                    url: '/truck-drivers',
                });
            } catch (e) {
                expect((e as APIError).response).toEqual(expectedResponse);
            }

            expect(
                CapacitorHttp[method as CapacitorHttpMethods]
            ).toBeCalledWith({
                ...DEFAULT_CONFIG,
                ...options,
                headers: {
                    ...DEFAULT_CONFIG.headers,
                    Authorization: 'Bearer 123',
                },
                url: 'http://localhost:5000/truck-drivers',
            });
        }
    );
});
