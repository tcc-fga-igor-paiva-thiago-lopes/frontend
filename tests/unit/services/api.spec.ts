import axios, { AxiosInstance } from 'axios';
import APIAdapter, { CONFIG } from '@/services/api';

let apiAdapter: APIAdapter;
let axiosInstance: AxiosInstance;

beforeAll(() => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';

    axiosInstance = axios.create(CONFIG);
    apiAdapter = new APIAdapter(axiosInstance);
});

// I've failed to add test cases to check headers etc
describe('apiService', () => {
    it('should call and return API response data in GET request', async () => {
        const expectedResponse = [
            {
                created_at: '2023-04-03 23:40:51.702511+00:00',
                email: 'bbbb@mail.com',
                id: 23,
                last_sign_in_at: null,
                name: 'bbbb',
                updated_at: '2023-04-03 23:40:51.702511+00:00',
            },
        ];

        jest.spyOn(axiosInstance, 'get').mockImplementation(() =>
            Promise.resolve(expectedResponse)
        );

        expect(await apiAdapter.get('/truck-drivers')).toEqual(
            expectedResponse
        );
    });

    it('should call and return API response data in POST request', async () => {
        const expectedResponse = { id: 1, created: true };

        jest.spyOn(axiosInstance, 'post').mockImplementation(() =>
            Promise.resolve(expectedResponse)
        );

        expect(
            await apiAdapter.post('/truck-drivers', {
                name: 'John Doe',
                age: 33,
            })
        ).toEqual(expectedResponse);
    });

    it('should call and return API response data in PATCH request', async () => {
        jest.spyOn(axiosInstance, 'patch').mockImplementation(() =>
            Promise.resolve({})
        );

        expect(
            await apiAdapter.patch('/truck-drivers/1', {
                name: 'John Doe',
                age: 29,
            })
        ).toEqual({});
    });

    it('should call and return API response data in DELETE request', async () => {
        jest.spyOn(axiosInstance, 'delete').mockImplementation(() =>
            Promise.resolve()
        );

        expect(await apiAdapter.delete('/truck-drivers/1')).toBeFalsy();
    });

    it('should call and return API response data in POST without auth request', async () => {
        jest.spyOn(axiosInstance, 'post').mockImplementation(() =>
            Promise.resolve({})
        );

        expect(
            await apiAdapter.postWithoutAuth('/truck-drivers', {
                name: 'John Doe',
                age: 33,
            })
        ).toEqual({});
    });
});
