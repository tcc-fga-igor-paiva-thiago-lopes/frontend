import AuthService from '@/services/auth';

let authService: AuthService;

beforeAll(() => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';

    authService = new AuthService();
});

describe('authService', () => {
    it('should create token in preferences', async () => {
        await authService.setToken('test');
        const token = await authService.getToken();
        expect(token).toEqual('test');
    });

    it('should return token from preferences', async () => {
        const token = await authService.getToken();
        expect(token).toEqual('test');
    });

    it('should return true if token exists', async () => {
        const hasToken = await authService.hasToken();
        expect(hasToken).toEqual(true);
    });

    it('should delete token from preferences', async () => {
        await authService.deleteToken();
        const token = await authService.getToken();
        expect(token).toEqual(null);
    });

    // Failed to mock axios response
    // it('should log in and set token', async () => {
    //     const expectedResponse: AxiosResponse = {
    //         data: { token: 'loggedin' },
    //         status: 200,
    //         statusText: 'OK',
    //         headers: {},
    //         config: {},
    //     };

    //     jest.spyOn(apiAdapter, 'postWithoutAuth').mockImplementation(() =>
    //         Promise.resolve(expectedResponse)
    //     );

    //     await authService.logIn('test', 'test');
    //     const token = await authService.getToken();
    //     expect(token).toEqual('loggedin');
    // });

    // it('should log out and delete token', async () => {
    //     await authService.logOut();
    //     expect(await authService.hasToken).toBeFalsy();
    // });
});
