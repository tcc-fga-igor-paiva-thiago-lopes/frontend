import AuthService from '@/services/auth';
import { Preferences } from '@capacitor/preferences';

describe('AuthService', () => {
    it('should create token in preferences', async () => {
        await AuthService.setToken('test01');
        expect(Preferences.set).toHaveBeenCalledWith({
            key: 'token',
            value: 'test01',
        });
    });

    it('should return token from preferences', async () => {
        jest.spyOn(Preferences, 'get').mockImplementation(() =>
            Promise.resolve({ value: 'test' })
        );

        const token = await AuthService.getToken();
        expect(token).toBe('test');
    });

    it('should return true if token exists', async () => {
        jest.spyOn(Preferences, 'get').mockImplementation(() =>
            Promise.resolve({ value: 'test' })
        );

        const hasToken = await AuthService.hasToken();
        expect(hasToken).toBe(true);
    });

    it('should delete token from preferences', async () => {
        await AuthService.deleteToken();

        expect(Preferences.remove).toHaveBeenCalledWith({ key: 'token' });
    });

    // TODO: fix these tests
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

    //     await AuthService.logIn('test', 'test');
    //     const token = await AuthService.getToken();
    //     expect(token).toBe('loggedin');
    // });

    // it('should log out and delete token', async () => {
    //     await AuthService.logOut();
    //     expect(await AuthService.hasToken).toBeFalsy();
    // });
});
